
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Certificate {
  id: string;
  title: string;
  description: string;
  image_url: string;
  certificate_url: string;
  created_at: string;
  display_order: number;
}

export const BlockchainCertificates = () => {
  const { themeColors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: certificates = [] } = useQuery({
    queryKey: ['blockchain-certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('type', 'blockchain')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Certificate[];
    },
  });

  // Add dummy certificates if none exist
  const dummyCertificates = certificates.length === 0 ? [
    {
      id: '1',
      title: 'Blockchain Fundamentals',
      description: 'Comprehensive understanding of blockchain technology, consensus mechanisms, and decentralized systems.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-01-20',
      display_order: 1
    },
    {
      id: '2',
      title: 'Ethereum Smart Contracts',
      description: 'Advanced Solidity programming and smart contract development on Ethereum blockchain.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-02-15',
      display_order: 2
    },
    {
      id: '3',
      title: 'DeFi Protocol Development',
      description: 'Building decentralized finance applications and understanding DeFi ecosystem protocols.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-03-05',
      display_order: 3
    },
    {
      id: '4',
      title: 'Web3 Development',
      description: 'Full-stack Web3 application development using modern blockchain technologies.',
      image_url: '/placeholder.svg',
      certificate_url: '#',
      created_at: '2024-03-25',
      display_order: 4
    }
  ] : certificates;

  const nextCertificate = () => {
    setCurrentIndex((prev) => (prev + 1) % dummyCertificates.length);
  };

  const prevCertificate = () => {
    setCurrentIndex((prev) => (prev - 1 + dummyCertificates.length) % dummyCertificates.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPositionStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalCerts = dummyCertificates.length;
    
    // Normalize difference to handle circular array
    const normalizedDiff = ((diff + totalCerts) % totalCerts);
    const adjustedDiff = normalizedDiff > totalCerts / 2 ? normalizedDiff - totalCerts : normalizedDiff;
    
    const angle = (adjustedDiff * 60) * (Math.PI / 180); // 60 degrees between each cert
    const radius = 200;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    
    const scale = adjustedDiff === 0 ? 1 : Math.max(0.6, 1 - Math.abs(adjustedDiff) * 0.2);
    const opacity = adjustedDiff === 0 ? 1 : Math.max(0.4, 1 - Math.abs(adjustedDiff) * 0.3);
    
    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
      opacity,
      zIndex: adjustedDiff === 0 ? 10 : 5 - Math.abs(adjustedDiff)
    };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <h1 
          className="text-4xl font-bold text-center mb-16"
          style={{ color: themeColors.primary }}
        >
          Blockchain Certificates
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Certificate Details Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <Card 
              className="border-0"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-6">
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: themeColors.text }}
                >
                  {dummyCertificates[currentIndex]?.title}
                </h2>
                
                <p 
                  className="text-base mb-4"
                  style={{ color: themeColors.accent }}
                >
                  {dummyCertificates[currentIndex]?.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4" style={{ color: themeColors.primary }} />
                  <span style={{ color: themeColors.text }}>
                    {formatDate(dummyCertificates[currentIndex]?.created_at)}
                  </span>
                </div>
                
                {dummyCertificates[currentIndex]?.certificate_url && 
                 dummyCertificates[currentIndex]?.certificate_url !== '#' && (
                  <Button
                    asChild
                    className="w-full"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <a
                      href={dummyCertificates[currentIndex].certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Certificate
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 3D Circular Arc Display */}
          <div className="lg:w-2/3 flex flex-col items-center">
            <div 
              className="relative"
              style={{ 
                height: '400px', 
                width: '600px',
                perspective: '1000px'
              }}
            >
              {dummyCertificates.map((cert, index) => (
                <div
                  key={cert.id}
                  className="absolute top-1/2 left-1/2 transition-all duration-700 ease-out cursor-pointer"
                  style={{
                    ...getPositionStyle(index),
                    transformOrigin: 'center center',
                    marginLeft: '-100px',
                    marginTop: '-75px'
                  }}
                  onClick={() => setCurrentIndex(index)}
                >
                  <Card 
                    className="w-48 h-32 border-0 hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: themeColors.surface }}
                  >
                    <CardContent className="p-4 h-full flex flex-col justify-center items-center text-center">
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        className="w-12 h-12 mb-2 rounded"
                      />
                      <h3 
                        className="text-sm font-semibold truncate w-full"
                        style={{ color: themeColors.text }}
                      >
                        {cert.title}
                      </h3>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={prevCertificate}
                variant="outline"
                size="lg"
                style={{ borderColor: themeColors.primary, color: themeColors.primary }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={nextCertificate}
                variant="outline"
                size="lg"
                style={{ borderColor: themeColors.primary, color: themeColors.primary }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="flex gap-2 mt-4">
              {dummyCertificates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'scale-125' : 'scale-100 opacity-50'
                  }`}
                  style={{ backgroundColor: themeColors.primary }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
