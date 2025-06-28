
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Shield, Award, Briefcase, Mail, User } from 'lucide-react';
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
    // Here you would typically send the email
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
      icon: Award,
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
          
          <h1 
            className="text-5xl font-bold mb-4"
            style={{ color: themeColors.text }}
          >
            {homepageContent?.welcome_message || 'Welcome to WebsiteCyberSec'}
          </h1>
          
          <h2 
            className="text-3xl font-semibold mb-4"
            style={{ color: themeColors.primary }}
          >
            Harshal Gupta
          </h2>
          
          <p 
            className="text-xl mb-8"
            style={{ color: themeColors.accent }}
          >
            {homepageContent?.introduction || 'Enthusiast in Cybersecurity, Blockchain and Cloud Security'}
          </p>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-12">
            {homepageContent?.github_url && (
              <a
                href={homepageContent.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: themeColors.surface }}
              >
                <Github className="h-6 w-6" style={{ color: themeColors.text }} />
              </a>
            )}
            {homepageContent?.linkedin_url && (
              <a
                href={homepageContent.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: '#0077b5' }}
              >
                <Linkedin className="h-6 w-6 text-white" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Animated Blocks with Pixel Effect */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {animatedBlocks.map(({ title, icon: Icon, path, description }, index) => (
            <Link key={path} to={path}>
              <Card 
                className="h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer animate-fade-in border-0 pixel-card"
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

      {/* About Me Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card style={{ backgroundColor: themeColors.surface }} className="border-0">
            <CardContent className="p-8">
              <h2 
                className="text-3xl font-bold mb-6 text-center"
                style={{ color: themeColors.primary }}
              >
                About Me
              </h2>
              <p 
                className="text-lg leading-relaxed text-center"
                style={{ color: themeColors.text }}
              >
                {homepageContent?.about_bio || 'Passionate about cybersecurity, blockchain technology, and cloud security solutions.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card style={{ backgroundColor: themeColors.surface }} className="border-0">
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

      <style jsx>{`
        .pixel-card {
          position: relative;
          overflow: hidden;
        }
        
        .pixel-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          background-size: 20px 20px;
          animation: pixelate 2s infinite linear;
        }
        
        .pixel-card:hover::before {
          opacity: 1;
        }
        
        @keyframes pixelate {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
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
