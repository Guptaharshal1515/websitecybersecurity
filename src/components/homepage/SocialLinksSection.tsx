import { AddContentButton } from '@/components/editor/AddContentButton';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { Linkedin, Github, Twitter, X, Shield, Code } from 'lucide-react';
import { motion } from 'framer-motion';

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
    'HackTheBox': Code,
  };
  return iconMap[name] || Code;
};

export const SocialLinksSection = ({ socialLinks, onManageSocialLinks, onDeleteSocialLink }: SocialLinksSectionProps) => {
  const { canEdit } = useEditMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-center pb-16"
    >
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em] mb-8">
        Connect
      </p>

      <div className="flex justify-center gap-3 mb-6">
        {socialLinks.map((social, i) => {
          const IconComponent = getIconComponent(social.name);
          return (
            <motion.div
              key={social.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
              className="relative group"
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center hover:border-primary/40 hover:text-primary text-muted-foreground transition-all duration-300 hover:scale-110 hover:glow-primary"
              >
                {social.icon_url ? (
                  <img src={social.icon_url} alt={social.name} className="h-4 w-4" />
                ) : (
                  <IconComponent className="h-4 w-4" />
                )}
              </a>
              {canEdit && (
                <DeleteButton
                  onDelete={() => onDeleteSocialLink(social.id)}
                  isVisible={true}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {canEdit && (
        <AddContentButton onClick={onManageSocialLinks}>
          Manage Social Links
        </AddContentButton>
      )}
    </motion.div>
  );
};
