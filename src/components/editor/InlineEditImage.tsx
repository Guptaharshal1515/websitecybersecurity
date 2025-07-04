import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Upload } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { uploadImageToStorage, getPublicUrl } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface InlineEditImageProps {
  value: string | null;
  onSave: (url: string) => void;
  bucket: string;
  className?: string;
  children: React.ReactNode;
}

export const InlineEditImage = ({ 
  value, 
  onSave, 
  bucket,
  className = "",
  children 
}: InlineEditImageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isEditMode, canEdit } = useEditMode();
  const { themeColors } = useTheme();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      await uploadImageToStorage(file, bucket, fileName);
      const publicUrl = getPublicUrl(bucket, fileName);
      
      onSave(publicUrl);
      toast({ title: 'Image updated successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: 'Error uploading image', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  if (!canEdit || !isEditMode) {
    return <>{children}</>;
  }

  return (
    <div className={`relative group ${className}`}>
      {children}
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        style={{ backgroundColor: themeColors.surface, borderColor: themeColors.primary }}
      >
        {isUploading ? (
          <Upload className="h-3 w-3 animate-spin" style={{ color: themeColors.primary }} />
        ) : (
          <Edit className="h-3 w-3" style={{ color: themeColors.primary }} />
        )}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};