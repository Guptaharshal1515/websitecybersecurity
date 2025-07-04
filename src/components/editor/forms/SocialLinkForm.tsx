import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';

interface SocialLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const SocialLinkForm = ({ isOpen, onClose, onSubmit }: SocialLinkFormProps) => {
  const { themeColors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', url: '', icon_url: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent style={{ backgroundColor: themeColors.surface, borderColor: themeColors.primary }}>
        <DialogHeader>
          <DialogTitle style={{ color: themeColors.text }}>Add Social Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" style={{ color: themeColors.text }}>Platform Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., LinkedIn, GitHub"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="url" style={{ color: themeColors.text }}>URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="icon_url" style={{ color: themeColors.text }}>Icon URL (optional)</Label>
            <Input
              id="icon_url"
              type="url"
              value={formData.icon_url}
              onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
              placeholder="https://... (for custom icon)"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" style={{ backgroundColor: themeColors.primary }}>
              Add Link
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};