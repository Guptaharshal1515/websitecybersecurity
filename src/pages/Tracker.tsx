
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { TrackerCompletionForm } from '@/components/editor/forms/TrackerCompletionForm';
import { TrackerCategoryForm } from '@/components/editor/forms/TrackerCategoryForm';
import { OverlayEditWrapper } from '@/components/editor/OverlayEditWrapper';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { DeleteButton } from '@/components/editor/DeleteButton';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

  const { data: categories = [] } = useQuery({
    queryKey: ['tracker-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracker_categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Add dummy entries if none exist
  const dummyEntries = entries.length === 0 ? [
    {
      id: 'dummy-1',
      title: 'CompTIA Security+',
      type: 'Certificates',
      proof_link: null,
      completion_date: '2024-02-15',
      is_completed: true,
      created_at: '2024-02-15'
    },
    {
      id: 'dummy-2',
      title: 'Blockchain Fundamentals Course',
      type: 'Courses',
      proof_link: null,
      completion_date: '2024-03-10',
      is_completed: true,
      created_at: '2024-03-10'
    },
    {
      id: 'dummy-3',
      title: 'Python Programming',
      type: 'Languages',
      proof_link: null,
      completion_date: '2024-01-20',
      is_completed: true,
      created_at: '2024-01-20'
    },
    {
      id: 'dummy-4',
      title: 'Cybersecurity Dashboard',
      type: 'Projects',
      proof_link: null,
      completion_date: '2024-03-25',
      is_completed: true,
      created_at: '2024-03-25'
    }
  ] : entries;

  // Group entries by type and sort by completion date
  const categorizedEntries = dummyEntries.reduce((acc, entry) => {
    const category = entry.type || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {} as Record<string, TrackerEntry[]>);

  // Sort entries within each category by completion date (most recent first)
  Object.keys(categorizedEntries).forEach(category => {
    categorizedEntries[category].sort((a, b) => 
      new Date(b.completion_date || '').getTime() - new Date(a.completion_date || '').getTime()
    );
  });

  // Use database categories or default ones
  const dbCategories = categories.length > 0 ? categories.map(cat => ({
    name: cat.title,
    icon: cat.emoji || '📝',
    entries: categorizedEntries[cat.title] || []
  })) : [
    { name: 'Certificates', icon: '📜' },
    { name: 'Courses', icon: '📚' },
    { name: 'Languages', icon: '💬' },
    { name: 'Projects', icon: '🚀' }
  ].map(cat => ({
    ...cat,
    entries: categorizedEntries[cat.name] || []
  }));

  const categoryNames = dbCategories.map(cat => cat.name);

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

  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: { title: string; emoji: string }) => {
      const { data, error } = await supabase
        .from('tracker_categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-categories'] });
      toast({ title: 'Category added successfully!' });
      setShowAddCategory(false);
    }
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tracker_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-entries'] });
      toast({ title: 'Entry deleted successfully!' });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tracker_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-categories'] });
      toast({ title: 'Category deleted successfully!' });
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
          <div className="relative">
            <h1 
              className="text-4xl font-bold text-white"
            >
              Skills & Achievements Tracker
            </h1>
            <div 
              className="absolute bottom-0 left-0 w-full h-1 rounded mt-2"
              style={{ 
                backgroundColor: themeColors.primary,
                boxShadow: `0 0 10px ${themeColors.primary}`
              }}
            />
          </div>
          
          <div className="flex gap-2">
            <AddContentButton onClick={() => setShowAddEntry(true)}>
              Add Completion
            </AddContentButton>
            <AddContentButton onClick={() => setShowAddCategory(true)}>
              Add Category
            </AddContentButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dbCategories.map((category, categoryIndex) => (
            <Card 
              key={category.name}
              className="border-0 relative"
              style={{ backgroundColor: themeColors.surface }}
            >
              <DeleteButton
                onDelete={() => {
                  const dbCategory = categories.find(cat => cat.title === category.name);
                  if (dbCategory) deleteCategoryMutation.mutate(dbCategory.id);
                }}
                isVisible={isEditMode && categories.some(cat => cat.title === category.name)}
              />
              <CardHeader>
                <OverlayEditWrapper onEdit={() => {}}>
                  <CardTitle 
                    className="flex items-center gap-2 text-white"
                  >
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                  </CardTitle>
                </OverlayEditWrapper>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.entries.map((entry) => (
                  <div 
                    key={entry.id}
                    className="p-3 rounded-lg cursor-pointer hover:scale-105 transition-transform relative"
                    style={{ backgroundColor: themeColors.background }}
                    onClick={() => setSelectedTaskId(selectedTaskId === entry.id ? null : entry.id)}
                  >
                    <DeleteButton
                      onDelete={() => deleteEntryMutation.mutate(entry.id)}
                      isVisible={isEditMode}
                      className="top-1 right-1"
                    />
                    <OverlayEditWrapper onEdit={() => {}}>
                      <h4 
                        className="font-semibold text-sm mb-1 text-white"
                      >
                        {entry.title}
                      </h4>
                    </OverlayEditWrapper>
                    {selectedTaskId === entry.id && entry.completion_date && (
                      <p 
                        className="text-xs mt-2"
                        style={{ color: themeColors.accent }}
                      >
                        Completed: {formatDate(entry.completion_date)}
                      </p>
                    )}
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

      <TrackerCompletionForm
        isOpen={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        onSubmit={addEntryMutation.mutate}
        categories={categoryNames}
      />

      <TrackerCategoryForm
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSubmit={addCategoryMutation.mutate}
      />

      <EditorToolbar
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />
    </div>
  );
};
