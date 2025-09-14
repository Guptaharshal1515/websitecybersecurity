
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { CertificateHeader } from '@/components/certificates/CertificateHeader';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { CertificateForm } from '@/components/editor/forms/CertificateForm';
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
  const { themeColors } = useTheme();
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

  // Add dummy certificates if none exist
  const dummyCertificates = certificates.length === 0 ? [
    {
      id: 'dummy-1',
      title: 'CompTIA Security+',
      description: 'Foundational cybersecurity certification covering network security, threats, and vulnerabilities.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/security-plus',
      type: 'cybersecurity',
      display_order: 1,
      completion_date: '2024-01-15'
    },
    {
      id: 'dummy-2',
      title: 'Cisco CyberOps Associate',
      description: 'Security operations center fundamentals and incident response methodologies.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/cyberops',
      type: 'cybersecurity',
      display_order: 2,
      completion_date: '2024-03-22'
    },
    {
      id: 'dummy-3',
      title: 'CEH - Certified Ethical Hacker',
      description: 'Comprehensive ethical hacking and penetration testing methodologies.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/ceh',
      type: 'cybersecurity',
      display_order: 3,
      completion_date: '2024-06-10'
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
        <CertificateHeader 
          title="Cybersecurity Certificates"
          onAddCertificate={() => setShowAddForm(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onUpdate={(id, field, value) => updateCertificateMutation.mutate({ id, field, value })}
              onDelete={(id) => deleteCertificateMutation.mutate(id)}
              enableImagePopup={true}
            />
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
