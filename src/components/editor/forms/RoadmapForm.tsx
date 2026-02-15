import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';

interface RoadmapFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
  }) => void;
}

export const RoadmapForm = ({ isOpen, onClose, onSubmit }: RoadmapFormProps) => {
  const { themeColors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md"
        style={{ backgroundColor: themeColors.surface }}
      >
        <DialogHeader>
          <DialogTitle className="text-white">Add Roadmap Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Category Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Advanced Cybersecurity"
              required
              className="bg-background text-white border-muted"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this roadmap category"
              className="bg-background text-white border-muted"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              style={{ backgroundColor: themeColors.primary }}
              className="flex-1"
            >
              Add Category
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