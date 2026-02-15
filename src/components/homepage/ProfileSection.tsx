import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

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
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 relative">
      {/* Floating elements */}
      <div className="absolute top-0 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-10 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Left Side - Profile Section */}
      <motion.div 
        className="text-left space-y-8 relative z-10"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="space-y-4">
          <motion.p 
            className="text-xl font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Hello, It's Me
          </motion.p>
          <motion.h1 
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Harshal Gupta
          </motion.h1>
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <InlineEditText
            value={introduction}
            onSave={onUpdateIntroduction}
            multiline
          >
            <p className="text-xl leading-relaxed text-gray-100 font-light backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
              {introduction}
            </p>
          </InlineEditText>
        </motion.div>
      </motion.div>

      {/* Right Side - Profile Image */}
      <div className="flex justify-center lg:justify-end relative">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1.5, 
            delay: 0.7,
            type: "spring",
            stiffness: 100
          }}
        >
          {/* Animated rings */}
          <div className="absolute -inset-8 animate-spin-slow">
            <div className="w-full h-full rounded-full border-2 border-dashed border-cyan-400/30"></div>
          </div>
          <div className="absolute -inset-12 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }}>
            <div className="w-full h-full rounded-full border border-dotted border-purple-500/20"></div>
          </div>
          
          <div className="relative w-80 h-80 group">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 group-hover:scale-105 transition-transform duration-300">
              <InlineEditImage
                value={profileImageUrl}
                onSave={onUpdateProfileImage}
                bucket="profiles"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                  <img
                    src={profileImageUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </InlineEditImage>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-4 -right-4 w-4 h-4 bg-cyan-400 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-50"></div>
            <div className="absolute top-1/4 -left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            
            {/* Glow effects */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 blur-2xl animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};