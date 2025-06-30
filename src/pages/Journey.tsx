
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, X } from 'lucide-react';
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
  const [selectedEntry, setSelectedEntry] = useState<JourneyEntry | null>(null);

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

  // Add dummy journey entries if none exist
  const dummyEntries = journeyEntries.length === 0 ? [
    {
      id: 'dummy-1',
      title: 'Started Bachelor\'s in Computer Science',
      description: 'Beginning my journey into the world of cybersecurity and technology.',
      entry_date: '2024-01-15',
      display_order: 1,
      created_at: '2024-01-15'
    },
    {
      id: 'dummy-2',
      title: 'First Cybersecurity Certification',
      description: 'Completed my first ethical hacking certification, marking a major milestone.',
      entry_date: '2024-02-20',
      display_order: 2,
      created_at: '2024-02-20'
    },
    {
      id: 'dummy-3',
      title: 'Blockchain Development Deep Dive',
      description: 'Started learning Solidity and smart contract development.',
      entry_date: '2024-03-10',
      display_order: 3,
      created_at: '2024-03-10'
    },
    {
      id: 'dummy-4',
      title: 'First Security Hackathon',
      description: 'Participated in my first cybersecurity hackathon, learned a lot about real-world applications.',
      entry_date: '2024-03-25',
      display_order: 4,
      created_at: '2024-03-25'
    }
  ] : journeyEntries;

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
  const sortedEntries = [...dummyEntries].sort((a, b) => 
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
          <div className="relative">
            <h1 
              className="text-4xl font-bold text-white"
            >
              My Journey
            </h1>
            <div 
              className="absolute bottom-0 left-0 w-full h-1 rounded mt-2"
              style={{ 
                backgroundColor: themeColors.primary,
                boxShadow: `0 0 10px ${themeColors.primary}`
              }}
            />
          </div>
          
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
                        className="text-sm font-medium text-white"
                      >
                        {formatDate(entry.entry_date)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card 
                      className="border-0 cursor-pointer hover:scale-105 transition-transform duration-200"
                      style={{ backgroundColor: themeColors.surface }}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <CardContent className="p-6">
                        {userRole === 'admin' ? (
                          <EditableText
                            value={entry.title}
                            onSave={(value) => updateEntryMutation.mutate({ id: entry.id, field: 'title', value })}
                            className="text-lg font-semibold mb-2 text-white"
                            placeholder="Event title"
                          />
                        ) : (
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            {entry.title}
                          </h3>
                        )}
                        
                        {entry.description && (
                          <p className="text-sm leading-relaxed text-gray-300">
                            {entry.description.length > 100 
                              ? `${entry.description.substring(0, 100)}...` 
                              : entry.description
                            }
                          </p>
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

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <Card 
            className="max-w-2xl w-full max-h-[80vh] overflow-auto border-0 relative"
            style={{ backgroundColor: themeColors.surface }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:opacity-80 z-10"
              style={{ backgroundColor: themeColors.primary }}
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" style={{ color: themeColors.primary }} />
                <span className="text-lg font-medium text-white">
                  {formatDate(selectedEntry.entry_date)}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-white">
                {selectedEntry.title}
              </h2>
              
              {selectedEntry.description && (
                <p className="text-base leading-relaxed text-gray-300">
                  {selectedEntry.description}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
