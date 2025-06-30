
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
import { Shield, Code, User } from 'lucide-react';

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

  const handleImageSave = async (file: File | null) => {
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `profile-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) {
          // If bucket doesn't exist, create it and try again
          const { data: bucketData, error: bucketError } = await supabase.storage
            .createBucket('avatars', { public: true });
          
          if (!bucketError) {
            const { data: retryUpload, error: retryError } = await supabase.storage
              .from('avatars')
              .upload(fileName, file);
            
            if (retryError) throw retryError;
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            updateMutation.mutate({ profile_image_url: publicUrl });
          } else {
            throw uploadError;
          }
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          updateMutation.mutate({ profile_image_url: publicUrl });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({ title: 'Error uploading image', variant: 'destructive' });
      }
    } else {
      updateMutation.mutate({ profile_image_url: null });
    }
  };

  const defaultContent = {
    welcome_message: "Welcome to My Space",
    introduction: "I'm a security and blockchain enthusiast, showcasing my projects and certifications",
    about_bio: "Passionate cybersecurity and blockchain enthusiast focused on building secure, decentralized solutions for the future.",
    profile_image_url: null
  };

  const navigationBoxes = [
    {
      title: "Cybersecurity",
      subtitle: "Certificates",
      count: `${certificatesCount?.cybersecurity || 0} Earned`,
      icon: Shield,
      route: "/cybersecurity-certificates",
      gradient: "from-red-500 to-pink-500"
    },
    {
      title: "Blockchain",
      subtitle: "Certificates", 
      count: `${certificatesCount?.blockchain || 0} Earned`,
      icon: Code,
      route: "/blockchain-certificates",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Projects",
      subtitle: "Done",
      count: `${projectsCount || 0} Completed`,
      icon: User,
      route: "/projects",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <EditableText
            value={content?.welcome_message || defaultContent.welcome_message}
            onSave={(value) => handleTextSave('welcome_message', value)}
            className="text-4xl md:text-6xl font-bold"
            placeholder="Welcome message"
          />
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
            
            <EditableText
              value={content?.introduction || defaultContent.introduction}
              onSave={(value) => handleTextSave('introduction', value)}
              multiline={true}
              className="text-lg leading-relaxed opacity-90"
              style={{ color: themeColors.accent }}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full overflow-hidden" style={{ backgroundColor: themeColors.surface }}>
                  <EditableImage
                    src={content?.profile_image_url || defaultContent.profile_image_url}
                    alt="Profile"
                    onSave={handleImageSave}
                    className="w-full h-full object-cover"
                    isCircular={true}
                  />
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
              className={`group cursor-pointer border-0 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in`}
              style={{ 
                backgroundColor: themeColors.surface,
                animationDelay: `${index * 200}ms`
              }}
              onClick={() => navigate(box.route)}
            >
              <CardContent className="p-8 text-center relative">
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
                
                {/* Hover effect border */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-br group-hover:${box.gradient} rounded-lg transition-all duration-300`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Links */}
        <div className="text-center">
          <p 
            className="text-lg mb-6"
            style={{ color: themeColors.primary }}
          >
            Follow me or find me here
          </p>
          
          <div className="flex justify-center gap-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold">Li</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold">Git</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold">Tw</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold">Ig</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
