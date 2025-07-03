import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage, getPublicUrl } from '@/utils/storage';
import { Upload, X, Plus } from 'lucide-react';

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string[];
  project_url: string;
  github_url: string;
  completion_date: string;
  image_url?: string;
}

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

export const ProjectForm = ({ isOpen, onClose, onSubmit }: ProjectFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    technologies: [],
    project_url: '',
    github_url: '',
    completion_date: '',
    image_url: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [techInput, setTechInput] = useState('');

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

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        await uploadImageToStorage(selectedFile, 'projects', fileName);
        imageUrl = getPublicUrl('projects', fileName);
      }

      await onSubmit({
        ...formData,
        image_url: imageUrl
      });

      toast({ title: 'Project added successfully!' });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding project:', error);
      toast({ title: 'Error adding project', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      project_url: '',
      github_url: '',
      completion_date: '',
      image_url: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setTechInput('');
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Project Image</Label>
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Project title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
              rows={3}
            />
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label>Technologies Used</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Enter technology"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" size="sm" onClick={addTechnology}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {tech}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTechnology(tech)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Project Link */}
          <div className="space-y-2">
            <Label htmlFor="project_url">Project Link</Label>
            <Input
              id="project_url"
              type="url"
              value={formData.project_url}
              onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          {/* GitHub Link */}
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub Link</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
              placeholder="https://github.com/..."
            />
          </div>

          {/* Completion Date */}
          <div className="space-y-2">
            <Label htmlFor="completion_date">Completion Date</Label>
            <Input
              id="completion_date"
              type="date"
              value={formData.completion_date}
              onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};