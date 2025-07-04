
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WelcomeSection } from '@/components/homepage/WelcomeSection';
import { ProfileSection } from '@/components/homepage/ProfileSection';
import { NavigationBoxes } from '@/components/homepage/NavigationBoxes';
import { SocialLinksSection } from '@/components/homepage/SocialLinksSection';
import { SocialLinkForm } from '@/components/editor/forms/SocialLinkForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { uploadImageToStorage, getPublicUrl } from '@/utils/storage';
import { Shield, Code, User, Linkedin, Github, Twitter, Upload, X, Plus } from 'lucide-react';

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
  const { themeColors } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Editor state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

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
      setEditingField(null);
      setEditingValue('');
      setSelectedFile(null);
      setPreviewUrl('');
    },
    onError: (error) => {
      toast({ title: 'Error updating content', description: error.message, variant: 'destructive' });
    }
  });

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditingValue(currentValue || '');
  };

  const handleSaveText = async () => {
    if (editingField) {
      updateMutation.mutate({ [editingField]: editingValue });
    }
  };

  const handleSaveImage = async () => {
    if (selectedFile) {
      try {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        await uploadImageToStorage(selectedFile, 'profiles', fileName);
        const publicUrl = getPublicUrl('profiles', fileName);
        
        updateMutation.mutate({ profile_image_url: publicUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({ title: 'Error uploading image', variant: 'destructive' });
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditingValue('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const defaultContent = {
    welcome_message: "Welcome to My Space",
    introduction: "I'm a passionate Computer Science student with a strong focus on Cybersecurity, Blockchain, and Cloud technologies. My journey blends formal education with hands-on experience, where I explore offensive security, red teaming, Web3 development, and more. Through this portfolio, I document my learning, certifications, projects, and progress toward becoming a skilled cyber professional.",
    about_bio: "Passionate cybersecurity and blockchain enthusiast focused on building secure, decentralized solutions for the future.",
    profile_image_url: null
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-8">
        <WelcomeSection 
          welcomeMessage={content?.welcome_message || defaultContent.welcome_message}
          onUpdateWelcome={(value) => updateMutation.mutate({ welcome_message: value })}
        />

        <ProfileSection 
          introduction={content?.introduction || defaultContent.introduction}
          profileImageUrl={content?.profile_image_url}
          onUpdateIntroduction={(value) => updateMutation.mutate({ introduction: value })}
          onUpdateProfileImage={(url) => updateMutation.mutate({ profile_image_url: url })}
        />

        <NavigationBoxes 
          certificatesCount={certificatesCount}
          projectsCount={projectsCount}
        />

        <SocialLinksSection 
          onManageSocialLinks={() => setShowAddForm(true)}
        />
      </div>

      {/* Edit Text Dialog */}
      <Dialog open={editingField !== null && editingField !== 'profile_image'} onOpenChange={cancelEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingField?.replace('_', ' ')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingField === 'introduction' ? (
              <Textarea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                rows={4}
              />
            ) : (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
              />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              <Button onClick={handleSaveText}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Image Dialog */}
      <Dialog open={editingField === 'profile_image'} onOpenChange={cancelEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <Button variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
                    Upload Image
                  </Button>
                </div>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              <Button onClick={handleSaveImage} disabled={!selectedFile}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SocialLinkForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={(data) => {
          // Handle social link submission
          toast({ title: 'Social link functionality coming soon!' });
          setShowAddForm(false);
        }}
      />

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
        
        .pixel-box:hover {
          animation: none;
        }
        
        @keyframes pixelPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};
