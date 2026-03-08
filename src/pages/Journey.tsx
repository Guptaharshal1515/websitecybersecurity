import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, X, ExternalLink, Map } from 'lucide-react';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { JourneyForm } from '@/components/editor/forms/JourneyForm';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { PageTransition } from '@/components/layout/PageTransition';
import { PageHeader } from '@/components/layout/PageHeader';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface JourneyEntry {
  id: string;
  title: string;
  description: string | null;
  entry_date: string;
  display_order: number | null;
  created_at: string | null;
  resource_link: string | null;
  image_url: string | null;
}

export const Journey = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isEditMode, canEdit } = useEditMode();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JourneyEntry | null>(null);

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Access Restricted</h2>
              <p className="text-muted-foreground">Please log in to view this page.</p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  const { data: journeyEntries = [] } = useQuery({
    queryKey: ['journey-entries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('journey_entries').select('*').order('entry_date', { ascending: false });
      if (error) throw error;
      return data as JourneyEntry[];
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: async (newEntry: { title: string; description: string; entry_date: string; resource_link?: string; image_url?: string }) => {
      const { data, error } = await supabase.from('journey_entries').insert([newEntry]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-entries'] });
      toast({ title: 'Journey entry added successfully!' });
      setShowAddForm(false);
    }
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('journey_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-entries'] });
      toast({ title: 'Journey entry deleted!' });
      setSelectedEntry(null);
    }
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: string }) => {
      const { data, error } = await supabase.from('journey_entries').update({ [field]: value }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-entries'] });
      toast({ title: 'Entry updated!' });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          <PageHeader
            title="My Journey"
            subtitle="Key milestones and progress in my learning journey."
            actions={
              canEdit ? (
                <AddContentButton onClick={() => setShowAddForm(true)}>Add Progress</AddContentButton>
              ) : undefined
            }
          />

          {journeyEntries.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No journey entries yet</p>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto pb-16">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                <div className="space-y-8">
                  {journeyEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="relative flex items-start gap-8"
                    >
                      {/* Timeline dot */}
                      <div className="w-4 h-4 rounded-full bg-primary border-4 border-background flex-shrink-0 mt-2 glow-primary" />

                      {/* Date */}
                      <div className="w-32 flex-shrink-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-mono text-muted-foreground">{formatDate(entry.entry_date)}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Card
                          className="glass-card cursor-pointer hover:scale-[1.01] transition-transform duration-200 relative"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <DeleteButton onDelete={() => deleteEntryMutation.mutate(entry.id)} isVisible={isEditMode && canEdit} />
                          <CardContent className="p-6">
                            <InlineEditText value={entry.title} onSave={(value) => updateEntryMutation.mutate({ id: entry.id, field: 'title', value })}>
                              <h3 className="text-lg font-semibold mb-2 text-foreground">{entry.title}</h3>
                            </InlineEditText>

                            {entry.description && (
                              <InlineEditText value={entry.description} onSave={(value) => updateEntryMutation.mutate({ id: entry.id, field: 'description', value })} multiline>
                                <p className="text-sm leading-relaxed text-muted-foreground mb-2">
                                  {entry.description.length > 100 ? `${entry.description.substring(0, 100)}...` : entry.description}
                                </p>
                              </InlineEditText>
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                              {entry.resource_link && (
                                <a href={entry.resource_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                                  <ExternalLink className="h-3 w-3" /> View
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEntry(null)}>
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto glass-card relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedEntry(null)} className="absolute top-4 right-4 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 z-10">
                <X className="h-5 w-5" />
              </button>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-lg font-mono text-foreground">{formatDate(selectedEntry.entry_date)}</span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">{selectedEntry.title}</h2>
                {selectedEntry.description && <p className="text-muted-foreground leading-relaxed mb-4">{selectedEntry.description}</p>}
                {selectedEntry.image_url && (
                  <div className="mb-4"><img src={selectedEntry.image_url} alt={selectedEntry.title} className="w-full max-w-md mx-auto rounded-lg" /></div>
                )}
                {selectedEntry.resource_link && (
                  <a href={selectedEntry.resource_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity">
                    <ExternalLink className="h-4 w-4" /> View Resource
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <JourneyForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} onSubmit={addEntryMutation.mutate} />
      </div>
    </PageTransition>
  );
};
