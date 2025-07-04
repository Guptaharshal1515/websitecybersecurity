import { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface OverlayEditWrapperProps {
  children: React.ReactNode;
  onEdit: () => void;
  className?: string;
}

export const OverlayEditWrapper = ({ 
  children, 
  onEdit,
  className = "" 
}: OverlayEditWrapperProps) => {
  const { themeColors, userRole } = useTheme();

  if (userRole !== 'editor') {
    return <>{children}</>;
  }

  return (
    <div className={`relative group ${className}`}>
      {children}
      
      <div className="absolute bottom-2 right-2 z-50">
        <Button
          size="sm"
          onClick={onEdit}
          className="h-8 px-3 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Edit3 className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
};