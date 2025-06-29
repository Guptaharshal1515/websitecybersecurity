
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, Code, Folder, FileText } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  technologies: string[];
  created_at: string;
  display_order: number;
}

export const Projects = () => {
  const { themeColors } = useTheme();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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

  // Add dummy projects if none exist
  const dummyProjects = projects.length === 0 ? [
    {
      id: '1',
      title: 'Decentralized Voting System',
      description: 'A blockchain-based voting application ensuring transparency and security in democratic processes. Built with Solidity smart contracts and React frontend.',
      image_url: '/placeholder.svg',
      project_url: 'https://voting-dapp.example.com',
      github_url: 'https://github.com/username/voting-system',
      technologies: ['Solidity', 'React', 'Web3.js', 'Ethereum'],
      created_at: '2024-01-15',
      display_order: 1
    },
    {
      id: '2',
      title: 'Cybersecurity Dashboard',
      description: 'Real-time security monitoring dashboard with threat detection and incident response capabilities. Features automated vulnerability scanning.',
      image_url: '/placeholder.svg',
      project_url: 'https://security-dashboard.example.com',
      github_url: 'https://github.com/username/security-dashboard',
      technologies: ['Python', 'Django', 'React', 'PostgreSQL'],
      created_at: '2024-02-20',
      display_order: 2
    },
    {
      id: '3',
      title: 'DeFi Yield Optimizer',
      description: 'Automated yield farming strategy optimizer that maximizes returns across different DeFi protocols while minimizing risks.',
      image_url: '/placeholder.svg',
      project_url: 'https://defi-optimizer.example.com',
      github_url: 'https://github.com/username/defi-optimizer',
      technologies: ['Solidity', 'Node.js', 'React', 'Web3'],
      created_at: '2024-03-10',
      display_order: 3
    },
    {
      id: '4',
      title: 'Network Penetration Tool',
      description: 'Automated penetration testing framework for network security assessment. Includes vulnerability discovery and reporting features.',
      image_url: '/placeholder.svg',
      project_url: 'https://pentest-tool.example.com',
      github_url: 'https://github.com/username/pentest-tool',
      technologies: ['Python', 'Nmap', 'Metasploit', 'Bash'],
      created_at: '2024-03-25',
      display_order: 4
    }
  ] : projects;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectedProjectData = selectedProject 
    ? dummyProjects.find(p => p.id === selectedProject)
    : dummyProjects[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-8">
        <h1 
          className="text-4xl font-bold text-center mb-8"
          style={{ color: themeColors.primary }}
        >
          Projects
        </h1>

        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Project List */}
          <div className="w-1/3">
            <Card 
              className="h-full border-0"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-4 h-full">
                <h2 
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: themeColors.text }}
                >
                  <Folder className="h-5 w-5" />
                  Project Explorer
                </h2>
                
                <div className="space-y-2">
                  {dummyProjects.map((project, index) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                        (selectedProject || dummyProjects[0].id) === project.id
                          ? 'shadow-md'
                          : 'hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: (selectedProject || dummyProjects[0].id) === project.id
                          ? themeColors.primary + '20'
                          : themeColors.background,
                        borderLeft: (selectedProject || dummyProjects[0].id) === project.id
                          ? `3px solid ${themeColors.primary}`
                          : '3px solid transparent'
                      }}
                    >
                      <FileText className="h-4 w-4" style={{ color: themeColors.primary }} />
                      <div>
                        <p 
                          className="font-medium text-sm"
                          style={{ color: themeColors.text }}
                        >
                          {project.title}
                        </p>
                        <p 
                          className="text-xs"
                          style={{ color: themeColors.accent }}
                        >
                          {formatDate(project.created_at)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Project Preview */}
          <div className="w-2/3">
            <Card 
              className="h-full border-0"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-6 h-full overflow-y-auto">
                {selectedProjectData && (
                  <div className="space-y-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 
                          className="text-2xl font-bold mb-2"
                          style={{ color: themeColors.text }}
                        >
                          {selectedProjectData.title}
                        </h2>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" style={{ color: themeColors.primary }} />
                          <span style={{ color: themeColors.accent }}>
                            Completed: {formatDate(selectedProjectData.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Image */}
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={selectedProjectData.image_url}
                        alt={selectedProjectData.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-3"
                        style={{ color: themeColors.primary }}
                      >
                        Description
                      </h3>
                      <p 
                        className="leading-relaxed"
                        style={{ color: themeColors.text }}
                      >
                        {selectedProjectData.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-3 flex items-center gap-2"
                        style={{ color: themeColors.primary }}
                      >
                        <Code className="h-5 w-5" />
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProjectData.technologies?.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: themeColors.primary + '20',
                              color: themeColors.primary
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Links */}
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-3"
                        style={{ color: themeColors.primary }}
                      >
                        Project Links
                      </h3>
                      <div className="flex flex-col gap-3">
                        {selectedProjectData.project_url && selectedProjectData.project_url !== '#' && (
                          <Button
                            asChild
                            className="w-full justify-start"
                            style={{ backgroundColor: themeColors.primary }}
                          >
                            <a
                              href={selectedProjectData.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Live Project
                            </a>
                          </Button>
                        )}
                        
                        {selectedProjectData.github_url && selectedProjectData.github_url !== '#' && (
                          <Button
                            variant="outline"
                            asChild
                            className="w-full justify-start"
                            style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                          >
                            <a
                              href={selectedProjectData.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4 mr-2" />
                              View Source Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
