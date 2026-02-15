
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JourneyEntry {
  id: string;
  title: string;
  description: string | null;
  entry_date: string;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export const JourneyManager = () => {
  const { themeColors } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entry_date: '',
    display_order: 1
  });

  const { data: entries = [], isLoading } = useQuery({
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

  const createMutation = useMutation({
    mutationFn: async (newEntry: Omit<JourneyEntry, 'id' | 'created_at' | 'updated_at'>) => {
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
      toast({ title: 'Journey entry created successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error creating entry', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<JourneyEntry> & { id: string }) => {
      const { data, error } = await supabase
        .from('journey_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-entries'] });
      toast({ title: 'Journey entry updated successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error updating entry', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('journey_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-entries'] });
      toast({ title: 'Journey entry deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting entry', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      entry_date: '',
      display_order: 1
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (entry: JourneyEntry) => {
    setFormData({
      title: entry.title,
      description: entry.description || '',
      entry_date: entry.entry_date,
      display_order: entry.display_order || 1
    });
    setEditingId(entry.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading journey entries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 
          className="text-2xl font-bold"
          style={{ color: themeColors.text }}
        >
          Journey Timeline
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: themeColors.primary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardHeader>
            <CardTitle style={{ color: themeColors.text }}>
              {editingId ? 'Edit Event' : 'Add New Event'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="date"
              value={formData.entry_date}
              onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
            />
            <Input
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit} 
                style={{ backgroundColor: themeColors.primary }}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} style={{ backgroundColor: themeColors.surface }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm" style={{ color: themeColors.accent }}>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: themeColors.text }}>
                    {entry.title}
                  </h3>
                  <p className="text-sm" style={{ color: themeColors.accent }}>
                    {entry.description}
                  </p>
                  <div className="text-xs mt-2" style={{ color: themeColors.accent }}>
                    Order: {entry.display_order}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(entry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
