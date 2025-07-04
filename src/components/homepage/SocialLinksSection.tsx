import { AddContentButton } from '@/components/editor/AddContentButton';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Code, Linkedin, Github, Twitter, X } from 'lucide-react';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon_url?: string | null;
  display_order?: number;
}

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onManageSocialLinks: () => void;
  onDeleteSocialLink: (id: string) => void;
}

const getIconComponent = (name: string) => {
  const iconMap: { [key: string]: any } = {
    'LinkedIn': Linkedin,
    'GitHub': Github,
    'X': X,
    'Twitter': Twitter,
    'TryHackMe': Shield,
    'HackTheBox': Code
  };
  return iconMap[name] || Code;
};

const getIconColor = (name: string) => {
  const colorMap: { [key: string]: string } = {
    'LinkedIn': '#0077b5',
    'GitHub': '#333',
    'X': '#000',
    'Twitter': '#1da1f2',
    'TryHackMe': '#dc2626',
    'HackTheBox': '#16a34a'
  };
  return colorMap[name] || '#666';
};

export const SocialLinksSection = ({ socialLinks, onManageSocialLinks, onDeleteSocialLink }: SocialLinksSectionProps) => {
  const { themeColors } = useTheme();
  const { canEdit } = useEditMode();

  return (
    <div className="text-center">
      <div className="relative inline-block mb-6">
        <p 
          className="text-3xl font-semibold text-white"
          style={{ color: themeColors.primary }}
        >
          Follow me or find me here
        </p>
        <div 
          className="absolute bottom-0 left-0 w-full h-1 rounded animate-pulse"
          style={{ 
            backgroundColor: themeColors.primary,
            boxShadow: `0 0 10px ${themeColors.primary}, 0 0 20px ${themeColors.primary}`
          }}
        />
      </div>
      
      <div className="flex justify-center gap-4 mb-4">
        {socialLinks.map((social) => {
          const IconComponent = getIconComponent(social.name);
          const iconColor = getIconColor(social.name);
          
          return (
            <div key={social.id} className="relative group">
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer"
                style={{ backgroundColor: iconColor }}
              >
                {social.icon_url ? (
                  <img src={social.icon_url} alt={social.name} className="h-6 w-6" />
                ) : (
                  <IconComponent className="h-6 w-6 text-white" />
                )}
              </a>
              
              {canEdit && (
                <DeleteButton
                  onDelete={() => onDeleteSocialLink(social.id)}
                  isVisible={true}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                />
              )}
            </div>
          );
        })}
      </div>
      
      {canEdit && (
        <AddContentButton onClick={onManageSocialLinks}>
          Manage Social Links
        </AddContentButton>
      )}
    </div>
  );
};