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
import { GlobalEditModeToolbar } from '@/components/editor/GlobalEditModeToolbar';
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

  // Group badges by category
  const badgesByCategory = badges?.reduce((acc, badge) => {
    const category = badge.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(badge);
    return acc;
  }, {} as Record<string, DigitalBadge[]>) || {};

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
    <div className="min-h-screen pt-24 px-4 pb-12" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2" style={{ color: themeColors.text }}>
              Digital Badges
            </h1>
            <p style={{ color: themeColors.text }}>
              Industry certifications and achievements
            </p>
          </motion.div>
          
          {canEdit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                onClick={() => setShowAddForm(true)}
                style={{ backgroundColor: themeColors.primary }}
                className="hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Badge
              </Button>
            </motion.div>
          )}
        </div>

        {badges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Award className="h-16 w-16 mx-auto mb-4" style={{ color: `${themeColors.text}80` }} />
            <p style={{ color: themeColors.text }}>No digital badges yet</p>
          </motion.div>
        ) : (
          Object.entries(badgesByCategory).map(([category, categoryBadges], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h2 
                className="text-2xl font-bold mb-6 flex items-center gap-2"
                style={{ color: themeColors.primary }}
              >
                <Award className="h-6 w-6" />
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <Card
                    className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl"
                    style={{ 
                      borderColor: themeColors.primary,
                      backgroundColor: themeColors.surface,
                      borderWidth: '2px'
                    }}
                  >
                  <CardContent className="p-6 relative">
                    <DeleteButton 
                      onDelete={() => deleteBadgeMutation.mutate(badge.id)}
                      isVisible={isEditMode && canEdit}
                    />

                    {/* Badge Image */}
                    <div className="relative mb-4 overflow-hidden rounded-lg p-8 group-hover:scale-105 transition-transform duration-500"
                      style={{ background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.accent || themeColors.primary}20)` }}
                    >
                      <InlineEditImage
                        value={badge.badge_image_url}
                        onSave={(url) => 
                          updateBadgeMutation.mutate({ 
                            id: badge.id, 
                            updates: { badge_image_url: url } 
                          })
                        }
                        bucket="badges"
                      >
                        {badge.badge_image_url ? (
                          <motion.img
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            src={badge.badge_image_url}
                            alt={badge.title}
                            className="w-full h-48 object-contain"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center">
                            <Award className="h-24 w-24" style={{ color: `${themeColors.primary}50` }} />
                          </div>
                        )}
                      </InlineEditImage>
                      
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Badge Info */}
                    <div className="space-y-3">
                      <InlineEditText
                        value={badge.title}
                        onSave={(value) =>
                          updateBadgeMutation.mutate({
                            id: badge.id,
                            updates: { title: value },
                          })
                        }
                      >
                        <h3 className="text-xl font-bold group-hover:opacity-80 transition-opacity" 
                          style={{ color: themeColors.text }}
                        >
                          {badge.title}
                        </h3>
                      </InlineEditText>

                      <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.primary }}>
                        <Building2 className="h-4 w-4" />
                        <InlineEditText
                          value={badge.issuer}
                          onSave={(value) =>
                            updateBadgeMutation.mutate({
                              id: badge.id,
                              updates: { issuer: value },
                            })
                          }
                        >
                          <span className="font-semibold">{badge.issuer}</span>
                        </InlineEditText>
                      </div>

                      {badge.issue_date && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: `${themeColors.text}90` }}>
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(badge.issue_date)}</span>
                        </div>
                      )}

                      {badge.description && (
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
                          <p className="text-sm line-clamp-3" style={{ color: `${themeColors.text}90` }}>
                            {badge.description}
                          </p>
                        </InlineEditText>
                      )}

                      {badge.credential_url && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={badge.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                          style={{ color: themeColors.primary }}
                        >
                          View Credential
                          <ExternalLink className="h-4 w-4" />
                        </motion.a>
                      )}

                      {isEditMode && canEdit && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingBadge(badge);
                            setShowAddForm(true);
                          }}
                          className="mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors"
                          style={{ 
                            backgroundColor: themeColors.primary,
                            color: 'white'
                          }}
                        >
                          Edit Badge
                        </motion.button>
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
              </motion.div>
              ))}
            </div>
          </motion.div>
          ))
        )}

        <BadgeForm
          isOpen={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setEditingBadge(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingBadge ? {
            title: editingBadge.title,
            description: editingBadge.description || '',
            issuer: editingBadge.issuer,
            issue_date: editingBadge.issue_date,
            badge_image_url: editingBadge.badge_image_url,
            credential_url: editingBadge.credential_url,
            category: editingBadge.category
          } : null}
        />

        <GlobalEditModeToolbar />
      </div>
    </div>
  );
};