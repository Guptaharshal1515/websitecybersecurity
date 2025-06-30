
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrackerEntry {
  id: string;
  title: string;
  type: string;
  proof_link: string | null;
  completion_date: string | null;
  is_completed: boolean | null;
  completed_by: string | null;
  created_at: string | null;
}

export const TrackerManager = () => {
  const { themeColors } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Course',
    proof_link: '',
    completion_date: ''
  });

  const { data: entries = [], isLoading } = useQuery({
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

  const createMutation = useMutation({
    mutationFn: async (newEntry: Omit<TrackerEntry, 'id' | 'created_at' | 'updated_at' | 'completed_by' | 'is_completed'>) => {
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
      toast({ title: 'Tracker entry created successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error creating entry', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TrackerEntry> & { id: string }) => {
      const { data, error } = await supabase
        .from('tracker_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-entries'] });
      toast({ title: 'Tracker entry updated successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error updating entry', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tracker_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-entries'] });
      toast({ title: 'Tracker entry deleted successfully!' });
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
      type: 'Course',
      proof_link: '',
      completion_date: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (entry: TrackerEntry) => {
    setFormData({
      title: entry.title,
      type: entry.type,
      proof_link: entry.proof_link || '',
      completion_date: entry.completion_date || ''
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
    return <div>Loading tracker entries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 
          className="text-2xl font-bold"
          style={{ color: themeColors.text }}
        >
          Tracker Entries
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: themeColors.primary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardHeader>
            <CardTitle style={{ color: themeColors.text }}>
              {editingId ? 'Edit Entry' : 'Add New Entry'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Skill/Course Name"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="Course">Course</option>
              <option value="Certificate">Certificate</option>
              <option value="Custom">Custom</option>
            </select>
            <Input
              placeholder="Link (optional)"
              value={formData.proof_link}
              onChange={(e) => setFormData(prev => ({ ...prev, proof_link: e.target.value }))}
            />
            <Input
              type="date"
              value={formData.completion_date}
              onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
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
                    <span className="text-lg">
                      {entry.type === 'Certificate' ? '📜' : entry.type === 'Custom' ? '🧪' : '📚'}
                    </span>
                    <h3 className="font-bold" style={{ color: themeColors.text }}>
                      {entry.title}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.accent }}>
                    Completed: {entry.completion_date ? new Date(entry.completion_date).toLocaleDateString() : 'Not set'}
                  </p>
                  {entry.proof_link && (
                    <a 
                      href={entry.proof_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm underline"
                      style={{ color: themeColors.primary }}
                    >
                      View Certificate/Link
                    </a>
                  )}
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
