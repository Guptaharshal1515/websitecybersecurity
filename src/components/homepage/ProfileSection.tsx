import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { motion } from 'framer-motion';
import { ShieldCheck, Blocks, Bot, Cloud } from 'lucide-react';

interface ProfileSectionProps {
  introduction: string;
  profileImageUrl: string | null;
  onUpdateIntroduction: (value: string) => void;
  onUpdateProfileImage: (url: string) => void;
}

const skillTags = [
  { label: 'Cybersecurity', icon: ShieldCheck, colorClass: 'text-primary border-primary/30' },
  { label: 'Blockchain', icon: Blocks, colorClass: 'text-accent border-accent/30' },
  { label: 'AI Security', icon: Bot, colorClass: 'text-primary border-primary/30' },
  { label: 'Cloud / FinTech', icon: Cloud, colorClass: 'text-muted-foreground border-border' },
];

export const ProfileSection = ({
  introduction,
  profileImageUrl,
  onUpdateIntroduction,
  onUpdateProfileImage
}: ProfileSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-24 relative glass-card rounded-2xl p-8 md:p-10 overflow-hidden"
    >
      {/* Subtle glow effects */}
      <div className="absolute top-0 left-1/4 w-48 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 right-1/4 w-48 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
          className="shrink-0"
        >
          <div className="relative w-40 h-40 md:w-44 md:h-44">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/40 via-transparent to-accent/30" />
            <InlineEditImage value={profileImageUrl} onSave={onUpdateProfileImage} bucket="profiles">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-secondary">
                <img
                  src={profileImageUrl || '/placeholder.svg'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </InlineEditImage>
            {/* Corner accents */}
            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-l-2 border-t-2 border-primary rounded-tl-md" />
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-r-2 border-b-2 border-accent rounded-br-md" />
          </div>
        </motion.div>

        {/* Text content */}
        <div className="flex-1 space-y-5 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
          >
            Hi, I'm <span className="text-gradient-primary">Harshal Gupta</span> 👋
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <InlineEditText value={introduction} onSave={onUpdateIntroduction} multiline>
              <p className="text-sm md:text-base leading-[1.8] text-muted-foreground max-w-2xl">
                {introduction}
              </p>
            </InlineEditText>
          </motion.div>

          {/* Skill tags */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            {skillTags.map((tag, i) => (
              <motion.div
                key={tag.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-card/50 backdrop-blur-sm text-sm font-medium transition-all duration-300 hover:bg-card/80 ${tag.colorClass}`}
              >
                <tag.icon className="h-4 w-4" />
                {tag.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
