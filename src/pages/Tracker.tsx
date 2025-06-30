
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EditableText } from '@/components/admin/EditableText';
import { LiveEditWrapper } from '@/components/admin/LiveEditWrapper';
import { useToast } from '@/hooks/use-toast';

interface TrackerEntry {
  id: string;
  title: string;
  type: string;
  proof_link: string | null;
  completion_date: string | null;
  is_completed: boolean | null;
  created_at: string | null;
}

interface TrackerCategory {
  name: string;
  icon: string;
  entries: TrackerEntry[];
}

export const Tracker = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const { data: entries = [] } = useQuery({
    queryKey: ['tracker-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracker_entries')
        .select('*')
        .order('completion_date', { ascending: false });
      if (error) throw error;
      return data as TrackerEntry[];
    },
  });

  // Group entries by type
  const categorizedEntries = entries.reduce((acc, entry) => {
    const category = entry.type || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {} as Record<string, TrackerEntry[]>);

  // Default categories
  const defaultCategories = [
    { name: 'Certificates', icon: '📜' },
    { name: 'Courses', icon: '📚' },
    { name: 'Languages', icon: '💬' },
    { name: 'Projects', icon: '🚀' }
  ];

  const categories: TrackerCategory[] = defaultCategories.map(cat => ({
    ...cat,
    entries: categorizedEntries[cat.name] || []
  }));

  const addEntryMutation = useMutation({
    mutationFn: async (newEntry: { title: string; type: string; completion_date: string }) => {
      const { data, error } = await supabase
        .from('tracker_entries')
        .insert([{ ...newEntry, is_completed: true }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-entries'] });
      toast({ title: 'Entry added successfully!' });
      setShowAddEntry(false);
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
            Skills & Achievements Tracker
          </h1>
          
          {userRole === 'admin' && (
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddEntry(true)}
                style={{ backgroundColor: themeColors.primary }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Completion
              </Button>
              <Button
                onClick={() => setShowAddCategory(true)}
                variant="outline"
                style={{ borderColor: themeColors.primary, color: themeColors.primary }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card 
              key={category.name}
              className="border-0"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-2"
                  style={{ color: themeColors.text }}
                >
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.entries
                  .sort((a, b) => new Date(b.completion_date || '').getTime() - new Date(a.completion_date || '').getTime())
                  .map((entry) => (
                  <div 
                    key={entry.id}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: themeColors.background }}
                  >
                    <h4 
                      className="font-semibold text-sm mb-1"
                      style={{ color: themeColors.text }}
                    >
                      {entry.title}
                    </h4>
                    <p 
                      className="text-xs"
                      style={{ color: themeColors.accent }}
                    >
                      {entry.completion_date ? formatDate(entry.completion_date) : 'In Progress'}
                    </p>
                  </div>
                ))}
                
                {category.entries.length === 0 && (
                  <p 
                    className="text-sm text-center py-4"
                    style={{ color: themeColors.accent }}
                  >
                    No {category.name.toLowerCase()} yet
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
