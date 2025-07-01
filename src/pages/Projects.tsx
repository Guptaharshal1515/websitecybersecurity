
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Plus } from 'lucide-react';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { useToast } from '@/hooks/use-toast';

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
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
      id: 'dummy-1',
      title: 'Cybersecurity Dashboard',
      description: 'Real-time security monitoring dashboard with threat detection and incident response capabilities. Built with React and Node.js, featuring live threat feeds, vulnerability scanning, and automated alerting systems.',
      image_url: '/placeholder.svg',
      project_url: 'https://example.com/cybersec-dashboard',
      github_url: 'https://github.com/guptaharshal/cybersec-dashboard',
      technologies: ['React', 'Node.js', 'Python', 'MongoDB', 'Socket.io'],
      display_order: 1
    },
    {
      id: 'dummy-2',
      title: 'Blockchain Voting System',
      description: 'Decentralized voting application built on Ethereum with smart contract integration. Features voter authentication, transparent ballot counting, and immutable vote records.',
      image_url: '/placeholder.svg',
      project_url: 'https://example.com/blockchain-voting',
      github_url: 'https://github.com/guptaharshal/blockchain-voting',
      technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'MetaMask'],
      display_order: 2
    },
    {
      id: 'dummy-3',
      title: 'Penetration Testing Toolkit',
      description: 'Automated penetration testing toolkit for web application vulnerability assessment. Includes custom scripts for OWASP Top 10 testing and comprehensive reporting.',
      image_url: '/placeholder.svg',
      project_url: null,
      github_url: 'https://github.com/guptaharshal/pentest-toolkit',
      technologies: ['Python', 'Bash', 'Nmap', 'SQLMap', 'Burp Suite'],
      display_order: 3
    },
    {
      id: 'dummy-4',
      title: 'Cloud Infrastructure Monitor',
      description: 'Multi-cloud monitoring solution for AWS, Azure, and GCP. Real-time resource tracking, cost optimization alerts, and security compliance monitoring.',
      image_url: '/placeholder.svg',
      project_url: 'https://example.com/cloud-monitor',
      github_url: 'https://github.com/guptaharshal/cloud-monitor',
      technologies: ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker'],
      display_order: 4
    },
    {
      id: 'dummy-5',
      title: 'DeFi Portfolio Tracker',
      description: 'Comprehensive DeFi portfolio management tool with yield farming analytics, impermanent loss calculation, and cross-chain asset tracking.',
      image_url: '/placeholder.svg',
      project_url: 'https://example.com/defi-tracker',
      github_url: 'https://github.com/guptaharshal/defi-tracker',
      technologies: ['React', 'Web3', 'GraphQL', 'The Graph', 'Uniswap API'],
      display_order: 5
    }
  ] : projects;

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: string | string[] }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ [field]: value })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project updated successfully!' });
    }
  });

  const handleImageSave = async (id: string, url: string | null) => {
    updateProjectMutation.mutate({ id, field: 'image_url', value: url || '' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <div className="relative">
            <h1 
              className="text-4xl font-bold text-white"
            >
              My Projects
            </h1>
            <div 
              className="absolute bottom-0 left-0 w-full h-1 rounded mt-2"
              style={{ 
                backgroundColor: themeColors.primary,
                boxShadow: `0 0 10px ${themeColors.primary}`
              }}
            />
          </div>
          
          {userRole === 'admin' && (
            <Button
              onClick={() => setShowAddForm(true)}
              style={{ backgroundColor: themeColors.primary }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>

        {/* Preview Pane Based Project Showcase */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Projects List */}
          <div className="space-y-4">
            {dummyProjects.map((project, index) => (
              <Card
                key={project.id}
                className={`border-0 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedProject?.id === project.id ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: themeColors.surface,
                  ...(selectedProject?.id === project.id && {
                    '--tw-ring-color': themeColors.primary,
                    borderColor: themeColors.primary
                  } as any)
                }}
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={project.image_url || '/placeholder.svg'}
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Preview Pane */}
          <div className="sticky top-8">
            {selectedProject ? (
              <Card 
                className="border-0"
                style={{ backgroundColor: themeColors.surface }}
              >
                <CardContent className="p-6">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    {userRole === 'admin' ? (
                      <EditableImage
                        src={selectedProject.image_url}
                        alt={selectedProject.title}
                        onSave={(url) => handleImageSave(selectedProject.id, url)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={selectedProject.image_url || '/placeholder.svg'}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {userRole === 'admin' ? (
                    <EditableText
                      value={selectedProject.title}
                      onSave={(value) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'title', value })}
                      className="text-2xl font-bold mb-4 text-white"
                      placeholder="Project title"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold mb-4 text-white">
                      {selectedProject.title}
                    </h2>
                  )}
                  
                  {userRole === 'admin' ? (
                    <EditableText
                      value={selectedProject.description || ''}
                      onSave={(value) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'description', value })}
                      multiline={true}
                      className="text-base mb-6 leading-relaxed text-white"
                      placeholder="Project description"
                    />
                  ) : (
                    <p className="text-base mb-6 leading-relaxed text-white">
                      {selectedProject.description}
                    </p>
                  )}
                  
                  {selectedProject.technologies && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full"
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

                  <div className="flex gap-4">
                    {selectedProject.project_url && (
                      <Button
                        asChild
                        className="flex-1"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        <a
                          href={selectedProject.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {selectedProject.github_url && (
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                        style={{ 
                          borderColor: themeColors.primary,
                          color: themeColors.primary 
                        }}
                      >
                        <a
                          href={selectedProject.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card 
                className="border-0 h-96 flex items-center justify-center"
                style={{ backgroundColor: themeColors.surface }}
              >
                <p className="text-gray-400 text-lg">
                  Select a project to view details
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
