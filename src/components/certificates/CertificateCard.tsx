import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, X } from 'lucide-react';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { useTheme } from '@/contexts/ThemeContext';

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  type: string | null;
  display_order: number | null;
  completion_date?: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
  enableImagePopup?: boolean;
}

export const CertificateCard = ({ certificate, onUpdate, onDelete, enableImagePopup }: CertificateCardProps) => {
  const { themeColors } = useTheme();
  const { isEditMode, canEdit } = useEditMode();
  const [showImageModal, setShowImageModal] = useState(false);

  const handleCardClick = () => {
    if (certificate.certificate_url && !isEditMode) {
      window.open(certificate.certificate_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className={`border-0 hover:shadow-lg transition-all duration-300 group relative ${
        certificate.certificate_url && !isEditMode ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
      style={{ 
        backgroundColor: themeColors.surface,
        boxShadow: `0 0 20px ${themeColors.primary}50`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${themeColors.primary}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${themeColors.primary}50`;
      }}
      onClick={handleCardClick}
    >
      <DeleteButton
        onDelete={() => onDelete(certificate.id)}
        isVisible={isEditMode && canEdit}
      />
      <CardContent className="p-6">
        <InlineEditImage
          value={certificate.image_url}
          onSave={(url) => onUpdate(certificate.id, 'image_url', url)}
          bucket="certificates"
        >
          <div 
            className={`aspect-video mb-4 rounded-lg overflow-hidden ${
              enableImagePopup && !certificate.certificate_url && !isEditMode ? 'cursor-pointer hover:opacity-80' : ''
            }`}
            onClick={() => {
              if (enableImagePopup && !certificate.certificate_url && !isEditMode) {
                setShowImageModal(true);
              }
            }}
          >
            <img
              src={certificate.image_url || '/placeholder.svg'}
              alt={certificate.title}
              className="w-full h-full object-cover"
            />
          </div>
        </InlineEditImage>
        
        <InlineEditText
          value={certificate.title}
          onSave={(value) => onUpdate(certificate.id, 'title', value)}
        >
          <h3 className="text-xl font-semibold mb-2 text-white">
            {certificate.title}
          </h3>
        </InlineEditText>
        
        <InlineEditText
          value={certificate.description || ''}
          onSave={(value) => onUpdate(certificate.id, 'description', value)}
          multiline
        >
          <p className="text-sm mb-4 leading-relaxed text-white">
            {certificate.description}
          </p>
        </InlineEditText>
        
        {certificate.completion_date && (
          <p className="text-xs mb-3 opacity-80 text-white">
            Completed: {new Date(certificate.completion_date).toLocaleDateString('en-GB')}
          </p>
        )}
        
        {certificate.certificate_url && (
          <div className="flex items-center justify-between">
            <a
              href={certificate.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: themeColors.primary, color: 'white' }}
              onClick={(e) => e.stopPropagation()}
            >
              View Certificate
              <ExternalLink className="h-4 w-4" />
            </a>
            {!isEditMode && (
              <span className="text-xs text-gray-400">
                Click card to open
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={certificate.image_url || '/placeholder.svg'}
              alt={certificate.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Card>
  );
};