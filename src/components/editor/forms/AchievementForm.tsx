import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage, getPublicUrl } from '@/utils/storage';
import { Upload, X } from 'lucide-react';

interface Achievement {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;
  certificate_url?: string;
  achievement_type: string;
  display_order: number;
  completion_date?: string;
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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: achievement?.title || '',
    description: achievement?.description || '',
    image_url: achievement?.image_url || '',
    certificate_url: achievement?.certificate_url || '',
    achievement_type: achievement?.achievement_type || 'general',
    display_order: achievement?.display_order || 0,
    completion_date: achievement?.completion_date || ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(achievement?.image_url || '');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        await uploadImageToStorage(selectedFile, 'certificates', fileName);
        imageUrl = getPublicUrl('certificates', fileName);
      }

      const dataToSubmit = {
        ...formData,
        image_url: imageUrl,
        display_order: Number(formData.display_order)
      };

      if (achievement?.id) {
        // Update existing achievement
        const { error } = await supabase
          .from('achievements')
          .update(dataToSubmit)
          .eq('id', achievement.id);

        if (error) throw error;
        toast({ title: 'Achievement updated successfully!' });
      } else {
        // Create new achievement
        const { error } = await supabase
          .from('achievements')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast({ title: 'Achievement added successfully!' });
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast({ 
        title: 'Error saving achievement',
        description: 'Please try again',
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
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Achievement Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Achievement title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.achievement_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, achievement_type: value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your achievement..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="completion_date">Completion Date</Label>
              <Input
                id="completion_date"
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificate_url">Certificate URL</Label>
              <Input
                id="certificate_url"
                value={formData.certificate_url}
                onChange={(e) => setFormData(prev => ({ ...prev, certificate_url: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
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