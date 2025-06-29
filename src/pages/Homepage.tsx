
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Shield, Award, Briefcase, Mail, User, Twitter, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

export const Homepage = () => {
  const { themeColors } = useTheme();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const { data: homepageContent } = useQuery({
    queryKey: ['homepage-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
    setContactForm({ name: '', email: '', message: '' });
  };

  const animatedBlocks = [
    {
      title: 'Cybersecurity Certificates',
      icon: Shield,
      path: '/cybersecurity-certificates',
      description: 'Professional cybersecurity certifications and achievements'
    },
    {
      title: 'Blockchain Certificates',
      icon: () => (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded mr-1"></div>
          <div className="w-1 h-1 bg-current mx-1"></div>
          <div className="w-4 h-4 border-2 border-current rounded ml-1"></div>
        </div>
      ),
      path: '/blockchain-certificates',
      description: 'Blockchain technology certifications and expertise'
    },
    {
      title: 'Projects',
      icon: Briefcase,
      path: '/projects',
      description: 'Portfolio of cybersecurity and blockchain projects'
    }
  ];

  const socialIcons = [
    { name: 'github', icon: Github, url: homepageContent?.github_url, bgColor: themeColors.surface },
    { name: 'linkedin', icon: Linkedin, url: homepageContent?.linkedin_url, bgColor: '#0077b5' },
    { name: 'twitter', icon: Twitter, url: '#', bgColor: '#1da1f2' },
    { name: 'instagram', icon: Instagram, url: '#', bgColor: '#e1306c' },
    { name: 'facebook', icon: Facebook, url: '#', bgColor: '#1877f2' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {homepageContent?.profile_image_url && (
            <img
              src={homepageContent.profile_image_url}
              alt="Harshal Gupta"
              className="w-32 h-32 rounded-full mx-auto mb-8 border-4"
              style={{ borderColor: themeColors.primary }}
            />
          )}
          
          <h1 className="text-5xl font-bold mb-4" style={{ color: themeColors.text }}>
            <span className="underline decoration-2" style={{ textDecorationColor: themeColors.primary }}>
              Welcome to My Space
            </span>
          </h1>
          
          <h2 className="text-3xl font-semibold mb-8" style={{ color: themeColors.primary }}>
            Harshal Gupta
          </h2>

          {/* About Me Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6" style={{ color: themeColors.primary }}>
              About Me
            </h3>
            <p className="text-lg leading-relaxed" style={{ color: themeColors.text }}>
              Hey there! I'm Harshal, a passionate enthusiast in Cybersecurity, Blockchain, and FinTech. 
              I love exploring how technology secures the digital world — from ethical hacking to blockchain protocols. 
              With a sharp focus on Web3, digital forensics, and decentralized systems, I'm building skills to shape 
              the future of secure, transparent tech. This space is where I showcase my journey — from certifications 
              to real-world projects — all driven by curiosity and ambition. Let's dive into the world of secure 
              innovation together!
            </p>
          </div>

          {/* Social Media Section */}
          <div className="mb-12">
            <h4 className="text-lg font-semibold mb-6" style={{ color: themeColors.accent }}>
              Follow me or find me here
            </h4>
            <div className="flex justify-center gap-6">
              {socialIcons.map(({ name, icon: Icon, url, bgColor }) => (
                url && (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full transition-transform hover:scale-110"
                    style={{ backgroundColor: bgColor }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Blocks with Enhanced Effects */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {animatedBlocks.map(({ title, icon: Icon, path, description }, index) => (
            <Link key={path} to={path}>
              <Card 
                className="h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer animate-fade-in border-0 pixel-card glow-card"
                style={{ 
                  backgroundColor: themeColors.surface,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <CardContent className="p-8 text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: themeColors.primary + '20' }}
                  >
                    <Icon className="h-8 w-8" style={{ color: themeColors.primary }} />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-4"
                    style={{ color: themeColors.text }}
                  >
                    {title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: themeColors.accent }}
                  >
                    {description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Section with Glow Effect */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card 
            className="border-0 glow-card contact-glow"
            style={{ backgroundColor: themeColors.surface }}
          >
            <CardContent className="p-8">
              <h2 
                className="text-3xl font-bold mb-6 text-center"
                style={{ color: themeColors.primary }}
              >
                Contact Me
              </h2>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={5}
                    style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <style>{`
        .pixel-card {
          position: relative;
          overflow: hidden;
        }
        
        .glow-card {
          position: relative;
          overflow: hidden;
        }
        
        .glow-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent 30%, ${themeColors.primary}40 50%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: -1;
        }
        
        .glow-card:hover::before {
          opacity: 1;
          animation: glowMove 2s infinite linear;
        }
        
        .pixel-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, ${themeColors.primary}20, transparent);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        
        .pixel-card:hover::after {
          opacity: 1;
          animation: pixelMove 1.5s infinite ease-in-out;
        }
        
        .contact-glow:hover::before {
          animation: contactGlowMove 3s infinite linear;
        }
        
        @keyframes glowMove {
          0% { 
            background: linear-gradient(0deg, transparent 30%, ${themeColors.primary}40 50%, transparent 70%);
          }
          25% { 
            background: linear-gradient(90deg, transparent 30%, ${themeColors.primary}40 50%, transparent 70%);
          }
          50% { 
            background: linear-gradient(180deg, transparent 30%, ${themeColors.primary}40 50%, transparent 70%);
          }
          75% { 
            background: linear-gradient(270deg, transparent 30%, ${themeColors.primary}40 50%, transparent 70%);
          }
          100% { 
            background: linear-gradient(360deg, transparent 30%, ${themeColors.primary}40 50%, transparent 70%);
          }
        }
        
        @keyframes pixelMove {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes contactGlowMove {
          0% { 
            background: linear-gradient(0deg, transparent 20%, ${themeColors.primary}60 50%, transparent 80%);
          }
          25% { 
            background: linear-gradient(90deg, transparent 20%, ${themeColors.primary}60 50%, transparent 80%);
          }
          50% { 
            background: linear-gradient(180deg, transparent 20%, ${themeColors.primary}60 50%, transparent 80%);
          }
          75% { 
            background: linear-gradient(270deg, transparent 20%, ${themeColors.primary}60 50%, transparent 80%);
          }
          100% { 
            background: linear-gradient(360deg, transparent 20%, ${themeColors.primary}60 50%, transparent 80%);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
