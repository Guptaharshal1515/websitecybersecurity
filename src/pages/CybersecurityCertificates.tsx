
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Calendar, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Certificate {
  id: string;
  title: string;
  description: string;
  image_url: string;
  certificate_url: string;
  created_at: string;
  display_order: number;
}

export const CybersecurityCertificates = () => {
  const { themeColors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: certificates = [] } = useQuery({
    queryKey: ['cybersecurity-certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('type', 'cybersecurity')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Certificate[];
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newIndex = Math.floor(scrollPosition / (windowHeight * 0.8));
      if (newIndex !== currentIndex && newIndex < certificates.length) {
        setCurrentIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex, certificates.length]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add dummy certificates if none exist
  const dummyCertificates = certificates.length === 0 ? [
    {
      id: '1',
      title: 'Certified Ethical Hacker (CEH)',
      description: 'EC-Council certified ethical hacking certification focusing on penetration testing and vulnerability assessment.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-01-15',
      display_order: 1
    },
    {
      id: '2',
      title: 'CompTIA Security+',
      description: 'Industry-standard certification covering network security, compliance, and operational security.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-02-20',
      display_order: 2
    },
    {
      id: '3',
      title: 'CISSP Associate',
      description: 'Information security professional certification covering security and risk management.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-03-10',
      display_order: 3
    }
  ] : certificates;

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <h1 
          className="text-4xl font-bold text-center mb-16"
          style={{ color: themeColors.primary }}
        >
          Cybersecurity Certificates
        </h1>

        <div className="space-y-8">
          {dummyCertificates.map((cert, index) => (
            <div
              key={cert.id}
              className={`transition-all duration-500 ${
                index === currentIndex 
                  ? 'scale-100 opacity-100' 
                  : index === currentIndex - 1 || index === currentIndex + 1
                  ? 'scale-95 opacity-60 blur-sm'
                  : 'scale-90 opacity-30 blur-md'
              }`}
              style={{ 
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Card 
                className="w-full max-w-4xl border-0"
                style={{ backgroundColor: themeColors.surface }}
              >
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8" style={{ color: themeColors.primary }} />
                        <h2 
                          className="text-2xl font-bold"
                          style={{ color: themeColors.text }}
                        >
                          {cert.title}
                        </h2>
                      </div>
                      
                      <p 
                        className="text-lg"
                        style={{ color: themeColors.accent }}
                      >
                        {cert.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <span style={{ color: themeColors.text }}>
                          Completed: {formatDate(cert.created_at)}
                        </span>
                      </div>
                      
                      {cert.certificate_url && cert.certificate_url !== '#' && (
                        <a
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                          style={{ 
                            backgroundColor: themeColors.primary,
                            color: 'white'
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Certificate
                        </a>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        className="max-w-full h-auto rounded-lg shadow-lg"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
