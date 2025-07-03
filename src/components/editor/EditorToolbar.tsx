
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, X, Plus, Upload, Eye } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface EditorToolbarProps {
  onSave: () => void;
  onCancel: () => void;
  onAddSection: () => void;
  onUploadMedia: () => void;
  onPreview: () => void;
}

export const EditorToolbar = ({ 
  onSave, 
  onCancel, 
  onAddSection, 
  onUploadMedia, 
  onPreview 
}: EditorToolbarProps) => {
  const { themeColors } = useTheme();

  return (
    <Card 
      className="fixed bottom-4 right-4 z-50 border-2 shadow-lg"
      style={{ 
        backgroundColor: themeColors.surface,
        borderColor: themeColors.primary,
        boxShadow: `0 0 20px ${themeColors.primary}40`
      }}
    >
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            size="sm"
            className="hover:scale-105 transition-transform"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Save className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onCancel}
            size="sm"
            variant="outline"
            className="hover:scale-105 transition-transform"
            style={{ 
              borderColor: themeColors.primary,
              color: themeColors.primary 
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onAddSection}
            size="sm"
            variant="outline"
            className="hover:scale-105 transition-transform"
            style={{ 
              borderColor: themeColors.primary,
              color: themeColors.primary 
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onUploadMedia}
            size="sm"
            variant="outline"
            className="hover:scale-105 transition-transform"
            style={{ 
              borderColor: themeColors.primary,
              color: themeColors.primary 
            }}
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onPreview}
            size="sm"
            variant="outline"
            className="hover:scale-105 transition-transform"
            style={{ 
              borderColor: themeColors.primary,
              color: themeColors.primary 
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
