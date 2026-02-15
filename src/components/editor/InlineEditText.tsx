import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Check, X } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useTheme } from '@/contexts/ThemeContext';

interface InlineEditTextProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const InlineEditText = ({ 
  value, 
  onSave, 
  multiline = false, 
  className = "",
  children 
}: InlineEditTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const { isEditMode, canEdit } = useEditMode();
  const { themeColors } = useTheme();

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!canEdit || !isEditMode) {
    return <>{children}</>;
  }

  if (isEditing) {
    return (
      <div className={`relative ${className}`}>
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
            rows={3}
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {children}
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        onClick={() => setIsEditing(true)}
        style={{ backgroundColor: themeColors.surface, borderColor: themeColors.primary }}
      >
        <Edit className="h-3 w-3" style={{ color: themeColors.primary }} />
      </Button>
    </div>
  );
};