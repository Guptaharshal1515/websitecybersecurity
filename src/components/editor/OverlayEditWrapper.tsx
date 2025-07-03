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
  const [isHovered, setIsHovered] = useState(false);

  if (userRole !== 'editor') {
    return <>{children}</>;
  }

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {isHovered && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            size="sm"
            onClick={onEdit}
            className="h-8 px-3 rounded-full shadow-lg animate-fade-in bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Edit3 className="h-3 w-3 mr-2" />
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};