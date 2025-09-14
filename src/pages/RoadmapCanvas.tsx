import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Move, Trash2, Link, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  color: string;
  links: string[];
}

interface Connection {
  from: string;
  to: string;
}

export const RoadmapCanvas = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState<CanvasNode | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Access control
  if (!user || userRole === 'viewer') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Restricted
            </h2>
            <p style={{ color: themeColors.accent }}>
              {!user ? 'Please log in to view this page.' : 'This page is only available to customers and administrators.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initialize with sample nodes
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([
        {
          id: 'cybersecurity',
          x: 100,
          y: 100,
          title: 'Cybersecurity Fundamentals',
          description: 'Learn the basics of cybersecurity, including network security, ethical hacking, and penetration testing.',
          color: '#ef4444',
          links: ['https://tryhackme.com', 'https://hackthebox.com']
        },
        {
          id: 'blockchain',
          x: 400,
          y: 100,
          title: 'Blockchain Development',
          description: 'Master blockchain technology, smart contracts, and Web3 development.',
          color: '#3b82f6',
          links: ['https://cryptozombies.io', 'https://ethereum.org']
        },
        {
          id: 'cloud',
          x: 250,
          y: 300,
          title: 'Cloud Infrastructure',
          description: 'Learn cloud platforms, DevOps, and cloud security best practices.',
          color: '#10b981',
          links: ['https://aws.amazon.com', 'https://cloud.google.com']
        }
      ]);
      setConnections([
        { from: 'cybersecurity', to: 'cloud' },
        { from: 'blockchain', to: 'cloud' }
      ]);
    }
  }, [nodes.length]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (connecting) {
      // Create connection
      if (connecting !== nodeId) {
        setConnections(prev => [...prev, { from: connecting, to: nodeId }]);
      }
      setConnecting(null);
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setNodes(prev => prev.map(node => 
      node.id === draggedNode 
        ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
        : node
    ));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const addNode = () => {
    setEditingNode(null);
    setShowNodeForm(true);
  };

  const editNode = (node: CanvasNode) => {
    setEditingNode(node);
    setShowNodeForm(true);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
  };

  const saveNodes = () => {
    // Here you would save to Supabase
    toast({ title: 'Roadmap saved successfully!' });
  };

  const NodeForm = () => {
    const [formData, setFormData] = useState({
      title: editingNode?.title || '',
      description: editingNode?.description || '',
      color: editingNode?.color || '#3b82f6',
      links: editingNode?.links.join('\n') || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const nodeData = {
        id: editingNode?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        color: formData.color,
        links: formData.links.split('\n').filter(link => link.trim()),
        x: editingNode?.x || 200,
        y: editingNode?.y || 200
      };

      if (editingNode) {
        setNodes(prev => prev.map(n => n.id === editingNode.id ? nodeData : n));
      } else {
        setNodes(prev => [...prev, nodeData]);
      }

      setShowNodeForm(false);
      setEditingNode(null);
    };

    return (
      <Dialog open={showNodeForm} onOpenChange={setShowNodeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNode ? 'Edit' : 'Add'} Learning Node</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
            <div>
              <Label>Resource Links (one per line)</Label>
              <Textarea
                value={formData.links}
                onChange={(e) => setFormData(prev => ({ ...prev, links: e.target.value }))}
                placeholder="https://example.com&#10;https://another-resource.com"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Save</Button>
              <Button type="button" variant="outline" onClick={() => setShowNodeForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Learning Roadmap Canvas</h1>
          <div className="flex gap-2">
            <Button onClick={addNode} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Node
            </Button>
            <Button 
              onClick={() => setConnecting(connecting ? null : 'select')}
              variant={connecting ? 'secondary' : 'outline'}
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              {connecting ? 'Cancel Connect' : 'Connect Nodes'}
            </Button>
            <Button onClick={saveNodes} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {connecting && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
            Click on nodes to connect them. Click "Cancel Connect" when done.
          </div>
        )}

        <div 
          ref={canvasRef}
          className="relative w-full h-[600px] border rounded-lg overflow-hidden"
          style={{ backgroundColor: themeColors.surface }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, index) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={index}
                  x1={fromNode.x + 75}
                  y1={fromNode.y + 50}
                  x2={toNode.x + 75}
                  y2={toNode.y + 50}
                  stroke={themeColors.primary}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={themeColors.primary}
                />
              </marker>
            </defs>
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-32 h-20 rounded-lg p-2 cursor-move border-2 ${
                connecting ? 'border-yellow-400 cursor-pointer' : 'border-transparent'
              }`}
              style={{ 
                left: node.x, 
                top: node.y, 
                backgroundColor: node.color + '20',
                borderColor: connecting ? '#fbbf24' : node.color
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
            >
              <div className="text-xs font-semibold text-white mb-1 line-clamp-2">
                {node.title}
              </div>
              <div className="text-xs text-gray-300 line-clamp-2">
                {node.description}
              </div>
              
              {/* Node controls */}
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    editNode(node);
                  }}
                >
                  <Move className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Resource links */}
              {node.links.length > 0 && (
                <div className="absolute -bottom-6 left-0 right-0 flex gap-1 justify-center">
                  {node.links.slice(0, 2).map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>• Drag nodes to move them around</p>
          <p>• Use "Connect Nodes" to create learning paths</p>
          <p>• Click on link icons (🔗) to access resources</p>
        </div>
      </div>

      <NodeForm />
    </div>
  );
};