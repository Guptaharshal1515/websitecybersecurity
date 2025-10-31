import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { CertificateForm } from '@/components/editor/forms/CertificateForm';
import { GlobalEditModeToolbar } from '@/components/editor/GlobalEditModeToolbar';
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
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

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

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('certificates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'certificates',
          filter: `type=eq.general`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['certificates', 'general'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
      setEditingCert(null);
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

  const handleSubmit = (data: any) => {
    if (editingCert) {
      updateCertificateMutation.mutate({
        id: editingCert.id,
        field: 'all',
        value: JSON.stringify(data)
      });
    } else {
      addCertificateMutation.mutate(data);
    }
  };

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
      <GlobalEditModeToolbar />
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
              Certificates & Credentials
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Diverse certifications spanning multiple disciplines, from cloud technologies to emerging frameworks,
              demonstrating my dedication to staying at the forefront of industry innovation.
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
        <div className="flex justify-center mb-16">
          <div className="text-center p-8 rounded-2xl animate-fade-in border-2 hover:scale-105 transition-all duration-300" 
               style={{ 
                 backgroundColor: 'hsl(var(--card))', 
                 borderColor: themeColors.primary,
                 boxShadow: `0 0 30px ${themeColors.primary}20`
               }}>
            <div className="text-4xl font-bold mb-3" style={{ color: themeColors.primary }}>
              {dummyCertificates.length}
            </div>
            <div className="text-lg text-muted-foreground font-medium">Professional Certificates</div>
            <div className="mt-2 text-sm text-muted-foreground/70">Verified & Authentic</div>
          </div>
        </div>

        {/* Certificates Showcase - Unique Hexagonal Layout */}
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, ${themeColors.primary} 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyCertificates.map((cert, index) => (
              <div
                key={cert.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CertificateCard
                  certificate={cert}
                  onUpdate={(id, field, value) => updateCertificateMutation.mutate({ id, field, value })}
                  onDelete={(id) => deleteCertificateMutation.mutate(id)}
                  enableImagePopup={true}
                />
              </div>
            ))}
          </div>
        </div>


        {/* Certificate Form Modal */}
        <CertificateForm
          isOpen={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setEditingCert(null);
          }}
          onSubmit={handleSubmit}
          type="general"
        />
      </div>
    </div>
  );
};