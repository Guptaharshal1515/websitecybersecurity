import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Calendar, Building2, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { BadgeForm } from '@/components/editor/forms/BadgeForm';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { useEditMode } from '@/contexts/EditModeContext';

interface DigitalBadge {
  id: string;
  title: string;
  description: string | null;
  issuer: string;
  issue_date: string | null;
  badge_image_url: string | null;
  credential_url: string | null;
  display_order: number;
}

export const DigitalBadges = () => {
  const { user, userRole } = useAuth();
  const { themeColors } = useTheme();
  const { isEditMode, canEdit } = useEditMode();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState<DigitalBadge | null>(null);

  // Fetch badges
  const { data: badges = [], isLoading } = useQuery({
    queryKey: ['digital-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_badges')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as DigitalBadge[];
    },
  });

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('digital-badges-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'digital_badges'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['digital-badges'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Add badge mutation
  const addBadgeMutation = useMutation({
    mutationFn: async (data: Omit<DigitalBadge, 'id' | 'display_order'>) => {
      const { error } = await supabase
        .from('digital_badges')
        .insert([{ ...data, display_order: badges.length }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-badges'] });
      toast.success('Badge added successfully!');
      setShowAddForm(false);
    },
    onError: (error) => {
      toast.error('Failed to add badge');
      console.error('Error adding badge:', error);
    },
  });

  // Update badge mutation
  const updateBadgeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DigitalBadge> }) => {
      const { error } = await supabase
        .from('digital_badges')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-badges'] });
      toast.success('Badge updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update badge');
      console.error('Error updating badge:', error);
    },
  });

  // Delete badge mutation
  const deleteBadgeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('digital_badges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-badges'] });
      toast.success('Badge deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete badge');
      console.error('Error deleting badge:', error);
    },
  });

  const handleSubmit = (data: Omit<DigitalBadge, 'id' | 'display_order'>) => {
    if (editingBadge) {
      updateBadgeMutation.mutate({ id: editingBadge.id, updates: data });
      setEditingBadge(null);
    } else {
      addBadgeMutation.mutate(data);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-muted rounded-lg mb-4" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Digital Badges
            </h1>
            <p className="text-muted-foreground">
              Industry certifications and achievements
            </p>
          </div>
          
          {canEdit && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Badge
            </Button>
          )}
        </div>

        {badges.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No digital badges yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
              <Card
                key={badge.id}
                className="group relative overflow-hidden border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardContent className="p-6 relative">
                  {isEditMode && canEdit && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingBadge(badge);
                          setShowAddForm(true);
                        }}
                        className="h-8 px-3 bg-primary hover:bg-primary/90"
                      >
                        Edit
                      </Button>
                      <DeleteButton
                        onDelete={() => deleteBadgeMutation.mutate(badge.id)}
                        isVisible={true}
                      />
                    </div>
                  )}

                  {/* Badge Image */}
                  <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-8 group-hover:scale-105 transition-transform duration-500">
                    {isEditMode && canEdit ? (
                      <InlineEditImage
                        value={badge.badge_image_url}
                        onSave={(url) => 
                          updateBadgeMutation.mutate({ 
                            id: badge.id, 
                            updates: { badge_image_url: url } 
                          })
                        }
                        bucket="certificates"
                      >
                        {badge.badge_image_url ? (
                          <img
                            src={badge.badge_image_url}
                            alt={badge.title}
                            className="w-full h-48 object-contain"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center">
                            <Award className="h-24 w-24 text-primary/30" />
                          </div>
                        )}
                      </InlineEditImage>
                    ) : badge.badge_image_url ? (
                      <img
                        src={badge.badge_image_url}
                        alt={badge.title}
                        className="w-full h-48 object-contain"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <Award className="h-24 w-24 text-primary/30" />
                      </div>
                    )}
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Badge Info */}
                  <div className="space-y-3">
                    {isEditMode && canEdit ? (
                      <InlineEditText
                        value={badge.title}
                        onSave={(value) =>
                          updateBadgeMutation.mutate({
                            id: badge.id,
                            updates: { title: value },
                          })
                        }
                      >
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {badge.title}
                        </h3>
                      </InlineEditText>
                    ) : (
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {badge.title}
                      </h3>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {isEditMode && canEdit ? (
                        <InlineEditText
                          value={badge.issuer}
                          onSave={(value) =>
                            updateBadgeMutation.mutate({
                              id: badge.id,
                              updates: { issuer: value },
                            })
                          }
                        >
                          <span>{badge.issuer}</span>
                        </InlineEditText>
                      ) : (
                        <span>{badge.issuer}</span>
                      )}
                    </div>

                    {badge.issue_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(badge.issue_date)}</span>
                      </div>
                    )}

                    {badge.description && (
                      isEditMode && canEdit ? (
                        <InlineEditText
                          value={badge.description}
                          onSave={(value) =>
                            updateBadgeMutation.mutate({
                              id: badge.id,
                              updates: { description: value },
                            })
                          }
                          multiline
                        >
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {badge.description}
                          </p>
                        </InlineEditText>
                      ) : (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {badge.description}
                        </p>
                      )
                    )}

                    {badge.credential_url && (
                      <a
                        href={badge.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        View Credential
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* Decorative corner accent */}
                  <div 
                    className="absolute bottom-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at center, ${themeColors.primary}, transparent)`,
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <BadgeForm
          isOpen={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setEditingBadge(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingBadge}
        />
      </div>
    </div>
  );
};