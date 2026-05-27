'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, X } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { AlertDialog } from '../ui/Dialog';

interface Project {
  _id: string;
  title: string;
  description: string;
  label: string;
  image: string;
  deploymentLink: string;
  accent: string;
  createdAt: string;
  createdBy?: {
    email: string;
  };
}

export function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; projectId: string | null }>({
    open: false,
    projectId: null
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    label: '',
    image: '',
    deploymentLink: '',
    accent: '#C8973D'
  });

  // Load projects from API on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectsAPI.getProjects();
      if (response.success) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingProject) {
        // Update existing project
        const response = await projectsAPI.updateProject(editingProject._id, formData);
        if (response.success) {
          setProjects(projects.map(p => 
            p._id === editingProject._id ? response.project : p
          ));
          setEditingProject(null);
          toast.success('Project updated successfully!');
        }
      } else {
        // Create new project
        const response = await projectsAPI.createProject(formData);
        if (response.success) {
          setProjects([response.project, ...projects]);
          toast.success('Project created successfully!');
        }
      }
      
      resetForm();
    } catch (error: any) {
      console.error('Failed to save project:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save project';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      label: '',
      image: '',
      deploymentLink: '',
      accent: '#C8973D'
    });
    setShowCreateForm(false);
    setEditingProject(null);
    setError('');
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      label: project.label,
      image: project.image,
      deploymentLink: project.deploymentLink,
      accent: project.accent
    });
    setEditingProject(project);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteDialog({ open: true, projectId: id });
  };

  const confirmDeleteProject = async () => {
    if (!deleteDialog.projectId) return;
    
    try {
      const response = await projectsAPI.deleteProject(deleteDialog.projectId);
      if (response.success) {
        setProjects(projects.filter(p => p._id !== deleteDialog.projectId));
        toast.success('Project deleted successfully!');
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete project';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--card)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'var(--card)',
            },
          },
        }}
      />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Manage Projects</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          Add New Project
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Create/Edit Project Form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-foreground">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter project title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Label/Category
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., Web Design, Brand Identity"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter project description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Deployment Link
                </label>
                <input
                  type="url"
                  required
                  value={formData.deploymentLink}
                  onChange={(e) => setFormData({ ...formData, deploymentLink: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accent}
                    onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                    className="h-10 w-20 border border-border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accent}
                    onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="#C8973D"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Image
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              <div
                className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: project.accent }}
              >
                {project.label}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between">
                <a
                  href={project.deploymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-accent hover:text-accent/80"
                >
                  <ExternalLink size={14} />
                  View Live
                </a>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects yet. Create your first project!</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, projectId: null })}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={confirmDeleteProject}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}