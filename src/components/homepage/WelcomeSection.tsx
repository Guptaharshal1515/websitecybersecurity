import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { InlineEditText } from '@/components/editor/InlineEditText';
import BlurText from '@/components/ui/BlurText';
import heroBg from '@/assets/hero-bg.png';

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
    <div className="relative min-h-[80vh] flex items-center -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover object-right"
        />
        {/* Fade edges into site background */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/90" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 pt-28 pb-12 w-full max-w-2xl"
      >
        <div className="space-y-6">
          <InlineEditText value={welcomeMessage} onSave={onUpdateWelcome}>
            <BlurText
              text={welcomeMessage}
              delay={150}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-primary"
            />
          </InlineEditText>

          <BlurText
            text="Building secure digital infrastructure at the intersection of cybersecurity, blockchain, cloud."
            delay={80}
            animateBy="words"
            direction="bottom"
            stepDuration={0.3}
            className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <button
              onClick={scrollToExplore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 bg-primary/5 text-primary font-medium text-sm hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 group backdrop-blur-sm"
            >
              Explore Portfolio
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
