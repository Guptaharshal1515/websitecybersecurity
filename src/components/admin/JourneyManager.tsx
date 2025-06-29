
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface JourneyEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'semester' | 'hackathon' | 'task' | 'milestone';
}

export const JourneyManager = () => {
  const { themeColors } = useTheme();
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    category: 'milestone' as 'semester' | 'hackathon' | 'task' | 'milestone'
  });

  const handleSubmit = () => {
    if (editingId) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingId 
          ? { ...entry, ...formData }
          : entry
      ));
    } else {
      const newEntry: JourneyEntry = {
        id: Date.now().toString(),
        ...formData
      };
      setEntries(prev => [...prev, newEntry]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: '',
      title: '',
      description: '',
      category: 'milestone'
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (entry: JourneyEntry) => {
    setFormData({
      date: entry.date,
      title: entry.title,
      description: entry.description,
      category: entry.category
    });
    setEditingId(entry.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

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
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full p-2 border rounded"
            >
              <option value="milestone">Milestone</option>
              <option value="semester">Semester</option>
              <option value="hackathon">Hackathon</option>
              <option value="task">Task</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} style={{ backgroundColor: themeColors.primary }}>
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
        {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
          <Card key={entry.id} style={{ backgroundColor: themeColors.surface }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-xs px-2 py-1 rounded capitalize"
                      style={{
                        backgroundColor: themeColors.primary + '20',
                        color: themeColors.primary
                      }}
                    >
                      {entry.category}
                    </span>
                    <span className="text-sm" style={{ color: themeColors.accent }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: themeColors.text }}>
                    {entry.title}
                  </h3>
                  <p className="text-sm" style={{ color: themeColors.accent }}>
                    {entry.description}
                  </p>
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
