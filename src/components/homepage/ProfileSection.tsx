import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface ProfileSectionProps {
  introduction: string;
  profileImageUrl: string | null;
  onUpdateIntroduction: (value: string) => void;
  onUpdateProfileImage: (url: string) => void;
}

export const ProfileSection = ({
  introduction,
  profileImageUrl,
  onUpdateIntroduction,
  onUpdateProfileImage
}: ProfileSectionProps) => {
  return (
    <div className="grid lg:grid-cols-5 gap-16 items-center mb-24 relative">
      {/* Left - Text content (3 cols) */}
      <motion.div
        className="lg:col-span-3 space-y-8"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-primary font-mono text-sm"
          >
            <Terminal className="h-4 w-4" />
            <span>~/about</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
          >
            Harshal <span className="text-gradient-primary">Gupta</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-1 w-16 bg-primary rounded-full origin-left"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <InlineEditText value={introduction} onSave={onUpdateIntroduction} multiline>
            <p className="text-base leading-[1.8] text-muted-foreground glass-card p-6 rounded-2xl">
              {introduction}
            </p>
          </InlineEditText>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-8"
        >
          {[
            { label: 'Focus', value: 'Security' },
            { label: 'Stack', value: 'Web3' },
            { label: 'Mode', value: 'Builder' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right - Profile image (2 cols) */}
      <motion.div
        className="lg:col-span-2 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="relative w-72 h-72 lg:w-80 lg:h-80">
          {/* Background decoration */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 blur-2xl" />
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-accent/20" />

          <InlineEditImage value={profileImageUrl} onSave={onUpdateProfileImage} bucket="profiles">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-secondary">
              <img
                src={profileImageUrl || '/placeholder.svg'}
                alt="Profile"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </InlineEditImage>

          {/* Corner accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-primary rounded-tl-lg" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-accent rounded-br-lg" />
        </div>
      </motion.div>
    </div>
  );
};
