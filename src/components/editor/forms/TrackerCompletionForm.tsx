import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';

interface TrackerCompletionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: string;
    completion_date: string;
  }) => void;
  categories: string[];
}

export const TrackerCompletionForm = ({ isOpen, onClose, onSubmit, categories }: TrackerCompletionFormProps) => {
  const { themeColors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    completion_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', type: '', completion_date: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md"
        style={{ backgroundColor: themeColors.surface }}
      >
        <DialogHeader>
          <DialogTitle className="text-white">Add Completion</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type" className="text-white">Category</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-background text-black border-muted">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title" className="text-white">Completed Task</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Task that was completed"
              required
              className="bg-background text-black border-muted"
            />
          </div>
          
          <div>
            <Label htmlFor="completion_date" className="text-white">Date of Completion</Label>
            <Input
              id="completion_date"
              type="date"
              value={formData.completion_date}
              onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
              required
              className="bg-background text-black border-muted"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              style={{ backgroundColor: themeColors.primary }}
              className="flex-1"
            >
              Add Completion
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              style={{ borderColor: themeColors.primary, color: themeColors.primary }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};