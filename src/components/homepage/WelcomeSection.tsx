import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { InlineEditText } from '@/components/editor/InlineEditText';
import heroIllustration from '@/assets/hero-illustration.png';

interface WelcomeSectionProps {
  welcomeMessage: string;
  onUpdateWelcome: (value: string) => void;
}

export const WelcomeSection = ({ welcomeMessage, onUpdateWelcome }: WelcomeSectionProps) => {
  const scrollToExplore = () => {
    const el = document.getElementById('explore-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="pt-28 pb-12 relative min-h-[80vh] flex items-center"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left - Text */}
        <div className="space-y-6">
          <InlineEditText value={welcomeMessage} onSave={onUpdateWelcome}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gradient-primary leading-[1.1]"
            >
              {welcomeMessage}
            </motion.h1>
          </InlineEditText>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
          >
            Building secure digital infrastructure at the intersection of
            <span className="text-primary font-medium"> cybersecurity</span>,
            <span className="text-accent font-medium"> blockchain</span>,
            <span className="text-foreground font-medium"> cloud</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button
              onClick={scrollToExplore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 bg-primary/5 text-primary font-medium text-sm hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 group"
            >
              Explore Portfolio
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Right - Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex justify-center items-center"
        >
          <div className="relative w-full max-w-lg">
            {/* Ambient glow behind illustration */}
            <div className="absolute -inset-16 bg-primary/8 rounded-full blur-[120px]" />
            <div className="absolute -inset-10 bg-accent/5 rounded-full blur-[100px]" />
            {/* Mask to blend edges into background */}
            <div className="relative overflow-hidden rounded-3xl" style={{
              maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            }}>
              <img
                src={heroIllustration}
                alt="Cybersecurity and blockchain illustration"
                className="w-full h-auto object-contain mix-blend-lighten"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
