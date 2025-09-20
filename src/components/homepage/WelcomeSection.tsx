import React from 'react';
import { motion } from 'framer-motion';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { Sparkles, Code2, Shield } from 'lucide-react';

interface WelcomeSectionProps {
  welcomeMessage: string;
  onUpdateWelcome: (value: string) => void;
}

export const WelcomeSection = ({ welcomeMessage, onUpdateWelcome }: WelcomeSectionProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"
        />
        
        {/* Floating Icons */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-32 left-1/4 text-primary/30"
        >
          <Code2 className="w-8 h-8" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-1/4 text-accent/30"
        >
          <Shield className="w-6 h-6" />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -8, 0],
            x: [0, 5, 0]
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-24 right-1/3 text-primary/20"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        <InlineEditText
          value={welcomeMessage}
          onSave={onUpdateWelcome}
        >
          <motion.h1 
            className="text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mb-8 welcome-glow relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {welcomeMessage}
            {/* Sparkle effects */}
            <motion.div
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: 0
              }}
              className="absolute -top-2 -right-4 text-accent/60"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </motion.h1>
        </InlineEditText>
        
        <motion.div 
          className="relative mx-auto mb-6"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full glow-underline relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-200, 200] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear",
                delay: 1 
              }}
            />
          </div>
        </motion.div>

        {/* Subtitle with typing effect */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
        >
          Crafting secure digital experiences with passion for cybersecurity and innovation
        </motion.p>
      </motion.div>
    </div>
  );
};