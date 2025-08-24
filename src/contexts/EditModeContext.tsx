import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  canEdit: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};

export const EditModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { userRole } = useAuth();
  
  const canEdit = userRole === 'admin' || userRole === 'editor';
  
  const toggleEditMode = () => {
    if (canEdit) {
      setIsEditMode(prev => !prev);
    }
  };

  const value = {
    isEditMode: canEdit ? isEditMode : false,
    toggleEditMode,
    canEdit,
  };

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
};