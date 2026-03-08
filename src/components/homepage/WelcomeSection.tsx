import React from 'react';
import { motion } from 'framer-motion';
import { InlineEditText } from '@/components/editor/InlineEditText';

interface WelcomeSectionProps {
  welcomeMessage: string;
  onUpdateWelcome: (value: string) => void;
}

export const WelcomeSection = ({ welcomeMessage, onUpdateWelcome }: WelcomeSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="pt-32 pb-8 relative"
    >
      {/* Grid background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono uppercase tracking-[0.2em]">
            Portfolio 2026
          </span>
        </motion.div>

        <InlineEditText value={welcomeMessage} onSave={onUpdateWelcome}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-gradient-primary mb-6 leading-[0.9]"
          >
            {welcomeMessage}
          </motion.h1>
        </InlineEditText>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Building secure digital infrastructure at the intersection of
          <span className="text-primary font-medium"> cybersecurity</span>,
          <span className="text-accent font-medium"> blockchain</span>, and
          <span className="text-foreground font-medium"> cloud</span>.
        </motion.p>

        {/* Animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent max-w-lg mx-auto"
        />
      </div>
    </motion.div>
  );
};
