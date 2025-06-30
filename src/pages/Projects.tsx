
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
          <h1 
            className="text-4xl font-bold"
            style={{ color: themeColors.primary }}
          >
            My Projects
          </h1>
          
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="border-0 hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: themeColors.surface }}
            >
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <EditableImage
                    src={project.image_url}
                    alt={project.title}
                    onSave={(url) => handleImageSave(project.id, url)}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <EditableText
                  value={project.title}
                  onSave={(value) => updateProjectMutation.mutate({ id: project.id, field: 'title', value })}
                  className="text-xl font-semibold mb-2"
                  placeholder="Project title"
                />
                
                <EditableText
                  value={project.description || ''}
                  onSave={(value) => updateProjectMutation.mutate({ id: project.id, field: 'description', value })}
                  multiline={true}
                  className="text-sm mb-4 leading-relaxed"
                  placeholder="Project description"
                />
                
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
                  {project.project_url && (
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
                  {project.github_url && (
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
