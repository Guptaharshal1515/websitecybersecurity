import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { CertificateForm } from '@/components/editor/forms/CertificateForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Award, BookOpen, GraduationCap } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  type: string | null;
  display_order: number | null;
  completion_date: string | null;
}

export const Certificates = () => {
  const { themeColors } = useTheme();
  const { canEdit, isEditMode } = useEditMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates', 'general'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('type', 'general')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Certificate[];
    },
  });

  // Add dummy certificates if none exist for demo purposes
  const dummyCertificates = certificates.length === 0 ? [
    {
      id: 'dummy-1',
      title: 'Google Cloud Professional Certificate',
      description: 'Professional certification in cloud architecture and deployment strategies.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/gcp-cert',
      type: 'general',
      display_order: 1,
      completion_date: '2024-02-15'
    },
    {
      id: 'dummy-2',
      title: 'AWS Solutions Architect',
      description: 'Comprehensive certification covering AWS cloud services and best practices.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/aws-cert',
      type: 'general',
      display_order: 2,
      completion_date: '2024-04-20'
    },
    {
      id: 'dummy-3',
      title: 'Microsoft Azure Fundamentals',
      description: 'Foundation level certification for Microsoft Azure cloud platform.',
      image_url: '/placeholder.svg',
      certificate_url: 'https://example.com/azure-cert',
      type: 'general',
      display_order: 3,
      completion_date: '2024-06-12'
    }
  ] : certificates;

  const addCertificateMutation = useMutation({
    mutationFn: async (newCert: any) => {
      const { data, error } = await supabase
        .from('certificates')
        .insert([{ ...newCert, type: 'general' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', 'general'] });
      toast({ title: 'Certificate added successfully!' });
      setShowAddForm(false);
    },
    onError: (error) => {
      toast({ 
        title: 'Error adding certificate', 
        description: error.message,
        variant: 'destructive' 
      });
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
      queryClient.invalidateQueries({ queryKey: ['certificates', 'general'] });
      toast({ title: 'Certificate deleted successfully!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting certificate', 
        description: error.message,
        variant: 'destructive' 
      });
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
      queryClient.invalidateQueries({ queryKey: ['certificates', 'general'] });
      toast({ title: 'Certificate updated successfully!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating certificate', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: themeColors.primary }}></div>
          <p className="text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        {/* Animated Hero Section */}
        <div className="relative mb-16 text-center">
          <div className="animate-fade-in">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="relative">
                <Award className="h-16 w-16 animate-pulse" style={{ color: themeColors.primary }} />
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ backgroundColor: themeColors.primary }}
                />
              </div>
              <BookOpen className="h-12 w-12 text-muted-foreground animate-bounce delay-100" />
              <GraduationCap className="h-14 w-14 text-muted-foreground animate-bounce delay-200" />
            </div>
            
            <h1 className="text-5xl font-bold text-foreground mb-6 animate-scale-in">
              Professional Certificates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive collection of professional certifications and credentials that showcase 
              my commitment to continuous learning and expertise across various domains.
            </p>
          </div>
          
          {/* Add Certificate Button - Top Right */}
          {canEdit && isEditMode && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="absolute top-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6 rounded-xl animate-fade-in delay-100" style={{ backgroundColor: 'hsl(var(--card))' }}>
            <div className="text-3xl font-bold mb-2" style={{ color: themeColors.primary }}>
              {dummyCertificates.length}
            </div>
            <div className="text-muted-foreground">Total Certificates</div>
          </div>
          
          <div className="text-center p-6 rounded-xl animate-fade-in delay-200" style={{ backgroundColor: 'hsl(var(--card))' }}>
            <div className="text-3xl font-bold mb-2" style={{ color: themeColors.accent }}>
              {new Set(dummyCertificates.map(cert => cert.completion_date?.split('-')[0])).size}
            </div>
            <div className="text-muted-foreground">Years Active</div>
          </div>
          
          <div className="text-center p-6 rounded-xl animate-fade-in delay-300" style={{ backgroundColor: 'hsl(var(--card))' }}>
            <div className="text-3xl font-bold mb-2" style={{ color: themeColors.secondary }}>
              100%
            </div>
            <div className="text-muted-foreground">Completion Rate</div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyCertificates.map((cert, index) => (
            <div 
              key={cert.id}
              className="animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CertificateCard
                certificate={cert}
                onUpdate={(id, field, value) => updateCertificateMutation.mutate({ id, field, value })}
                onDelete={(id) => deleteCertificateMutation.mutate(id)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Award className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-semibold mb-4 text-foreground">No Certificates Yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your professional credential collection by adding your first certificate.
            </p>
            {canEdit && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Certificate
              </Button>
            )}
          </div>
        )}

        {/* Certificate Form Modal */}
        <CertificateForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={addCertificateMutation.mutate}
          type="general"
        />
      </div>
    </div>
  );
};