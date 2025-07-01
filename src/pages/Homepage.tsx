
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Shield, Code, User, Linkedin, Github, Twitter } from 'lucide-react';

interface HomepageContent {
  id: string;
  welcome_message: string | null;
  introduction: string | null;
  about_bio: string | null;
  profile_image_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  contact_email: string | null;
}

export const Homepage = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: content } = useQuery({
    queryKey: ['homepage-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as HomepageContent | null;
    },
  });

  const { data: certificatesCount } = useQuery({
    queryKey: ['certificates-count'],
    queryFn: async () => {
      const [cybersecurity, blockchain] = await Promise.all([
        supabase.from('certificates').select('id', { count: 'exact' }).eq('type', 'cybersecurity'),
        supabase.from('certificates').select('id', { count: 'exact' }).eq('type', 'blockchain')
      ]);
      return {
        cybersecurity: cybersecurity.count || 0,
        blockchain: blockchain.count || 0
      };
    },
  });

  const { data: projectsCount } = useQuery({
    queryKey: ['projects-count'],
    queryFn: async () => {
      const { count } = await supabase.from('projects').select('id', { count: 'exact' });
      return count || 0;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<HomepageContent>) => {
      if (content?.id) {
        const { data, error } = await supabase
          .from('homepage_content')
          .update(updates)
          .eq('id', content.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('homepage_content')
          .insert([updates])
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
      toast({ title: 'Content updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error updating content', description: error.message, variant: 'destructive' });
    }
  });

  const handleTextSave = (field: keyof HomepageContent, value: string) => {
    updateMutation.mutate({ [field]: value });
  };

  const handleImageSave = async (url: string | null) => {
    updateMutation.mutate({ profile_image_url: url });
  };

  const defaultContent = {
    welcome_message: "Welcome to My Space",
    introduction: "I'm a passionate Computer Science student with a strong focus on Cybersecurity, Blockchain, and Cloud technologies. My journey blends formal education with hands-on experience, where I explore offensive security, red teaming, Web3 development, and more. Through this portfolio, I document my learning, certifications, projects, and progress toward becoming a skilled cyber professional.",
    about_bio: "Passionate cybersecurity and blockchain enthusiast focused on building secure, decentralized solutions for the future.",
    profile_image_url: null
  };

  const navigationBoxes = [
    {
      title: "Cybersecurity",
      subtitle: "Certificates",
      count: `${certificatesCount?.cybersecurity || 3} Earned`,
      icon: Shield,
      route: "/cybersecurity-certificates",
      gradient: "from-red-500 to-pink-500",
      glowColor: "#dc2626"
    },
    {
      title: "Blockchain",
      subtitle: "Certificates", 
      count: `${certificatesCount?.blockchain || 2} Earned`,
      icon: Code,
      route: "/blockchain-certificates",
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "#2563eb"
    },
    {
      title: "Projects",
      subtitle: "Done",
      count: `${projectsCount || 5} Completed`,
      icon: User,
      route: "/projects",
      gradient: "from-green-500 to-emerald-500",
      glowColor: "#16a34a"
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, color: '#0077b5', url: 'https://linkedin.com/in/harshal-gupta' },
    { name: 'GitHub', icon: Github, color: '#333', url: 'https://github.com/guptaharshal' },
    { name: 'X', icon: Twitter, color: '#000', url: 'https://x.com/harshal_gupta' },
    { name: 'TryHackMe', icon: Shield, color: '#dc2626', url: 'https://tryhackme.com/p/harshal' },
    { name: 'HackTheBox', icon: Code, color: '#16a34a', url: 'https://hackthebox.com/profile/harshal' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {userRole === 'admin' ? (
              <EditableText
                value={content?.welcome_message || defaultContent.welcome_message}
                onSave={(value) => handleTextSave('welcome_message', value)}
                className="text-4xl md:text-6xl font-bold text-white relative welcome-glow"
                placeholder="Welcome message"
              />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-white relative welcome-glow">
                {content?.welcome_message || defaultContent.welcome_message}
              </h1>
            )}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 rounded animate-pulse glow-underline"
              style={{ 
                backgroundColor: themeColors.primary,
                boxShadow: `0 0 20px ${themeColors.primary}, 0 0 40px ${themeColors.primary}`
              }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
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
            
            {userRole === 'admin' ? (
              <EditableText
                value={content?.introduction || defaultContent.introduction}
                onSave={(value) => handleTextSave('introduction', value)}
                multiline={true}
                className="text-lg leading-relaxed opacity-90 text-white"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-lg leading-relaxed opacity-90 text-white">
                {content?.introduction || defaultContent.introduction}
              </p>
            )}
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full overflow-hidden" style={{ backgroundColor: themeColors.surface }}>
                  {userRole === 'admin' ? (
                    <EditableImage
                      src={content?.profile_image_url || defaultContent.profile_image_url}
                      alt="Profile"
                      onSave={handleImageSave}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={content?.profile_image_url || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              {/* Glowing ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-30 blur-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Boxes */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {navigationBoxes.map((box, index) => (
            <Card
              key={box.title}
              className={`group cursor-pointer border-0 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in relative pixel-box`}
              style={{ 
                backgroundColor: themeColors.surface,
                animationDelay: `${index * 200}ms`
              }}
              onClick={() => navigate(box.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${box.glowColor}`;
                e.currentTarget.style.border = `2px solid ${box.glowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.border = '';
              }}
            >
              <CardContent className="p-8 text-center relative pixel-animation">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${box.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${box.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    <box.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text }}>
                  {box.title}
                </h3>
                <p className="text-sm mb-3" style={{ color: themeColors.accent }}>
                  {box.subtitle}
                </p>
                <p className="text-lg font-semibold" style={{ color: themeColors.primary }}>
                  {box.count}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Links */}
        <div className="text-center">
          <p 
            className="text-2xl mb-6 font-semibold"
            style={{ color: themeColors.primary }}
          >
            Follow me or find me here
          </p>
          
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer"
                style={{ backgroundColor: social.color }}
              >
                <social.icon className="h-6 w-6 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .welcome-glow {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .glow-underline {
          animation: glow-pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow-pulse {
          from {
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
          }
          to {
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
          }
        }
        
        .pixel-animation {
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .pixel-animation:hover {
          animation: pixelGlitch 0.5s ease-in-out;
        }
        
        .pixel-box:hover {
          animation: pixelPop 0.3s ease-out;
        }
        
        @keyframes pixelPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1.05); }
        }
        
        @keyframes pixelGlitch {
          0% { transform: translateX(0); }
          10% { transform: translateX(-2px); }
          20% { transform: translateX(2px); }
          30% { transform: translateX(-1px); }
          40% { transform: translateX(1px); }
          50% { transform: translateX(-2px); }
          60% { transform: translateX(2px); }
          70% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          90% { transform: translateX(-1px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
