import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;
  certificate_url?: string;
  achievement_type: string;
  display_order: number;
}

interface AchievementFormProps {
  isOpen: boolean;
  onClose: () => void;
  achievement?: Achievement;
  onSave?: () => void;
}

const achievementTypes = [
  'Certification',
  'Award',
  'Competition',
  'Project',
  'Course',
  'Skill',
  'General'
];

export const AchievementForm = ({ isOpen, onClose, achievement, onSave }: AchievementFormProps) => {
  const [formData, setFormData] = useState<Achievement>({
    title: achievement?.title || '',
    description: achievement?.description || '',
    image_url: achievement?.image_url || '',
    certificate_url: achievement?.certificate_url || '',
    achievement_type: achievement?.achievement_type || 'General',
    display_order: achievement?.display_order || 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (achievement?.id) {
        // Update existing achievement
        const { error } = await supabase
          .from('achievements')
          .update(formData)
          .eq('id', achievement.id);
        
        if (error) throw error;
        toast({ title: 'Achievement updated successfully!' });
      } else {
        // Create new achievement
        const { error } = await supabase
          .from('achievements')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: 'Achievement created successfully!' });
      }
      
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast({ 
        title: 'Error saving achievement', 
        description: 'Please try again.',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {achievement ? 'Edit Achievement' : 'Add New Achievement'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Achievement title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.achievement_type} 
                onValueChange={(value) => setFormData({ ...formData, achievement_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {achievementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your achievement..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificate_url">Certificate URL</Label>
              <Input
                id="certificate_url"
                value={formData.certificate_url}
                onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })}
                placeholder="https://example.com/certificate.pdf"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Achievement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};