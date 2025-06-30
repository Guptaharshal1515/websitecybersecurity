
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LiveEditWrapper } from './LiveEditWrapper';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}

export const EditableText = ({ 
  value, 
  onSave, 
  multiline = false, 
  className = "",
  placeholder = "Enter text..."
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <LiveEditWrapper
      isEditing={isEditing}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      className={className}
    >
      {isEditing ? (
        multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="w-full"
            rows={4}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        )
      ) : (
        <div className={multiline ? "whitespace-pre-wrap" : ""}>
          {value || placeholder}
        </div>
      )}
    </LiveEditWrapper>
  );
};
