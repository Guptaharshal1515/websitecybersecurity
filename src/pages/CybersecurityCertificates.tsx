
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { CertificateForm } from '@/components/editor/forms/CertificateForm';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
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
  const { isEditMode, canEdit } = useEditMode();
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

  // Add dummy certificates if none exist
  const dummyCertificates = certificates.length === 0 ? [
    {
      id: 'dummy-1',
      title: 'CompTIA Security+',
      description: 'Foundational cybersecurity certification covering network security, threats, and vulnerabilities.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/security-plus',
      type: 'cybersecurity',
      display_order: 1
    },
    {
      id: 'dummy-2',
      title: 'Cisco CyberOps Associate',
      description: 'Security operations center fundamentals and incident response methodologies.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/cyberops',
      type: 'cybersecurity',
      display_order: 2
    },
    {
      id: 'dummy-3',
      title: 'CEH - Certified Ethical Hacker',
      description: 'Comprehensive ethical hacking and penetration testing methodologies.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/ceh',
      type: 'cybersecurity',
      display_order: 3
    }
  ] : certificates;

  const addCertificateMutation = useMutation({
    mutationFn: async (newCert: any) => {
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

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', 'cybersecurity'] });
      toast({ title: 'Certificate deleted successfully!' });
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <div className="relative">
            <h1 
              className="text-4xl font-bold text-white"
            >
              Cybersecurity Certificates
            </h1>
            <div 
              className="absolute bottom-0 left-0 w-full h-1 rounded mt-2"
              style={{ 
                backgroundColor: themeColors.primary,
                boxShadow: `0 0 10px ${themeColors.primary}`
              }}
            />
          </div>
          
          {canEdit && (
            <AddContentButton onClick={() => setShowAddForm(true)}>
              Add Certificate
            </AddContentButton>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyCertificates.map((cert) => (
            <Card 
              key={cert.id}
              className="border-0 hover:shadow-lg transition-shadow duration-300 group relative"
              style={{ 
                backgroundColor: themeColors.surface,
                boxShadow: `0 0 20px ${themeColors.primary}50`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${themeColors.primary}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${themeColors.primary}50`;
              }}
            >
              <DeleteButton
                onDelete={() => deleteCertificateMutation.mutate(cert.id)}
                isVisible={isEditMode && canEdit}
              />
              <CardContent className="p-6">
                <InlineEditImage
                  value={cert.image_url}
                  onSave={(url) => updateCertificateMutation.mutate({ id: cert.id, field: 'image_url', value: url })}
                  bucket="certificates"
                >
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <img
                      src={cert.image_url || '/placeholder.svg'}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </InlineEditImage>
                
                <InlineEditText
                  value={cert.title}
                  onSave={(value) => updateCertificateMutation.mutate({ id: cert.id, field: 'title', value })}
                >
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {cert.title}
                  </h3>
                </InlineEditText>
                
                <InlineEditText
                  value={cert.description || ''}
                  onSave={(value) => updateCertificateMutation.mutate({ id: cert.id, field: 'description', value })}
                  multiline
                >
                  <p className="text-sm mb-4 leading-relaxed text-white">
                    {cert.description}
                  </p>
                </InlineEditText>
                
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

        <CertificateForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={addCertificateMutation.mutate}
          type="cybersecurity"
        />
      </div>
    </div>
  );
};
