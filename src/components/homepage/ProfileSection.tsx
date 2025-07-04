import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { themeColors } = useTheme();

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
      {/* Left Side - Profile Section */}
      <div className="text-left space-y-6">
        <div className="space-y-2">
          <p className="text-lg opacity-80" style={{ color: themeColors.accent }}>
            Hello, It's Me
          </p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: themeColors.text }}>
            Harshal Gupta
          </h1>
        </div>
        
        <InlineEditText
          value={introduction}
          onSave={onUpdateIntroduction}
          multiline
        >
          <p className="text-lg leading-relaxed opacity-90 text-white">
            {introduction}
          </p>
        </InlineEditText>
      </div>

      {/* Right Side - Profile Image */}
      <div className="flex justify-center lg:justify-end">
        <div className="relative">
          <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1">
            <InlineEditImage
              value={profileImageUrl}
              onSave={onUpdateProfileImage}
              bucket="profiles"
            >
              <div className="w-full h-full rounded-full overflow-hidden" style={{ backgroundColor: themeColors.surface }}>
                <img
                  src={profileImageUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </InlineEditImage>
          </div>
          {/* Glowing ring effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-30 blur-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};