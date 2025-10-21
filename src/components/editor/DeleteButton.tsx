import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface DeleteButtonProps {
  onDelete: () => void;
  isVisible: boolean;
  className?: string;
}

export const DeleteButton = ({ onDelete, isVisible, className = "" }: DeleteButtonProps) => {
  const { themeColors } = useTheme();

  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete();
  };

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="destructive"
      className={`absolute top-2 right-2 h-8 w-8 p-0 opacity-80 hover:opacity-100 z-10 ${className}`}
      style={{ backgroundColor: '#ef4444' }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};