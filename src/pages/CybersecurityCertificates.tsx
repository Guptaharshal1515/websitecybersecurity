
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Plus } from 'lucide-react';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { LiveEditWrapper } from '@/components/admin/LiveEditWrapper';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  type: string | null;
  display_order: number | null;
}

export const CybersecurityCertificates = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates', 'cybersecurity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('type', 'cybersecurity')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Certificate[];
    },
  });

  const addCertificateMutation = useMutation({
    mutationFn: async (newCert: { title: string; description: string; completion_date: string }) => {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{ ...newCert, type: 'cybersecurity' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', 'cybersecurity'] });
      toast({ title: 'Certificate added successfully!' });
      setShowAddForm(false);
    }
  });

  const updateCertificateMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: string }) => {
      const { data, error } = await supabase
        .from('certificates')
        .update({ [field]: value })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', 'cybersecurity'] });
      toast({ title: 'Certificate updated successfully!' });
    }
  });

  const handleImageSave = async (id: string, url: string | null) => {
    updateCertificateMutation.mutate({ id, field: 'image_url', value: url || '' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <h1 
            className="text-4xl font-bold"
            style={{ color: themeColors.primary }}
          >
            Cybersecurity Certificates
          </h1>
          
          {userRole === 'admin' && (
            <Button
              onClick={() => setShowAddForm(true)}
              style={{ backgroundColor: themeColors.primary }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <Card 
              key={cert.id}
              className="border-0 hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <EditableImage
                    src={cert.image_url}
                    alt={cert.title}
                    onSave={(url) => handleImageSave(cert.id, url)}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <EditableText
                  value={cert.title}
                  onSave={(value) => updateCertificateMutation.mutate({ id: cert.id, field: 'title', value })}
                  className="text-xl font-semibold mb-2"
                  placeholder="Certificate title"
                />
                
                <EditableText
                  value={cert.description || ''}
                  onSave={(value) => updateCertificateMutation.mutate({ id: cert.id, field: 'description', value })}
                  multiline={true}
                  className="text-sm mb-4 leading-relaxed"
                  placeholder="Certificate description"
                />
                
                {cert.certificate_url && (
                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: themeColors.primary, color: 'white' }}
                  >
                    View Certificate
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
