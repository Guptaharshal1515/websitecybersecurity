import { AddContentButton } from '@/components/editor/AddContentButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Code, Linkedin, Github, Twitter } from 'lucide-react';

interface SocialLinksSectionProps {
  onManageSocialLinks: () => void;
}

export const SocialLinksSection = ({ onManageSocialLinks }: SocialLinksSectionProps) => {
  const { themeColors } = useTheme();
  const { canEdit } = useEditMode();

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, color: '#0077b5', url: 'https://linkedin.com/in/harshal-gupta' },
    { name: 'GitHub', icon: Github, color: '#333', url: 'https://github.com/guptaharshal' },
    { name: 'X', icon: Twitter, color: '#000', url: 'https://x.com/harshal_gupta' },
    { name: 'TryHackMe', icon: Shield, color: '#dc2626', url: 'https://tryhackme.com/p/harshal' },
    { name: 'HackTheBox', icon: Code, color: '#16a34a', url: 'https://hackthebox.com/profile/harshal' }
  ];

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
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer"
            style={{ backgroundColor: social.color }}
          >
            <social.icon className="h-6 w-6 text-white" />
          </a>
        ))}
      </div>
      
      {canEdit && (
        <AddContentButton onClick={onManageSocialLinks}>
          Manage Social Links
        </AddContentButton>
      )}
    </div>
  );
};