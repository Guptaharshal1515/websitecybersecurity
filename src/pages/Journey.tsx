
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { EditableText } from '@/components/admin/EditableText';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface JourneyEntry {
  id: string;
  title: string;
  description: string | null;
  entry_date: string;
  display_order: number | null;
  created_at: string | null;
}

export const Journey = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Restricted
            </h2>
            <p style={{ color: themeColors.accent }}>
              Please log in to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Restricted
            </h2>
            <p style={{ color: themeColors.accent }}>
              This page is only available to customers and administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: journeyEntries = [] } = useQuery({
    queryKey: ['journey-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journey_entries')
        .select('*')
        .order('entry_date', { ascending: false });
      if (error) throw error;
      return data as JourneyEntry[];
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: async (newEntry: { title: string; description: string; entry_date: string }) => {
      const { data, error } = await supabase
        .from('journey_entries')
        .insert([newEntry])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-entries'] });
      toast({ title: 'Journey entry added successfully!' });
      setShowAddForm(false);
    }
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: string }) => {
      const { data, error } = await supabase
        .from('journey_entries')
        .update({ [field]: value })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-entries'] });
      toast({ title: 'Journey entry updated successfully!' });
    }
  });

  // Sort entries by date (most recent first)
  const sortedEntries = [...journeyEntries].sort((a, b) => 
    new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <h1 
            className="text-4xl font-bold"
            style={{ color: themeColors.primary }}
          >
            My Journey
          </h1>
          
          {userRole === 'admin' && (
            <Button
              onClick={() => setShowAddForm(true)}
              style={{ backgroundColor: themeColors.primary }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div 
              className="absolute left-8 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: themeColors.primary }}
            />
            
            <div className="space-y-8">
              {sortedEntries.map((entry, index) => (
                <div key={entry.id} className="relative flex items-start gap-8">
                  {/* Timeline dot */}
                  <div 
                    className="w-4 h-4 rounded-full border-4 flex-shrink-0 mt-2"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.background 
                    }}
                  />
                  
                  {/* Date */}
                  <div className="w-32 flex-shrink-0 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Calendar className="h-4 w-4" style={{ color: themeColors.primary }} />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: themeColors.text }}
                      >
                        {formatDate(entry.entry_date)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card 
                      className="border-0"
                      style={{ backgroundColor: themeColors.surface }}
                    >
                      <CardContent className="p-6">
                        <EditableText
                          value={entry.title}
                          onSave={(value) => updateEntryMutation.mutate({ id: entry.id, field: 'title', value })}
                          className="text-lg font-semibold mb-2"
                          placeholder="Event title"
                        />
                        
                        {entry.description && (
                          <EditableText
                            value={entry.description}
                            onSave={(value) => updateEntryMutation.mutate({ id: entry.id, field: 'description', value })}
                            multiline={true}
                            className="text-sm leading-relaxed"
                            placeholder="Event description"
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
