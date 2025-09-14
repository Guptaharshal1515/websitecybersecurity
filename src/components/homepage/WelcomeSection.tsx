import { InlineEditText } from '@/components/editor/InlineEditText';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface WelcomeSectionProps {
  welcomeMessage: string;
  onUpdateWelcome: (value: string) => void;
}

export const WelcomeSection = ({ welcomeMessage, onUpdateWelcome }: WelcomeSectionProps) => {
  const { themeColors } = useTheme();

  return (
    <div className="text-center mb-16 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <InlineEditText
          value={welcomeMessage}
          onSave={onUpdateWelcome}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative z-10">
            {welcomeMessage}
          </h1>
        </InlineEditText>
        
        {/* Glowing underline */}
        <motion.div 
          className="mt-4 h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
};