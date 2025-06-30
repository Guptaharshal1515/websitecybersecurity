
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  type: string | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface CertificateManagerProps {
  type: 'cybersecurity' | 'blockchain';
}

export const CertificateManager = ({ type }: CertificateManagerProps) => {
  const { themeColors } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    certificate_url: '',
    display_order: 1
  });

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('type', type)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Certificate[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCert: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('certificates')
        .insert([newCert])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', type] });
      toast({ title: 'Certificate created successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error creating certificate', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Certificate> & { id: string }) => {
      const { data, error } = await supabase
        .from('certificates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', type] });
      toast({ title: 'Certificate updated successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error updating certificate', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', type] });
      toast({ title: 'Certificate deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting certificate', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData, type });
    } else {
      createMutation.mutate({ ...formData, type });
    }
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
      description: cert.description || '',
      image_url: cert.image_url || '',
      certificate_url: cert.certificate_url || '',
      display_order: cert.display_order || 1
    });
    setEditingId(cert.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading certificates...</div>;
  }

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
              <Button 
                onClick={handleSubmit} 
                style={{ backgroundColor: themeColors.primary }}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
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
                    disabled={deleteMutation.isPending}
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
