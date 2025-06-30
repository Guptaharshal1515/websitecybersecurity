
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { useToast } from '@/hooks/use-toast';

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
      // In a real implementation, you'd upload to Supabase Storage
      // For now, we'll use a placeholder URL
      const imageUrl = URL.createObjectURL(file);
      updateMutation.mutate({ profile_image_url: imageUrl });
    } else {
      updateMutation.mutate({ profile_image_url: null });
    }
  };

  const defaultContent = {
    welcome_message: "Welcome to My Space",
    introduction: "Hey there! I'm Harshal, a passionate enthusiast in Cybersecurity, Blockchain, and FinTech. I love exploring how technology secures the digital world — from ethical hacking to blockchain protocols. With a sharp focus on Web3, digital forensics, and decentralized systems, I'm building skills to shape the future of secure, transparent tech. This space is where I showcase my journey — from certifications to real-world projects — all driven by curiosity and ambition. Let's dive into the world of secure innovation together!",
    about_bio: "Passionate cybersecurity and blockchain enthusiast focused on building secure, decentralized solutions for the future.",
    profile_image_url: null
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <EditableText
            value={content?.welcome_message || defaultContent.welcome_message}
            onSave={(value) => handleTextSave('welcome_message', value)}
            className="text-4xl md:text-6xl font-bold mb-8"
            placeholder="Welcome message"
          />
          
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-48 h-48 mb-4">
              <EditableImage
                src={content?.profile_image_url || defaultContent.profile_image_url}
                alt="Profile"
                onSave={handleImageSave}
                className="w-48 h-48"
                isCircular={true}
              />
            </div>
            
            <h2 
              className="text-2xl font-semibold"
              style={{ color: themeColors.primary }}
            >
              Harshal Gupta
            </h2>
          </div>
        </div>

        {/* About Me Section */}
        <Card 
          className="mb-16 border-0"
          style={{ backgroundColor: themeColors.surface }}
        >
          <CardContent className="p-8">
            <h3 
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: themeColors.primary }}
            >
              About Me
            </h3>
            
            <EditableText
              value={content?.introduction || defaultContent.introduction}
              onSave={(value) => handleTextSave('introduction', value)}
              multiline={true}
              className="text-lg leading-relaxed text-center"
              placeholder="Tell us about yourself..."
            />
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="text-center">
          <p 
            className="text-lg mb-6"
            style={{ color: themeColors.primary }}
          >
            Follow me or find me here
          </p>
          
          <div className="flex justify-center gap-4">
            {/* Social media icons would go here */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">Li</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white font-bold">Git</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center">
                <span className="text-white font-bold">Tw</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center">
                <span className="text-white font-bold">Ig</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
