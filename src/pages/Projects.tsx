
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Plus } from 'lucide-react';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { ProjectForm } from '@/components/editor/forms/ProjectForm';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
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
  completion_date: string | null;
}

export const Projects = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isEditMode, canEdit } = useEditMode();
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
      display_order: 1,
      completion_date: '2024-01-15'
    },
    {
      id: 'dummy-2',
      title: 'Blockchain Voting System',
      description: 'Decentralized voting application built on Ethereum with smart contract integration. Features voter authentication, transparent ballot counting, and immutable vote records.',
      image_url: '/placeholder.svg',
      project_url: 'https://example.com/blockchain-voting',
      github_url: 'https://github.com/guptaharshal/blockchain-voting',
      technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'MetaMask'],
      display_order: 2,
      completion_date: '2024-02-20'
    },
    {
      id: 'dummy-3',
      title: 'Penetration Testing Toolkit',
      description: 'Automated penetration testing toolkit for web application vulnerability assessment. Includes custom scripts for OWASP Top 10 testing and comprehensive reporting.',
      image_url: '/placeholder.svg',
      project_url: null,
      github_url: 'https://github.com/guptaharshal/pentest-toolkit',
      technologies: ['Python', 'Bash', 'Nmap', 'SQLMap', 'Burp Suite'],
      display_order: 3,
      completion_date: '2024-03-10'
    },
    {
      id: 'dummy-4',
      title: 'Cloud Infrastructure Monitor',
      description: 'Multi-cloud monitoring solution for AWS, Azure, and GCP. Real-time resource tracking, cost optimization alerts, and security compliance monitoring.',
      image_url: '/placeholder.svg',
      project_url: 'https://example.com/cloud-monitor',
      github_url: 'https://github.com/guptaharshal/cloud-monitor',
      technologies: ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker'],
      display_order: 4,
      completion_date: '2024-03-25'
    },
    {
      id: 'dummy-5',
      title: 'DeFi Portfolio Tracker',
      description: 'Comprehensive DeFi portfolio management tool with yield farming analytics, impermanent loss calculation, and cross-chain asset tracking.',
      image_url: '/placeholder.svg',
      project_url: 'https://example.com/defi-tracker',
      github_url: 'https://github.com/guptaharshal/defi-tracker',
      technologies: ['React', 'Web3', 'GraphQL', 'The Graph', 'Uniswap API'],
      display_order: 5,
      completion_date: '2024-04-05'
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

  const addProjectMutation = useMutation({
    mutationFn: async (newProject: any) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project added successfully!' });
      setShowAddForm(false);
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project deleted successfully!' });
      setSelectedProject(null);
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          
          {canEdit && (
            <AddContentButton onClick={() => setShowAddForm(true)}>
              Add Project
            </AddContentButton>
          )}
        </div>

        {/* Preview Pane Based Project Showcase */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Projects List */}
          <div className="space-y-4">
            {dummyProjects.map((project, index) => (
              <Card
                key={project.id}
                className={`border-0 cursor-pointer transition-all duration-300 hover:scale-105 relative ${
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
                <DeleteButton
                  onDelete={() => deleteProjectMutation.mutate(project.id)}
                  isVisible={isEditMode && canEdit}
                />
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
                      {project.completion_date && (
                        <p className="text-xs mt-1" style={{ color: themeColors.accent }}>
                          Completed: {formatDate(project.completion_date)}
                        </p>
                      )}
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
                  <InlineEditImage
                    value={selectedProject.image_url}
                    onSave={(url) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'image_url', value: url })}
                    bucket="projects"
                  >
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                      <img
                        src={selectedProject.image_url || '/placeholder.svg'}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </InlineEditImage>
                  
                  <InlineEditText
                    value={selectedProject.title}
                    onSave={(value) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'title', value })}
                  >
                    <h2 className="text-2xl font-bold mb-4 text-white">
                      {selectedProject.title}
                    </h2>
                  </InlineEditText>
                  
                  <InlineEditText
                    value={selectedProject.description || ''}
                    onSave={(value) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'description', value })}
                    multiline
                  >
                    <p className="text-base mb-6 leading-relaxed text-white">
                      {selectedProject.description}
                    </p>
                  </InlineEditText>

                  {selectedProject.completion_date && (
                    <p className="text-sm mb-4" style={{ color: themeColors.accent }}>
                      Completed: {formatDate(selectedProject.completion_date)}
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

      <ProjectForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={addProjectMutation.mutate}
      />

    </div>
  );
};
