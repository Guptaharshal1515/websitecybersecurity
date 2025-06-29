
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface JourneyEntry {
  id: string;
  title: string;
  description: string | null;
  entry_date: string;
  display_order: number | null;
  created_at: string | null;
}

export const Journey = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();

  // Only redirect if user is not logged in or is specifically a viewer
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Restricted
            </h2>
            <p style={{ color: themeColors.accent }}>
              Please log in to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Restricted
            </h2>
            <p style={{ color: themeColors.accent }}>
              This page is only available to customers and administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: journeyEntries = [] } = useQuery({
    queryKey: ['journey-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journey_entries')
        .select('*')
        .order('entry_date', { ascending: false });
      if (error) throw error;
      return data as JourneyEntry[];
    },
  });

  // Add dummy data if no entries exist
  const dummyEntries = journeyEntries.length === 0 ? [
    {
      id: '1',
      title: 'Started Bachelor\'s in Computer Science',
      description: 'Beginning my journey into the world of cybersecurity and technology.',
      entry_date: '2024-01-15',
      display_order: 1,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'First Cybersecurity Certification',
      description: 'Completed my first ethical hacking certification, marking a major milestone.',
      entry_date: '2024-02-20',
      display_order: 2,
      created_at: '2024-02-20'
    },
    {
      id: '3',
      title: 'Blockchain Development Deep Dive',
      description: 'Started learning Solidity and smart contract development.',
      entry_date: '2024-03-10',
      display_order: 3,
      created_at: '2024-03-10'
    },
    {
      id: '4',
      title: 'First Security Hackathon',
      description: 'Participated in my first cybersecurity hackathon, learned a lot about real-world applications.',
      entry_date: '2024-03-25',
      display_order: 4,
      created_at: '2024-03-25'
    }
  ] : journeyEntries;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <h1 
          className="text-4xl font-bold text-center mb-16"
          style={{ color: themeColors.primary }}
        >
          My Journey
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div 
              className="absolute left-8 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: themeColors.primary }}
            />
            
            <div className="space-y-8">
              {dummyEntries.map((entry, index) => (
                <div key={entry.id} className="relative flex items-start gap-8">
                  {/* Timeline dot */}
                  <div 
                    className="w-4 h-4 rounded-full border-4 flex-shrink-0 mt-2"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.background 
                    }}
                  />
                  
                  {/* Date */}
                  <div className="w-32 flex-shrink-0 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Calendar className="h-4 w-4" style={{ color: themeColors.primary }} />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: themeColors.text }}
                      >
                        {formatDate(entry.entry_date)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card 
                      className="border-0"
                      style={{ backgroundColor: themeColors.surface }}
                    >
                      <CardContent className="p-6">
                        <h3 
                          className="text-lg font-semibold mb-2"
                          style={{ color: themeColors.text }}
                        >
                          {entry.title}
                        </h3>
                        {entry.description && (
                          <p 
                            className="text-sm leading-relaxed"
                            style={{ color: themeColors.accent }}
                          >
                            {entry.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
