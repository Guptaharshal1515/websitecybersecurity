
import { useState, useRef } from 'react';
import { Upload, Trash2, Save, X } from 'lucide-react';
import { LiveEditWrapper } from './LiveEditWrapper';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { uploadImageToStorage, getPublicUrl } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface EditableImageProps {
  src: string | null;
  alt: string;
  onSave: (url: string | null) => void;
  className?: string;
  isCircular?: boolean;
  bucket?: string;
}

export const EditableImage = ({ 
  src, 
  alt, 
  onSave, 
  className = "",
  isCircular = false,
  bucket = 'images'
}: EditableImageProps) => {
  const { themeColors } = useTheme();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(src);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        await uploadImageToStorage(selectedFile, bucket, fileName);
        const publicUrl = getPublicUrl(bucket, fileName);
        
        onSave(publicUrl);
        toast({ title: 'Image uploaded successfully!' });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({ title: 'Error uploading image', variant: 'destructive' });
      } finally {
        setIsUploading(false);
      }
    } else if (previewSrc === null) {
      onSave(null);
    } else {
      onSave(previewSrc);
    }
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setPreviewSrc(src);
    setSelectedFile(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreviewSrc(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <LiveEditWrapper
      isEditing={isEditing}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      className={className}
    >
      <div className={`relative ${isCircular ? 'rounded-full overflow-hidden' : 'rounded-lg overflow-hidden'}`}>
        {previewSrc ? (
          <img 
            src={previewSrc} 
            alt={alt}
            className={`w-full h-full object-cover ${className}`}
          />
        ) : (
          <div 
            className={`w-full h-full flex items-center justify-center ${isCircular ? 'rounded-full' : 'rounded-lg'}`}
            style={{ backgroundColor: themeColors.surface, minHeight: '200px' }}
          >
            <Upload className="h-8 w-8" style={{ color: themeColors.accent }} />
          </div>
        )}
        
        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col gap-2 items-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: themeColors.primary }}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                {previewSrc && (
                  <Button
                    size="sm"
                    onClick={handleRemove}
                    className="bg-red-500 hover:bg-red-600"
                    disabled={isUploading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {selectedFile && (
                <p className="text-white text-xs text-center">
                  {selectedFile.name}
                </p>
              )}
            </div>
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
    </LiveEditWrapper>
  );
};
