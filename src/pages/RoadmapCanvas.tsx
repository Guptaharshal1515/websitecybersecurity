import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Move, 
  Trash2, 
  Link2, 
  Save, 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Edit3,
  Target,
  Sparkles,
  BookOpen,
  Settings,
  Grid
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  tags: string[];
  links: string[];
  dependencies: string[];
  estimatedTime: string;
  notes: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'prerequisite' | 'related' | 'sequence';
  label?: string;
}

const nodeCategories = [
  { id: 'fundamentals', label: 'Fundamentals', color: '#3b82f6' },
  { id: 'intermediate', label: 'Intermediate', color: '#f59e0b' },
  { id: 'advanced', label: 'Advanced', color: '#ef4444' },
  { id: 'project', label: 'Project', color: '#10b981' },
  { id: 'certification', label: 'Certification', color: '#8b5cf6' },
  { id: 'practice', label: 'Practice', color: '#06b6d4' }
];

const priorityColors = {
  low: '#10b981',
  medium: '#f59e0b', 
  high: '#ef4444',
  critical: '#dc2626'
};

const statusColors = {
  'not-started': '#6b7280',
  'in-progress': '#3b82f6',
  'completed': '#10b981',
  'blocked': '#ef4444'
};

export const RoadmapCanvas = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState<CanvasNode | null>(null);
  const [connecting, setConnecting] = useState<{ from: string; type: string } | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [filter, setFilter] = useState({ category: 'all', status: 'all' });

  // Access control
  if (!user || userRole === 'viewer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2 text-foreground">Access Restricted</h2>
            <p className="text-muted-foreground">
              {!user ? 'Please log in to view this page.' : 'This page is only available to customers and administrators.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initialize with enhanced sample nodes
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([
        {
          id: 'cybersecurity-basics',
          x: 100,
          y: 100,
          width: 200,
          height: 120,
          title: 'Cybersecurity Fundamentals',
          description: 'Network security basics, threat landscape, security frameworks',
          category: 'fundamentals',
          priority: 'high',
          status: 'completed',
          tags: ['security', 'networking', 'fundamentals'],
          links: ['https://tryhackme.com', 'https://cybrary.it'],
          dependencies: [],
          estimatedTime: '4 weeks',
          notes: 'Start with TryHackMe rooms and basic networking concepts'
        },
        {
          id: 'ethical-hacking',
          x: 400,
          y: 100,
          width: 200,
          height: 120,
          title: 'Ethical Hacking & Penetration Testing',
          description: 'OWASP Top 10, vulnerability assessment, penetration testing methodologies',
          category: 'intermediate',
          priority: 'high',
          status: 'in-progress',
          tags: ['pentesting', 'OWASP', 'security'],
          links: ['https://hackthebox.com', 'https://portswigger.net'],
          dependencies: ['cybersecurity-basics'],
          estimatedTime: '8 weeks',
          notes: 'Focus on web application security and common vulnerabilities'
        },
        {
          id: 'incident-response',
          x: 250,
          y: 300,
          width: 200,
          height: 120,
          title: 'Incident Response & Forensics',
          description: 'Digital forensics, incident handling, malware analysis',
          category: 'advanced',
          priority: 'medium',
          status: 'not-started',
          tags: ['forensics', 'incident-response', 'malware'],
          links: ['https://sans.org', 'https://volatilityfoundation.org'],
          dependencies: ['cybersecurity-basics', 'ethical-hacking'],
          estimatedTime: '6 weeks',
          notes: 'Prepare for SANS GCIH or similar certification'
        }
      ]);
      setConnections([
        { 
          id: 'conn1', 
          from: 'cybersecurity-basics', 
          to: 'ethical-hacking', 
          type: 'prerequisite',
          label: 'Foundation for'
        },
        { 
          id: 'conn2', 
          from: 'ethical-hacking', 
          to: 'incident-response', 
          type: 'sequence',
          label: 'Leads to'
        }
      ]);
    }
  }, [nodes.length]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === svgRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }

    if (draggedNode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newX = (e.clientX - rect.left - dragOffset.x - panOffset.x) / scale;
      const newY = (e.clientY - rect.top - dragOffset.y - panOffset.y) / scale;

      setNodes(prev => prev.map(node => 
        node.id === draggedNode 
          ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
          : node
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    if (connecting) {
      if (connecting.from !== nodeId) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          from: connecting.from,
          to: nodeId,
          type: connecting.type as any
        };
        setConnections(prev => [...prev, newConnection]);
        toast({ title: 'Nodes connected successfully!' });
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
      x: (e.clientX - rect.left - panOffset.x) / scale - node.x,
      y: (e.clientY - rect.top - panOffset.y) / scale - node.y
    });
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
    toast({ title: 'Node deleted successfully!' });
  };

  const deleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
    setSelectedConnection(null);
    toast({ title: 'Connection deleted successfully!' });
  };

  const startConnection = (fromNodeId: string, type: string) => {
    setConnecting({ from: fromNodeId, type });
    toast({ title: 'Click on target node to create connection' });
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.3));
  };

  const resetView = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getCategoryColor = (category: string) => {
    return nodeCategories.find(c => c.id === category)?.color || '#6b7280';
  };

  const getFilteredNodes = () => {
    return nodes.filter(node => {
      const categoryMatch = filter.category === 'all' || node.category === filter.category;
      const statusMatch = filter.status === 'all' || node.status === filter.status;
      return categoryMatch && statusMatch;
    });
  };

  const NodeForm = () => {
    const [formData, setFormData] = useState({
      title: editingNode?.title || '',
      description: editingNode?.description || '',
      category: editingNode?.category || 'fundamentals',
      priority: editingNode?.priority || 'medium',
      status: editingNode?.status || 'not-started',
      tags: editingNode?.tags.join(', ') || '',
      links: editingNode?.links.join('\n') || '',
      estimatedTime: editingNode?.estimatedTime || '',
      notes: editingNode?.notes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const nodeData: CanvasNode = {
        id: editingNode?.id || `node-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority as any,
        status: formData.status as any,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        links: formData.links.split('\n').map(link => link.trim()).filter(Boolean),
        dependencies: editingNode?.dependencies || [],
        estimatedTime: formData.estimatedTime,
        notes: formData.notes,
        x: editingNode?.x || 300,
        y: editingNode?.y || 300,
        width: editingNode?.width || 200,
        height: editingNode?.height || 120
      };

      if (editingNode) {
        setNodes(prev => prev.map(n => n.id === editingNode.id ? nodeData : n));
        toast({ title: 'Node updated successfully!' });
      } else {
        setNodes(prev => [...prev, nodeData]);
        toast({ title: 'Node created successfully!' });
      }

      setShowNodeForm(false);
      setEditingNode(null);
    };

    return (
      <Dialog open={showNodeForm} onOpenChange={setShowNodeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNode ? 'Edit' : 'Create'} Learning Node</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Estimated Time</Label>
                <Input
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="e.g., 4 weeks"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' | 'critical' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'not-started' | 'in-progress' | 'completed' | 'blocked' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="security, networking, fundamentals"
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

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                placeholder="Additional notes or tips..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingNode ? 'Update' : 'Create'} Node
              </Button>
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
    <div className={`min-h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="container mx-auto px-4 py-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Learning Roadmap Canvas</h1>
            <p className="text-muted-foreground">Interactive learning path designer</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filters */}
            <Select value={filter.category} onValueChange={(value) => setFilter(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {nodeCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            {/* Controls */}
            <div className="flex gap-1 border rounded-md p-1">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowGrid(!showGrid)}>
                <Grid className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={addNode} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Node
            </Button>
            
            <Button onClick={toggleFullscreen} variant="outline" className="flex items-center gap-2">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Connection Mode Indicator */}
        {connecting && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex-shrink-0">
            <p className="text-primary font-medium">
              🔗 Connection Mode: Click on target node to connect from "{nodes.find(n => n.id === connecting.from)?.title}"
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setConnecting(null)}
              className="mt-2"
            >
              Cancel Connection
            </Button>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 border rounded-lg overflow-hidden bg-background relative">
          <div
            ref={canvasRef}
            className="w-full h-full relative cursor-move"
            style={{ 
              backgroundImage: showGrid ? `
                radial-gradient(circle, hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)
              ` : 'none',
              backgroundSize: showGrid ? `${20 * scale}px ${20 * scale}px` : 'auto',
              backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* SVG for connections */}
            <svg 
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ 
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
                transformOrigin: '0 0'
              }}
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
                </marker>
              </defs>
              {connections.map((conn) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const fromX = fromNode.x + fromNode.width / 2;
                const fromY = fromNode.y + fromNode.height / 2;
                const toX = toNode.x + toNode.width / 2;
                const toY = toNode.y + toNode.height / 2;

                return (
                  <g key={conn.id}>
                    <line
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke="hsl(var(--primary))"
                      strokeWidth={selectedConnection === conn.id ? "3" : "2"}
                      markerEnd="url(#arrowhead)"
                      className="cursor-pointer pointer-events-auto"
                      onClick={() => setSelectedConnection(conn.id)}
                    />
                    {conn.label && (
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 - 10}
                        textAnchor="middle"
                        className="fill-primary text-xs font-medium pointer-events-none"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {getFilteredNodes().map((node) => (
              <div
                key={node.id}
                className={`absolute select-none cursor-move border-2 rounded-lg shadow-lg transition-all duration-200 ${
                  connecting ? 'border-yellow-400 cursor-pointer hover:border-yellow-500' : 'border-transparent hover:border-primary/50'
                } ${selectedNodes.includes(node.id) ? 'ring-2 ring-primary' : ''}`}
                style={{ 
                  left: node.x, 
                  top: node.y,
                  width: node.width,
                  height: node.height,
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
                  transformOrigin: '0 0',
                  backgroundColor: `${getCategoryColor(node.category)}15`,
                  borderColor: connecting ? '#fbbf24' : getCategoryColor(node.category)
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                <div className="p-3 h-full flex flex-col relative group">
                  {/* Status indicator */}
                  <div 
                    className="absolute top-1 right-1 w-3 h-3 rounded-full" 
                    style={{ backgroundColor: statusColors[node.status] }}
                    title={node.status}
                  />

                  {/* Priority indicator */}
                  <div 
                    className="absolute top-1 left-1 w-2 h-6 rounded" 
                    style={{ backgroundColor: priorityColors[node.priority] }}
                    title={`${node.priority} priority`}
                  />

                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
                      {node.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {node.description}
                    </p>
                    
                    {node.estimatedTime && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {node.estimatedTime}
                      </Badge>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      {node.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/90 backdrop-blur-sm rounded p-1 border">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        editNode(node);
                      }}
                      title="Edit"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        startConnection(node.id, 'prerequisite');
                      }}
                      title="Connect"
                    >
                      <Link2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Resource links */}
                  {node.links.length > 0 && (
                    <div className="absolute -bottom-6 left-0 right-0 flex gap-1 justify-center">
                      {node.links.slice(0, 3).map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:text-primary/80 bg-background/90 backdrop-blur-sm rounded px-2 py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BookOpen className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-muted-foreground space-y-1 flex-shrink-0">
          <p>• Drag nodes to reposition • Hover over nodes for controls • Use zoom and pan controls</p>
          <p>• Scale: {Math.round(scale * 100)}% • Nodes: {nodes.length} • Connections: {connections.length}</p>
        </div>
      </div>

      {/* Selected Connection Actions */}
      {selectedConnection && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">Connection Selected</p>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => deleteConnection(selectedConnection)}
          >
            Delete Connection
          </Button>
        </div>
      )}

      <NodeForm />
    </div>
  );
};