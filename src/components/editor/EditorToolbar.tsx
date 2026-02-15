import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface EditorToolbarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

export const EditorToolbar = ({ isEditMode, onToggleEditMode }: EditorToolbarProps) => {
  const { themeColors, userRole } = useTheme();

  if (userRole !== 'editor') {
    return null;
  }

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
        <Button
          onClick={onToggleEditMode}
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          className="hover:scale-105 transition-transform"
          style={{ 
            backgroundColor: isEditMode ? themeColors.primary : 'transparent',
            borderColor: themeColors.primary,
            color: isEditMode ? 'white' : themeColors.primary 
          }}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditMode ? 'Edit On' : 'Edit Mode'}
        </Button>
      </CardContent>
    </Card>
  );
};