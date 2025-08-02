import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { CertificateHeader } from '@/components/certificates/CertificateHeader';
import { useAuth } from '@/contexts/AuthContext';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { useEditMode } from '@/contexts/EditModeContext';

interface AdditionalCertificate {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  certificate_url?: string;
  completion_date?: string;
  display_order: number;
}

export default function AdditionalCertificates() {
  const [certificates, setCertificates] = useState<AdditionalCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userRole } = useAuth();
  const { isEditMode } = useEditMode();

  const canEdit = userRole === 'admin' || userRole === 'editor';

  useEffect(() => {
    fetchCertificates();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('additional-certificates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'additional_certificates'
        },
        () => {
          fetchCertificates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('additional_certificates')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching additional certificates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCertificate = async (id: string, updates: Partial<AdditionalCertificate>) => {
    try {
      const { error } = await supabase
        .from('additional_certificates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating certificate:', error);
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('additional_certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <CertificateHeader
          title="Additional Certificates"
          onAddCertificate={() => window.location.href = '/admin'}
        />
        
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No additional certificates found.</p>
            {canEdit && isEditMode && (
              <AddContentButton onClick={() => window.location.href = '/admin'}>
                Add Certificate
              </AddContentButton>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={{
                  ...certificate,
                  description: certificate.description || '',
                  image_url: certificate.image_url || null,
                  certificate_url: certificate.certificate_url || null,
                  type: 'additional'
                }}
                onUpdate={(id, field, value) => updateCertificate(id, { [field]: value })}
                onDelete={deleteCertificate}
              />
            ))}
          </div>
        )}

        {canEdit && isEditMode && certificates.length > 0 && (
          <div className="mt-8 text-center">
            <AddContentButton onClick={() => window.location.href = '/admin'}>
              Add Certificate
            </AddContentButton>
          </div>
        )}
      </div>
    </div>
  );
}