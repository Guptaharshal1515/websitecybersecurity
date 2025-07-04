
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
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { SocialLinkForm } from '@/components/editor/forms/SocialLinkForm';
import { useEditMode } from '@/contexts/EditModeContext';
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
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isEditMode, canEdit } = useEditMode();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const isEditorMode = userRole === 'editor';

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <InlineEditText
            value={content?.welcome_message || defaultContent.welcome_message}
            onSave={(value) => updateMutation.mutate({ welcome_message: value })}
          >
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-6xl font-bold text-white relative welcome-glow">
                {content?.welcome_message || defaultContent.welcome_message}
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
            
            <InlineEditText
              value={content?.introduction || defaultContent.introduction}
              onSave={(value) => updateMutation.mutate({ introduction: value })}
              multiline
            >
              <p className="text-lg leading-relaxed opacity-90 text-white">
                {content?.introduction || defaultContent.introduction}
              </p>
            </InlineEditText>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1">
                <InlineEditImage
                  value={content?.profile_image_url}
                  onSave={(url) => updateMutation.mutate({ profile_image_url: url })}
                  bucket="profiles"
                >
                  <div className="w-full h-full rounded-full overflow-hidden" style={{ backgroundColor: themeColors.surface }}>
                    <img
                      src={content?.profile_image_url || "/placeholder.svg"}
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Links */}
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <p 
              className="text-3xl font-semibold text-white"
              style={{ color: themeColors.primary }}
            >
              Follow me or find me here
            </p>
            <div 
              className="absolute bottom-0 left-0 w-full h-1 rounded animate-pulse"
              style={{ 
                backgroundColor: themeColors.primary,
                boxShadow: `0 0 10px ${themeColors.primary}, 0 0 20px ${themeColors.primary}`
              }}
            />
          </div>
          
          <div className="flex justify-center gap-4 mb-4">
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
          
          {canEdit && (
            <AddContentButton onClick={() => setShowAddForm(true)}>
              Manage Social Links
            </AddContentButton>
          )}
        </div>
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
