import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Calendar, Building2, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BadgeForm } from '@/components/editor/forms/BadgeForm';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { useEditMode } from '@/contexts/EditModeContext';
import { PageTransition } from '@/components/layout/PageTransition';
import { PageHeader } from '@/components/layout/PageHeader';
import { motion } from 'framer-motion';

interface DigitalBadge {
  id: string;
  title: string;
  description: string | null;
  issuer: string;
  issue_date: string | null;
  badge_image_url: string | null;
  credential_url: string | null;
  category: string | null;
  display_order: number;
}

export const DigitalBadges = () => {
  const { userRole } = useAuth();
  const { isEditMode, canEdit } = useEditMode();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState<DigitalBadge | null>(null);

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ['digital-badges'],
    queryFn: async () => {
      const { data, error } = await supabase.from('digital_badges').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return data as DigitalBadge[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('digital-badges-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'digital_badges' }, () => {
        queryClient.invalidateQueries({ queryKey: ['digital-badges'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const addBadgeMutation = useMutation({
    mutationFn: async (data: Omit<DigitalBadge, 'id' | 'display_order'>) => {
      const { error } = await supabase.from('digital_badges').insert([{ ...data, display_order: badges.length }]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['digital-badges'] }); toast.success('Badge added!'); setShowAddForm(false); },
    onError: () => toast.error('Failed to add badge'),
  });

  const updateBadgeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DigitalBadge> }) => {
      const { error } = await supabase.from('digital_badges').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['digital-badges'] }); toast.success('Badge updated!'); },
    onError: () => toast.error('Failed to update badge'),
  });

  const deleteBadgeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('digital_badges').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['digital-badges'] }); toast.success('Badge deleted!'); },
    onError: () => toast.error('Failed to delete badge'),
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
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const badgesByCategory = badges.reduce((acc, badge) => {
    const category = badge.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(badge);
    return acc;
  }, {} as Record<string, DigitalBadge[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card animate-pulse">
                <CardContent className="p-6"><div className="h-48 bg-muted rounded-lg mb-4" /><div className="h-6 bg-muted rounded mb-2" /><div className="h-4 bg-muted rounded" /></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative pb-12">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          <PageHeader
            title="Digital Badges"
            subtitle="Industry certifications and verified achievements."
            actions={
              canEdit ? (
                <Button onClick={() => setShowAddForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Badge
                </Button>
              ) : undefined
            }
          />

          {badges.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No digital badges yet</p>
            </motion.div>
          ) : (
            Object.entries(badgesByCategory).map(([category, categoryBadges], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
                  <Award className="h-6 w-6" />
                  {category}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -6 }}
                    >
                      <Card className="glass-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl border-primary/20 hover:border-primary/40">
                        <CardContent className="p-6 relative">
                          <DeleteButton onDelete={() => deleteBadgeMutation.mutate(badge.id)} isVisible={isEditMode && canEdit} />

                          {/* Badge Image */}
                          <div className="relative mb-4 overflow-hidden rounded-lg p-8 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-105 transition-transform duration-500">
                            <InlineEditImage
                              value={badge.badge_image_url}
                              onSave={(url) => updateBadgeMutation.mutate({ id: badge.id, updates: { badge_image_url: url } })}
                              bucket="badges"
                            >
                              {badge.badge_image_url ? (
                                <motion.img whileHover={{ scale: 1.1, rotate: 5 }} src={badge.badge_image_url} alt={badge.title} className="w-full h-48 object-contain" />
                              ) : (
                                <div className="w-full h-48 flex items-center justify-center">
                                  <Award className="h-24 w-24 text-primary/30" />
                                </div>
                              )}
                            </InlineEditImage>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          </div>

                          {/* Badge Info */}
                          <div className="space-y-3">
                            <InlineEditText value={badge.title} onSave={(value) => updateBadgeMutation.mutate({ id: badge.id, updates: { title: value } })}>
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{badge.title}</h3>
                            </InlineEditText>

                            <div className="flex items-center gap-2 text-sm text-primary">
                              <Building2 className="h-4 w-4" />
                              <InlineEditText value={badge.issuer} onSave={(value) => updateBadgeMutation.mutate({ id: badge.id, updates: { issuer: value } })}>
                                <span className="font-semibold">{badge.issuer}</span>
                              </InlineEditText>
                            </div>

                            {badge.issue_date && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="font-mono">{formatDate(badge.issue_date)}</span>
                              </div>
                            )}

                            {badge.description && (
                              <InlineEditText value={badge.description} onSave={(value) => updateBadgeMutation.mutate({ id: badge.id, updates: { description: value } })} multiline>
                                <p className="text-sm text-muted-foreground line-clamp-3">{badge.description}</p>
                              </InlineEditText>
                            )}

                            {badge.credential_url && (
                              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={badge.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                View Credential <ExternalLink className="h-4 w-4" />
                              </motion.a>
                            )}

                            {isEditMode && canEdit && (
                              <Button variant="outline" size="sm" className="w-full mt-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => { setEditingBadge(badge); setShowAddForm(true); }}>
                                Edit Badge
                              </Button>
                            )}
                          </div>

                          <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_center,hsl(var(--primary)),transparent)]" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          )}

          <BadgeForm
            isOpen={showAddForm}
            onClose={() => { setShowAddForm(false); setEditingBadge(null); }}
            onSubmit={handleSubmit}
            initialData={editingBadge ? {
              title: editingBadge.title, description: editingBadge.description || '', issuer: editingBadge.issuer,
              issue_date: editingBadge.issue_date, badge_image_url: editingBadge.badge_image_url,
              credential_url: editingBadge.credential_url, category: editingBadge.category
            } : null}
          />
        </div>
      </div>
    </PageTransition>
  );
};
