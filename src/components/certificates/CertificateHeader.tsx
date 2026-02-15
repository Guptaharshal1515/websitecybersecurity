import { AddContentButton } from '@/components/editor/AddContentButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { useTheme } from '@/contexts/ThemeContext';

interface CertificateHeaderProps {
  title: string;
  onAddCertificate: () => void;
}

export const CertificateHeader = ({ title, onAddCertificate }: CertificateHeaderProps) => {
  const { themeColors } = useTheme();
  const { canEdit } = useEditMode();

  return (
    <div className="flex justify-between items-center mb-16">
      <div className="relative">
        <h1 className="text-4xl font-bold text-white">
          {title}
        </h1>
        <div 
          className="absolute bottom-0 left-0 w-full h-1 rounded mt-2"
          style={{ 
            backgroundColor: themeColors.primary,
            boxShadow: `0 0 10px ${themeColors.primary}`
          }}
        />
      </div>
      
      {canEdit && (
        <AddContentButton onClick={onAddCertificate}>
          Add Certificate
        </AddContentButton>
      )}
    </div>
  );
};