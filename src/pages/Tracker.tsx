
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Calendar } from 'lucide-react';

interface TrackerEntry {
  id: string;
  title: string;
  type: string;
  proof_link: string | null;
  completion_date: string | null;
  is_completed: boolean | null;
  created_at: string | null;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'certificate':
      return '📜';
    case 'hands-on':
      return '🧪';
    case 'course':
      return '📚';
    default:
      return '📄';
  }
};

export const Tracker = () => {
  const { themeColors } = useTheme();

  const { data: trackerEntries = [] } = useQuery({
    queryKey: ['tracker-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracker_entries')
        .select('*')
        .order('completion_date', { ascending: false });
      if (error) throw error;
      return data as TrackerEntry[];
    },
  });

  // Add dummy data if no entries exist
  const dummyEntries = trackerEntries.length === 0 ? [
    {
      id: '1',
      title: 'Certified Ethical Hacker (CEH)',
      type: 'certificate',
      proof_link: '#',
      completion_date: '2024-01-15',
      is_completed: true,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'CompTIA Security+',
      type: 'certificate',
      proof_link: '#',
      completion_date: '2024-02-20',
      is_completed: true,
      created_at: '2024-02-20'
    },
    {
      id: '3',
      title: 'Blockchain Fundamentals',
      type: 'course',
      proof_link: '#',
      completion_date: '2024-03-10',
      is_completed: true,
      created_at: '2024-03-10'
    },
    {
      id: '4',
      title: 'Python Penetration Testing',
      type: 'hands-on',
      proof_link: null,
      completion_date: '2024-03-25',
      is_completed: true,
      created_at: '2024-03-25'
    }
  ] : trackerEntries;

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
          Skills & Achievements Tracker
        </h1>

        <div className="max-w-4xl mx-auto space-y-4">
          {dummyEntries.map((entry) => (
            <Card 
              key={entry.id}
              className="border-0 hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getTypeIcon(entry.type)}</span>
                    <div>
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: themeColors.text }}
                      >
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" style={{ color: themeColors.primary }} />
                        <span 
                          className="text-sm"
                          style={{ color: themeColors.accent }}
                        >
                          {entry.completion_date ? formatDate(entry.completion_date) : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                      style={{
                        backgroundColor: themeColors.primary + '20',
                        color: themeColors.primary
                      }}
                    >
                      {entry.type}
                    </span>
                    {entry.proof_link && entry.proof_link !== '#' && (
                      <a
                        href={entry.proof_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        <ExternalLink className="h-4 w-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
