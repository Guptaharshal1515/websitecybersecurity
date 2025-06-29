
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Edit, Trash2, Save, X, Tag } from 'lucide-react';

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

export const ProjectManager = () => {
  const { themeColors } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: '',
    display_order: 1
  });

  const handleSubmit = () => {
    const techArray = formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean);
    
    if (editingId) {
      // Update existing project
      setProjects(prev => prev.map(project => 
        project.id === editingId 
          ? { ...project, ...formData, technologies: techArray }
          : project
      ));
    } else {
      // Add new project
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
        technologies: techArray,
        created_at: new Date().toISOString()
      };
      setProjects(prev => [...prev, newProject]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      project_url: '',
      github_url: '',
      technologies: '',
      display_order: 1
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      project_url: project.project_url,
      github_url: project.github_url,
      technologies: project.technologies.join(', '),
      display_order: project.display_order
    });
    setEditingId(project.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 
          className="text-2xl font-bold"
          style={{ color: themeColors.text }}
        >
          Projects
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: themeColors.primary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card style={{ backgroundColor: themeColors.surface }}>
          <CardHeader>
            <CardTitle style={{ color: themeColors.text }}>
              {editingId ? 'Edit Project' : 'Add New Project'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            />
            <Input
              placeholder="Project URL"
              value={formData.project_url}
              onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
            />
            <Input
              placeholder="GitHub URL"
              value={formData.github_url}
              onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
            />
            <Input
              placeholder="Technologies (comma separated)"
              value={formData.technologies}
              onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
            />
            <div className="flex gap-2">
              <Button onClick={handleSubmit} style={{ backgroundColor: themeColors.primary }}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} style={{ backgroundColor: themeColors.surface }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold mb-2" style={{ color: themeColors.text }}>
                    {project.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: themeColors.accent }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: themeColors.primary + '20',
                          color: themeColors.primary
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs" style={{ color: themeColors.accent }}>
                    Order: {project.display_order}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
