import { Plus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface AddContentButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AddContentButton = ({ 
  onClick, 
  children,
  className = "" 
}: AddContentButtonProps) => {
  const { userRole } = useTheme();

  if (userRole !== 'editor') {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={`border-primary text-primary hover:bg-primary hover:text-primary-foreground ${className}`}
    >
      <Plus className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
};