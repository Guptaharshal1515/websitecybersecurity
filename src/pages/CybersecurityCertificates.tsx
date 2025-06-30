
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  type: string | null;
  display_order: number | null;
}

export const CybersecurityCertificates = () => {
  const { themeColors } = useTheme();

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates', 'cybersecurity'],
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

  // Add dummy data if no certificates exist
  const displayCertificates = certificates.length === 0 ? [
    {
      id: '1',
      title: 'Certified Ethical Hacker (CEH)',
      description: 'Comprehensive ethical hacking certification covering penetration testing methodologies.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      type: 'cybersecurity',
      display_order: 1
    },
    {
      id: '2',
      title: 'CompTIA Security+',
      description: 'Foundation-level cybersecurity certification covering security concepts and practices.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      type: 'cybersecurity',
      display_order: 2
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCertificates.map((cert) => (
            <Card 
              key={cert.id}
              className="border-0 hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg overflow-hidden" style={{ backgroundColor: themeColors.background }}>
                  <img
                    src={cert.image_url || '/placeholder.svg'}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: themeColors.text }}
                >
                  {cert.title}
                </h3>
                <p 
                  className="text-sm mb-4 leading-relaxed"
                  style={{ color: themeColors.accent }}
                >
                  {cert.description}
                </p>
                {cert.certificate_url && cert.certificate_url !== '#' && (
                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: themeColors.primary, color: 'white' }}
                  >
                    View Certificate
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
