'use client'

import { useState, useEffect } from 'react';
import { useTeam } from '../../contexts/TeamContext';
import type { TeamMember } from '../../types/index';
import toast, { Toaster } from 'react-hot-toast';
import { AlertDialog } from '../ui/Dialog';

export function ManageTeam() {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, isLoading } = useTeam();
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; memberId: string | null }>({
    open: false,
    memberId: null
  });
  
  // Auto-generate next index
  const getNextIndex = () => {
    if (teamMembers.length === 0) return '01';
    const maxIndex = Math.max(...teamMembers.map(m => parseInt(m.index) || 0));
    return String(maxIndex + 1).padStart(2, '0');
  };
  
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    initials: '',
    role: '',
    bio: '',
    tools: [''],
    accent: '#C8973D',
    index: getNextIndex(),
  });

  // Update index when teamMembers change
  useEffect(() => {
    if (formMode === 'add') {
      setFormData(prev => ({ ...prev, index: getNextIndex() }));
    }
  }, [teamMembers.length, formMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToolsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newTools = [...formData.tools];
    newTools[index] = value;
    setFormData(prev => ({
      ...prev,
      tools: newTools,
    }));
  };

  const handleAddTool = () => {
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, ''],
    }));
  };

  const handleRemoveTool = (index: number) => {
    if (formData.tools.length <= 1) return;
    const newTools = formData.tools.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      tools: newTools,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty tools
    const filteredTools = formData.tools.filter(tool => tool.trim() !== '');
    
    if (filteredTools.length === 0) {
      toast.error('Please add at least one tool or skill');
      return;
    }
    
    const memberData = { ...formData, tools: filteredTools };
    
    try {
      if (formMode === 'add') {
        await addTeamMember(memberData);
        toast.success('Team member added successfully!');
      } else if (formMode === 'edit' && editingId) {
        await updateTeamMember(editingId, memberData);
        toast.success('Team member updated successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save team member');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormMode('edit');
    setEditingId(member.id);
    setFormData({
      name: member.name,
      initials: member.initials,
      role: member.role,
      bio: member.bio,
      tools: member.tools,
      accent: member.accent,
      index: member.index,
    });
  };

  const handleDelete = async (id: string) => {
    setDeleteDialog({ open: true, memberId: id });
  };

  const confirmDeleteMember = async () => {
    if (!deleteDialog.memberId) return;
    
    try {
      await deleteTeamMember(deleteDialog.memberId);
      toast.success('Team member deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete team member');
    }
  };

  const resetForm = () => {
    setFormMode('add');
    setEditingId(null);
    setFormData({
      name: '',
      initials: '',
      role: '',
      bio: '',
      tools: [''],
      accent: '#C8973D',
      index: getNextIndex(),
    });
  };

  return (
    <div className="space-y-8">
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
      {/* Form */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-6">
          {formMode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Initials (max 2)</label>
              <input
                type="text"
                name="initials"
                value={formData.initials}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                maxLength={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="accent"
                  value={formData.accent || '#C8973D'}
                  onChange={handleInputChange}
                  className="h-10 w-20 border border-border rounded cursor-pointer"
                  required
                />
                <input
                  type="text"
                  value={formData.accent || '#C8973D'}
                  onChange={(e) => setFormData(prev => ({ ...prev, accent: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="#C8973D"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Index (auto-generated)</label>
              <input
                type="text"
                name="index"
                value={formData.index}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                maxLength={2}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tools & Skills</label>
            <div className="space-y-2">
              {formData.tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tool}
                    onChange={(e) => handleToolsChange(index, e)}
                    className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  {formData.tools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(index)}
                      className="text-sm text-destructive hover:text-destructive/80"
                    >
                      –
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTool}
                className="text-sm text-accent hover:text-accent/80"
              >
                + Add another tool
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-accent text-background hover:bg-accent/90 transition-colors"
            >
              {formMode === 'add' ? 'Add Team Member' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Team Members */}
      <div>
        <h2 className="text-xl font-bold mb-4">Current Team Members</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : teamMembers.length === 0 ? (
          <p className="text-muted-foreground">No team members yet. Add one above!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-card rounded-lg border p-4">
                <h3 className="font-bold text-lg mb-2">{member.name}</h3>
                <p className="text-muted-foreground mb-2">{member.initials}</p>
                <p className="text-sm mb-2">{member.role}</p>
                <p className="text-sm mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-1 text-xs bg-accent/10 text-accent rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(member)}
                    className="text-sm text-accent hover:text-accent/80"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id)}
                    className="text-sm text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, memberId: null })}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        onConfirm={confirmDeleteMember}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}