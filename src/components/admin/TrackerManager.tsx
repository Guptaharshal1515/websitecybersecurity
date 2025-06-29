
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface TrackerEntry {
  id: string;
  skill_name: string;
  tag: '📜' | '🧪' | '📚';
  link: string;
  date_completed: string;
}

export const TrackerManager = () => {
  const { themeColors } = useTheme();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    skill_name: '',
    tag: '📜' as '📜' | '🧪' | '📚',
    link: '',
    date_completed: ''
  });

  const handleSubmit = () => {
    if (editingId) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingId 
          ? { ...entry, ...formData }
          : entry
      ));
    } else {
      const newEntry: TrackerEntry = {
        id: Date.now().toString(),
        ...formData
      };
      setEntries(prev => [...prev, newEntry]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      skill_name: '',
      tag: '📜',
      link: '',
      date_completed: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (entry: TrackerEntry) => {
    setFormData({
      skill_name: entry.skill_name,
      tag: entry.tag,
      link: entry.link,
      date_completed: entry.date_completed
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
              value={formData.skill_name}
              onChange={(e) => setFormData(prev => ({ ...prev, skill_name: e.target.value }))}
            />
            <select
              value={formData.tag}
              onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value as '📜' | '🧪' | '📚' }))}
              className="w-full p-2 border rounded"
            >
              <option value="📜">📜 Certificate</option>
              <option value="🧪">🧪 Hands-on</option>
              <option value="📚">📚 Course</option>
            </select>
            <Input
              placeholder="Link (optional)"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
            />
            <Input
              type="date"
              value={formData.date_completed}
              onChange={(e) => setFormData(prev => ({ ...prev, date_completed: e.target.value }))}
            />
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
        {entries.map((entry) => (
          <Card key={entry.id} style={{ backgroundColor: themeColors.surface }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{entry.tag}</span>
                    <h3 className="font-bold" style={{ color: themeColors.text }}>
                      {entry.skill_name}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.accent }}>
                    Completed: {new Date(entry.date_completed).toLocaleDateString()}
                  </p>
                  {entry.link && (
                    <a 
                      href={entry.link} 
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
