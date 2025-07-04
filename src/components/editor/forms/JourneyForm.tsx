import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';

interface JourneyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    entry_date: string;
    resource_link?: string;
  }) => void;
}

export const JourneyForm = ({ isOpen, onClose, onSubmit }: JourneyFormProps) => {
  const { themeColors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entry_date: '',
    resource_link: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      resource_link: formData.resource_link || undefined
    });
    setFormData({ title: '', description: '', entry_date: '', resource_link: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md"
        style={{ backgroundColor: themeColors.surface }}
      >
        <DialogHeader>
          <DialogTitle className="text-white">Add Progress</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="entry_date" className="text-white">Date</Label>
            <Input
              id="entry_date"
              type="date"
              value={formData.entry_date}
              onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
              required
              className="text-black"
            />
          </div>
          
          <div>
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Event title"
              required
              className="text-black"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Event description"
              required
              className="text-black"
            />
          </div>
          
          <div>
            <Label htmlFor="resource_link" className="text-white">Link (Optional)</Label>
            <Input
              id="resource_link"
              type="url"
              value={formData.resource_link}
              onChange={(e) => setFormData(prev => ({ ...prev, resource_link: e.target.value }))}
              placeholder="https://example.com"
              className="text-black"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              style={{ backgroundColor: themeColors.primary }}
              className="flex-1"
            >
              Add Progress
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