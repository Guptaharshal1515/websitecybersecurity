
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[] | null;
  display_order: number | null;
}

export const Projects = () => {
  const { themeColors } = useTheme();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });

  // Add dummy data if no projects exist
  const displayProjects = projects.length === 0 ? [
    {
      id: '1',
      title: 'Secure Password Manager',
      description: 'A full-stack password manager with end-to-end encryption and multi-factor authentication.',
      image_url: '/placeholder.svg',
      project_url: '#',
      github_url: '#',
      technologies: ['React', 'Node.js', 'MongoDB', 'Encryption'],
      display_order: 1
    },
    {
      id: '2',
      title: 'Blockchain Voting System',
      description: 'Decentralized voting application built on Ethereum with smart contracts for transparency.',
      image_url: '/placeholder.svg',
      project_url: '#',
      github_url: '#',
      technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
      display_order: 2
    }
  ] : projects;

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <h1 
          className="text-4xl font-bold text-center mb-16"
          style={{ color: themeColors.primary }}
        >
          My Projects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <Card 
              key={project.id}
              className="border-0 hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg overflow-hidden" style={{ backgroundColor: themeColors.background }}>
                  <img
                    src={project.image_url || '/placeholder.svg'}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: themeColors.text }}
                >
                  {project.title}
                </h3>
                <p 
                  className="text-sm mb-4 leading-relaxed"
                  style={{ color: themeColors.accent }}
                >
                  {project.description}
                </p>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: themeColors.primary + '20',
                          color: themeColors.primary
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {project.project_url && project.project_url !== '#' && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity flex-1 justify-center"
                      style={{ backgroundColor: themeColors.primary, color: 'white' }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                  {project.github_url && project.github_url !== '#' && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ 
                        backgroundColor: 'transparent', 
                        border: `1px solid ${themeColors.primary}`,
                        color: themeColors.primary 
                      }}
                    >
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
