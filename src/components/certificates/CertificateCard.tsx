import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, X } from 'lucide-react';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';

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
  const { isEditMode, canEdit } = useEditMode();
  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enableImagePopup && certificate.image_url && !isEditMode) {
      setShowImageModal(true);
    }
  };

  const handleCardClick = () => {
    if (certificate.certificate_url && !isEditMode && !enableImagePopup) {
      window.open(certificate.certificate_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className={`glass-card hover:shadow-lg transition-all duration-300 group relative ${
        certificate.certificate_url && !isEditMode && !enableImagePopup ? 'cursor-pointer hover:scale-[1.02]' : ''
      } hover:border-primary/30`}
      onClick={handleCardClick}
    >
      <DeleteButton onDelete={() => onDelete(certificate.id)} isVisible={isEditMode && canEdit} />
      <CardContent className="p-6">
        <InlineEditImage value={certificate.image_url} onSave={(url) => onUpdate(certificate.id, 'image_url', url)} bucket="certificates">
          <div 
            className={`aspect-video mb-4 rounded-lg overflow-hidden bg-secondary ${
              enableImagePopup && certificate.image_url && !isEditMode ? 'cursor-pointer hover:opacity-80' : ''
            }`}
            onClick={handleImageClick}
          >
            <img src={certificate.image_url || '/placeholder.svg'} alt={certificate.title} className="w-full h-full object-cover" />
          </div>
        </InlineEditImage>
        
        <InlineEditText value={certificate.title} onSave={(value) => onUpdate(certificate.id, 'title', value)}>
          <h3 className="text-xl font-semibold mb-2 text-foreground">{certificate.title}</h3>
        </InlineEditText>
        
        <InlineEditText value={certificate.description || ''} onSave={(value) => onUpdate(certificate.id, 'description', value)} multiline>
          <p className="text-sm mb-4 leading-relaxed text-muted-foreground">{certificate.description}</p>
        </InlineEditText>
        
        {certificate.completion_date && (
          <p className="text-xs mb-3 text-muted-foreground font-mono">
            Completed: {new Date(certificate.completion_date).toLocaleDateString('en-GB')}
          </p>
        )}
        
        {certificate.certificate_url && (
          <a
            href={certificate.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            View Certificate
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardContent>

      {showImageModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl max-h-full">
            <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 z-10">
              <X className="h-5 w-5" />
            </button>
            <img src={certificate.image_url || '/placeholder.svg'} alt={certificate.title} className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </Card>
  );
};
