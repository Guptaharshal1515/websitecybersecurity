
import { useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface LiveEditWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
}

export const LiveEditWrapper = ({ 
  children, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel,
  className = "" 
}: LiveEditWrapperProps) => {
  const { themeColors, userRole } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  if (userRole !== 'admin') {
    return <>{children}</>;
  }

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {(isHovered || isEditing) && (
        <div className="absolute top-2 right-2 z-50">
          {!isEditing ? (
            <Button
              size="sm"
              onClick={onEdit}
              className="h-6 w-6 p-1 rounded-full shadow-lg"
              style={{ backgroundColor: themeColors.primary }}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={onSave}
                className="h-6 w-6 p-1 rounded-full shadow-lg bg-green-500 hover:bg-green-600"
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                onClick={onCancel}
                className="h-6 w-6 p-1 rounded-full shadow-lg bg-red-500 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
