import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, X, Award } from 'lucide-react';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { CertificateForm } from '@/components/editor/forms/CertificateForm';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { PageTransition } from '@/components/layout/PageTransition';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Certificate {
  id: string;
  title: string;
  description: string;
  image_url: string;
  certificate_url: string;
  created_at: string;
  display_order: number;
  completion_date?: string;
}

export const BlockchainCertificates = () => {
  const { toast } = useToast();
  const { canEdit, isEditMode } = useEditMode();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: certificates = [] } = useQuery({
    queryKey: ['blockchain-certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('type', 'blockchain')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Certificate[];
    },
  });

  const addCertificateMutation = useMutation({
    mutationFn: async (newCert: any) => {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{ ...newCert, type: 'blockchain' }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchain-certificates'] });
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
      queryClient.invalidateQueries({ queryKey: ['blockchain-certificates'] });
      toast({ title: 'Certificate updated successfully!' });
    }
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchain-certificates'] });
      toast({ title: 'Certificate deleted successfully!' });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const nextCertificate = () => {
    if (certificates.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  };

  const prevCertificate = () => {
    if (certificates.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  };

  const currentCert = certificates[currentIndex];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        {/* Background effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          <PageHeader
            title="Blockchain Certificates"
            subtitle="Certifications in blockchain development, Web3, and smart contract security."
            actions={
              canEdit ? (
                <AddContentButton onClick={() => setShowAddForm(true)}>
                  Add Certificate
                </AddContentButton>
              ) : undefined
            }
          />

          {certificates.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No certificates yet</p>
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 items-start pb-16">
              {/* Details sidebar */}
              <motion.div
                className="lg:w-1/3 lg:sticky lg:top-24"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card glow-primary">
                  <CardContent className="p-6">
                    {currentCert ? (
                      <motion.div key={currentIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <InlineEditText
                          value={currentCert.title || ''}
                          onSave={(value) => updateCertificateMutation.mutate({ id: currentCert.id, field: 'title', value })}
                        >
                          <h2 className="text-2xl font-bold mb-4 text-foreground">{currentCert.title}</h2>
                        </InlineEditText>
                        <InlineEditText
                          value={currentCert.description || ''}
                          onSave={(value) => updateCertificateMutation.mutate({ id: currentCert.id, field: 'description', value })}
                          multiline
                        >
                          <p className="text-muted-foreground mb-4 leading-relaxed">{currentCert.description}</p>
                        </InlineEditText>
                        {currentCert.completion_date && (
                          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>Completed: {formatDate(currentCert.completion_date)}</span>
                          </div>
                        )}
                        {currentCert.certificate_url && (
                          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <a href={currentCert.certificate_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" /> View Certificate
                            </a>
                          </Button>
                        )}
                      </motion.div>
                    ) : (
                      <p className="text-muted-foreground text-center">No certificates available.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation Controls */}
                {certificates.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Button onClick={prevCertificate} variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex gap-2">
                      {certificates.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            index === currentIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <Button onClick={nextCertificate} variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Certificate grid */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => setCurrentIndex(index)}
                    className="cursor-pointer"
                  >
                    <Card className={`glass-card transition-all duration-300 hover:scale-[1.02] relative ${
                      index === currentIndex ? 'ring-2 ring-primary glow-primary' : 'hover:border-primary/30'
                    }`}>
                      <DeleteButton
                        onDelete={() => deleteCertificateMutation.mutate(cert.id)}
                        isVisible={isEditMode && canEdit}
                      />
                      <CardContent className="p-4">
                        <InlineEditImage
                          value={cert.image_url}
                          onSave={(url) => updateCertificateMutation.mutate({ id: cert.id, field: 'image_url', value: url })}
                          bucket="certificates"
                        >
                          <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-secondary">
                            <img src={cert.image_url || '/placeholder.svg'} alt={cert.title} className="w-full h-full object-cover" />
                          </div>
                        </InlineEditImage>
                        <h3 className="text-sm font-semibold text-foreground truncate">{cert.title}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Full image modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCertificate(null)}>
            <div className="max-w-4xl w-full max-h-[90vh] overflow-auto rounded-lg relative glass-card p-8" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedCertificate(null)} className="absolute top-4 right-4 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/80">
                <X className="h-5 w-5" />
              </button>
              <img src={selectedCertificate.image_url} alt={selectedCertificate.title} className="w-full h-auto rounded-lg" />
            </div>
          </div>
        )}

        <CertificateForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} onSubmit={addCertificateMutation.mutate} type="blockchain" />
      </div>
    </PageTransition>
  );
};
