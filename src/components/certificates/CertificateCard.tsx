import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
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
}

export const CertificateCard = ({ certificate, onUpdate, onDelete }: CertificateCardProps) => {
  const { themeColors } = useTheme();
  const { isEditMode, canEdit } = useEditMode();

  return (
    <Card 
      className="border-0 hover:shadow-lg transition-shadow duration-300 group relative"
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
          <div className="aspect-video mb-4 rounded-lg overflow-hidden">
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
            Completed: {new Date(certificate.completion_date).toLocaleDateString()}
          </p>
        )}
        
        {certificate.certificate_url && (
          <a
            href={certificate.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.primary, color: 'white' }}
          >
            View Certificate
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};