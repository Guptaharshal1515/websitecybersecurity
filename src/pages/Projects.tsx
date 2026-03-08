import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Briefcase } from 'lucide-react';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { ProjectForm } from '@/components/editor/forms/ProjectForm';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { PageTransition } from '@/components/layout/PageTransition';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: string | string[] }) => {
      const { data, error } = await supabase.from('projects').update({ [field]: value }).eq('id', id).select().single();
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
      const { data, error } = await supabase.from('projects').insert([newProject]).select().single();
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
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project deleted successfully!' });
      setSelectedProject(null);
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          <PageHeader
            title="Projects"
            subtitle="Hands-on projects in cybersecurity, blockchain, and cloud infrastructure."
            actions={
              canEdit ? (
                <AddContentButton onClick={() => setShowAddForm(true)}>Add Project</AddContentButton>
              ) : undefined
            }
          />

          {projects.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No projects yet</p>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 pb-16">
              {/* Projects List */}
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Card
                      className={`glass-card cursor-pointer transition-all duration-300 hover:scale-[1.02] relative ${
                        selectedProject?.id === project.id ? 'ring-2 ring-primary glow-primary' : 'hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <DeleteButton onDelete={() => deleteProjectMutation.mutate(project.id)} isVisible={isEditMode && canEdit} />
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img src={project.image_url || '/placeholder.svg'} alt={project.title} className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{project.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            {project.completion_date && (
                              <p className="text-xs mt-1 text-accent font-mono">Completed: {formatDate(project.completion_date)}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Preview Pane */}
              <div className="lg:sticky lg:top-24 h-fit">
                {selectedProject ? (
                  <motion.div key={selectedProject.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-card glow-primary">
                      <CardContent className="p-6">
                        <InlineEditImage
                          value={selectedProject.image_url}
                          onSave={(url) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'image_url', value: url })}
                          bucket="projects"
                        >
                          <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-secondary">
                            <img src={selectedProject.image_url || '/placeholder.svg'} alt={selectedProject.title} className="w-full h-full object-cover" />
                          </div>
                        </InlineEditImage>

                        <InlineEditText value={selectedProject.title} onSave={(value) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'title', value })}>
                          <h2 className="text-2xl font-bold mb-4 text-foreground">{selectedProject.title}</h2>
                        </InlineEditText>

                        <InlineEditText value={selectedProject.description || ''} onSave={(value) => updateProjectMutation.mutate({ id: selectedProject.id, field: 'description', value })} multiline>
                          <p className="text-muted-foreground mb-6 leading-relaxed">{selectedProject.description}</p>
                        </InlineEditText>

                        {selectedProject.completion_date && (
                          <p className="text-sm mb-4 text-accent font-mono">Completed: {formatDate(selectedProject.completion_date)}</p>
                        )}

                        {selectedProject.technologies && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {selectedProject.technologies.map((tech, i) => (
                              <span key={i} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{tech}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-4">
                          {selectedProject.project_url && (
                            <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                              <a href={selectedProject.project_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                              </a>
                            </Button>
                          )}
                          {selectedProject.github_url && (
                            <Button asChild variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                              <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-2" /> Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="glass-card h-96 flex items-center justify-center">
                    <p className="text-muted-foreground text-lg">Select a project to view details</p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        <ProjectForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} onSubmit={addProjectMutation.mutate} />
      </div>
    </PageTransition>
  );
};
