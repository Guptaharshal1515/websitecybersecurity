
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Calendar, Award, X } from 'lucide-react';
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
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [visibleCards, setVisibleCards] = useState(new Set<number>());

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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('[data-certificate-card]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [certificates.length]);

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
    },
    {
      id: '4',
      title: 'OSCP Preparation',
      description: 'Offensive Security Certified Professional preparation course focusing on advanced penetration testing.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-04-05',
      display_order: 4
    }
  ] : certificates;

  if (dummyCertificates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 mx-auto mb-4" style={{ color: themeColors.primary }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Coming Soon
            </h2>
            <p style={{ color: themeColors.accent }}>
              Certificates will be displayed here once they are added.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <h1 
          className="text-4xl font-bold text-center mb-16"
          style={{ color: themeColors.primary }}
        >
          Cybersecurity Certificates
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {dummyCertificates.map((cert, index) => (
            <div
              key={cert.id}
              data-certificate-card
              data-index={index}
              className={`transform transition-all duration-700 ease-out ${
                visibleCards.has(index) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`
              }}
            >
              <Card 
                className="border-0 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group h-full"
                style={{ 
                  backgroundColor: themeColors.surface,
                  boxShadow: `0 4px 20px ${themeColors.primary}20`
                }}
                onClick={() => setSelectedCertificate(cert)}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-6 w-6 flex-shrink-0" style={{ color: themeColors.primary }} />
                    <h2 
                      className="text-xl font-bold line-clamp-2"
                      style={{ color: themeColors.text }}
                    >
                      {cert.title}
                    </h2>
                  </div>
                  
                  <div className="flex-1 mb-4">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <p 
                    className="text-sm mb-4 line-clamp-3"
                    style={{ color: themeColors.accent }}
                  >
                    {cert.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" style={{ color: themeColors.primary }} />
                      <span className="text-sm" style={{ color: themeColors.text }}>
                        {formatDate(cert.created_at)}
                      </span>
                    </div>
                    
                    {cert.certificate_url && cert.certificate_url !== '#' && (
                      <div
                        className="p-2 rounded-lg transition-colors"
                        style={{ backgroundColor: themeColors.primary + '20' }}
                      >
                        <ExternalLink className="h-4 w-4" style={{ color: themeColors.primary }} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div 
            className="max-w-4xl w-full max-h-[90vh] overflow-auto rounded-lg relative animate-scale-in"
            style={{ backgroundColor: themeColors.surface }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:opacity-80 z-10 transition-opacity"
              style={{ backgroundColor: themeColors.primary }}
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            <div className="p-8">
              <img
                src={selectedCertificate.image_url}
                alt={selectedCertificate.title}
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
