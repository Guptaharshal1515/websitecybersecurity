import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage, getPublicUrl } from '@/utils/storage';
import { Upload, X } from 'lucide-react';

interface CertificateFormData {
  title: string;
  completion_date: string;
  issued_by: string;
  certificate_url: string;
  description: string;
  image_url?: string;
  credentials?: string;
  type: 'cybersecurity' | 'blockchain' | 'general';
  display_order?: number;
}

interface CertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificateFormData) => void;
  type: 'cybersecurity' | 'blockchain' | 'general';
}

export const CertificateForm = ({ isOpen, onClose, onSubmit, type }: CertificateFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CertificateFormData>({
    title: '',
    completion_date: '',
    issued_by: '',
    certificate_url: '',
    description: '',
    image_url: '',
    credentials: '',
    type,
    display_order: 0
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

      await onSubmit({
        ...formData,
        image_url: imageUrl
      });

      toast({ title: 'Certificate added successfully!' });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast({ title: 'Error adding certificate', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      completion_date: '',
      issued_by: '',
      certificate_url: '',
      description: '',
      image_url: '',
      credentials: '',
      type,
      display_order: 0
    });
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add {type === 'cybersecurity' ? 'Cybersecurity' : 
                 type === 'blockchain' ? 'Blockchain' : 'Professional'} Certificate
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Certificate title"
              className="text-foreground"
              required
            />
          </div>

          {/* Completion Date */}
          <div className="space-y-2">
            <Label htmlFor="completion_date" className="text-foreground">Completion Date</Label>
            <Input
              id="completion_date"
              type="date"
              value={formData.completion_date}
              onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
              className="text-foreground"
            />
          </div>

          {/* Issued By */}
          <div className="space-y-2">
            <Label htmlFor="issued_by" className="text-foreground">Issued By *</Label>
            <Input
              id="issued_by"
              value={formData.issued_by}
              onChange={(e) => setFormData(prev => ({ ...prev, issued_by: e.target.value }))}
              placeholder="Organization or institution name"
              className="text-foreground"
              required
            />
          </div>

          {/* Certificate URL */}
          <div className="space-y-2">
            <Label htmlFor="certificate_url" className="text-foreground">Certificate URL</Label>
            <Input
              id="certificate_url"
              type="url"
              value={formData.certificate_url}
              onChange={(e) => setFormData(prev => ({ ...prev, certificate_url: e.target.value }))}
              placeholder="https://..."
              className="text-foreground"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Certificate description"
              className="text-foreground"
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Certificate Image</Label>
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

          {/* Credentials (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="credentials" className="text-foreground">Credentials (Optional)</Label>
            <Input
              id="credentials"
              value={formData.credentials}
              onChange={(e) => setFormData(prev => ({ ...prev, credentials: e.target.value }))}
              placeholder="e.g., Certificate ID or credentials number"
              className="text-foreground"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Adding...' : 'Add Certificate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};