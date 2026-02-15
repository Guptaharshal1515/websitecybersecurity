import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage, getPublicUrl } from '@/utils/storage';
import { Upload, X } from 'lucide-react';

interface JourneyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    entry_date: string;
    resource_link?: string;
    image_url?: string;
  }) => void;
}

export const JourneyForm = ({ isOpen, onClose, onSubmit }: JourneyFormProps) => {
  const { themeColors } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entry_date: '',
    resource_link: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = '';

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        await uploadImageToStorage(selectedFile, 'profiles', fileName);
        imageUrl = getPublicUrl('profiles', fileName);
      }

      await onSubmit({
        ...formData,
        resource_link: formData.resource_link || undefined,
        image_url: imageUrl || undefined
      });

      setFormData({ title: '', description: '', entry_date: '', resource_link: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error submitting journey entry:', error);
      toast({ title: 'Error adding entry', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
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
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white">Photo (Optional)</Label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
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
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Photo
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
              disabled={isLoading}
              style={{ backgroundColor: themeColors.primary }}
              className="flex-1"
            >
              {isLoading ? 'Adding...' : 'Add Progress'}
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