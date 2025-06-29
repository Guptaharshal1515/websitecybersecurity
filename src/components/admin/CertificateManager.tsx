
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  description: string;
  image_url: string;
  certificate_url: string;
  type: 'cybersecurity' | 'blockchain';
  created_at: string;
  display_order: number;
}

interface CertificateManagerProps {
  type: 'cybersecurity' | 'blockchain';
}

export const CertificateManager = ({ type }: CertificateManagerProps) => {
  const { themeColors } = useTheme();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    certificate_url: '',
    display_order: 1
  });

  const handleSubmit = () => {
    if (editingId) {
      // Update existing certificate
      setCertificates(prev => prev.map(cert => 
        cert.id === editingId 
          ? { ...cert, ...formData }
          : cert
      ));
    } else {
      // Add new certificate
      const newCert: Certificate = {
        id: Date.now().toString(),
        ...formData,
        type,
        created_at: new Date().toISOString()
      };
      setCertificates(prev => [...prev, newCert]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      certificate_url: '',
      display_order: 1
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (cert: Certificate) => {
    setFormData({
      title: cert.title,
      description: cert.description,
      image_url: cert.image_url,
      certificate_url: cert.certificate_url,
      display_order: cert.display_order
    });
    setEditingId(cert.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 
          className="text-2xl font-bold capitalize"
          style={{ color: themeColors.text }}
        >
          {type} Certificates
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: themeColors.primary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardHeader>
            <CardTitle style={{ color: themeColors.text }}>
              {editingId ? 'Edit Certificate' : 'Add New Certificate'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Certificate Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            />
            <Input
              placeholder="Certificate URL"
              value={formData.certificate_url}
              onChange={(e) => setFormData(prev => ({ ...prev, certificate_url: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
            />
            <div className="flex gap-2">
              <Button onClick={handleSubmit} style={{ backgroundColor: themeColors.primary }}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificates List */}
      <div className="grid gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id} style={{ backgroundColor: themeColors.surface }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold mb-2" style={{ color: themeColors.text }}>
                    {cert.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: themeColors.accent }}>
                    {cert.description}
                  </p>
                  <div className="text-xs" style={{ color: themeColors.accent }}>
                    Order: {cert.display_order}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(cert)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(cert.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
