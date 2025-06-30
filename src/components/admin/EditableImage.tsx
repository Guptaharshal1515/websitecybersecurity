
import { useState, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { LiveEditWrapper } from './LiveEditWrapper';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface EditableImageProps {
  src: string | null;
  alt: string;
  onSave: (file: File | null) => void;
  className?: string;
  isCircular?: boolean;
}

export const EditableImage = ({ 
  src, 
  alt, 
  onSave, 
  className = "",
  isCircular = false 
}: EditableImageProps) => {
  const { themeColors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(src);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const file = fileInputRef.current?.files?.[0] || null;
    onSave(file);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPreviewSrc(src);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreviewSrc(null);
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
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                style={{ backgroundColor: themeColors.primary }}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
              {previewSrc && (
                <Button
                  size="sm"
                  onClick={handleRemove}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
