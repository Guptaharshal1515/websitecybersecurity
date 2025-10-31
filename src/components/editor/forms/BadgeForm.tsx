import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X, Plus } from 'lucide-react';

interface BadgeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    issuer: string;
    issue_date: string | null;
    badge_image_url: string | null;
    credential_url: string | null;
    category: string | null;
  }) => void;
  initialData?: {
    title: string;
    description: string | null;
    issuer: string;
    issue_date: string | null;
    badge_image_url: string | null;
    credential_url: string | null;
    category: string | null;
  } | null;
}

export const BadgeForm = ({ isOpen, onClose, onSubmit, initialData }: BadgeFormProps) => {
  const { themeColors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
    category: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        issuer: initialData.issuer,
        issue_date: initialData.issue_date || '',
        credential_url: initialData.credential_url || '',
        category: initialData.category || ''
      });
      setPreviewUrl(initialData.badge_image_url);
    } else {
      setFormData({
        title: '',
        description: '',
        issuer: '',
        issue_date: '',
        credential_url: '',
        category: ''
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setShowNewCategory(false);
    setNewCategory('');
  }, [initialData, isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('digital_badges')
        .select('category')
        .not('category', 'is', null);
      
      if (!error && data) {
        const uniqueCategories = [...new Set(data.map(d => d.category).filter(Boolean))];
        setCategories(uniqueCategories as string[]);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = previewUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('certificates')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      onSubmit({
        ...formData,
        issue_date: formData.issue_date || null,
        badge_image_url: imageUrl,
        credential_url: formData.credential_url || null,
        category: formData.category || null
      });

      setFormData({
        title: '',
        description: '',
        issuer: '',
        issue_date: '',
        credential_url: '',
        category: ''
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: themeColors.surface }}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {initialData ? 'Edit Badge' : 'Add Digital Badge'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Badge Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., AWS Certified Solutions Architect"
              required
              className="bg-background text-white border-muted"
            />
          </div>

          <div>
            <Label htmlFor="issuer" className="text-white">Issuer / Company Name *</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
              placeholder="e.g., Amazon Web Services"
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
              placeholder="Brief description of the badge..."
              className="bg-background text-white border-muted"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="issue_date" className="text-white">Completion Date</Label>
            <Input
              id="issue_date"
              type="date"
              value={formData.issue_date}
              onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
              className="bg-background text-white border-muted"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-white">Category</Label>
            {!showNewCategory ? (
              <div className="flex gap-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    if (value === '__new__') {
                      setShowNewCategory(true);
                    } else {
                      setFormData(prev => ({ ...prev, category: value }));
                    }
                  }}
                >
                  <SelectTrigger className="bg-background text-white border-muted">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new__" className="text-primary">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Category
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="bg-background text-white border-muted"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newCategory.trim()) {
                      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
                      setCategories(prev => [...prev, newCategory.trim()]);
                      setShowNewCategory(false);
                      setNewCategory('');
                    }
                  }}
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="credential_url" className="text-white">Credential URL</Label>
            <Input
              id="credential_url"
              type="url"
              value={formData.credential_url}
              onChange={(e) => setFormData(prev => ({ ...prev, credential_url: e.target.value }))}
              placeholder="https://..."
              className="bg-background text-white border-muted"
            />
          </div>

          <div>
            <Label className="text-white">Badge Image</Label>
            <div className="mt-2 space-y-3">
              {previewUrl && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 w-32 object-contain rounded-lg border border-muted"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="bg-background text-white border-muted"
                  id="badge-image"
                />
                <label htmlFor="badge-image">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={uploading}
              style={{ backgroundColor: themeColors.primary }}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : initialData ? 'Update Badge' : 'Add Badge'}
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