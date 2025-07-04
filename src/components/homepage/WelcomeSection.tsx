import { InlineEditText } from '@/components/editor/InlineEditText';
import { useTheme } from '@/contexts/ThemeContext';

interface WelcomeSectionProps {
  welcomeMessage: string;
  onUpdateWelcome: (value: string) => void;
}

export const WelcomeSection = ({ welcomeMessage, onUpdateWelcome }: WelcomeSectionProps) => {
  const { themeColors } = useTheme();

  return (
    <div className="text-center mb-12">
      <InlineEditText
        value={welcomeMessage}
        onSave={onUpdateWelcome}
      >
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-6xl font-bold text-white relative welcome-glow">
            {welcomeMessage}
          </h1>
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 rounded animate-pulse glow-underline"
            style={{ 
              backgroundColor: themeColors.primary,
              boxShadow: `0 0 20px ${themeColors.primary}, 0 0 40px ${themeColors.primary}`
            }}
          />
        </div>
      </InlineEditText>
    </div>
  );
};