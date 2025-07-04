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
        <h1 className="text-4xl md:text-6xl font-bold text-white relative welcome-glow">
          {welcomeMessage}
        </h1>
      </InlineEditText>
    </div>
  );
};