'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Eye, EyeOff, X, Copy } from 'lucide-react';
import { feedbackAPI } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { AlertDialog } from '../ui/Dialog';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  company?: string;
  position?: string;
  isVisible: boolean;
  createdAt: string;
  createdBy?: {
    email: string;
  };
}

export function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; feedbackId: string | null }>({
    open: false,
    feedbackId: null
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: '',
    company: '',
    position: '',
    isVisible: true
  });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await feedbackAPI.getAllFeedbacks();
      if (response.success) {
        setFeedbacks(response.feedbacks);
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
      setError('Failed to load feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingFeedback) {
        const response = await feedbackAPI.updateFeedback(editingFeedback._id, formData);
        if (response.success) {
          setFeedbacks(feedbacks.map(f => 
            f._id === editingFeedback._id ? response.feedback : f
          ));
          setEditingFeedback(null);
          toast.success('Feedback updated successfully!');
        }
      } else {
        const response = await feedbackAPI.createFeedback(formData);
        if (response.success) {
          setFeedbacks([response.feedback, ...feedbacks]);
          toast.success('Feedback created successfully!');
        }
      }
      
      resetForm();
    } catch (error: any) {
      console.error('Failed to save feedback:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save feedback';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      rating: 5,
      review: '',
      company: '',
      position: '',
      isVisible: true
    });
    setShowCreateForm(false);
    setEditingFeedback(null);
    setError('');
  };

  const handleEdit = (feedback: Feedback) => {
    setFormData({
      name: feedback.name,
      email: feedback.email,
      rating: feedback.rating,
      review: feedback.review,
      company: feedback.company || '',
      position: feedback.position || '',
      isVisible: feedback.isVisible
    });
    setEditingFeedback(feedback);
    setShowCreateForm(true);
  };

  const handleDuplicate = (feedback: Feedback) => {
    setFormData({
      name: feedback.name + ' (Copy)',
      email: feedback.email,
      rating: feedback.rating,
      review: feedback.review,
      company: feedback.company || '',
      position: feedback.position || '',
      isVisible: feedback.isVisible
    });
    setEditingFeedback(null); // Set to null so it creates a new feedback
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteDialog({ open: true, feedbackId: id });
  };

  const confirmDeleteFeedback = async () => {
    if (!deleteDialog.feedbackId) return;
    
    try {
      const response = await feedbackAPI.deleteFeedback(deleteDialog.feedbackId);
      if (response.success) {
        setFeedbacks(feedbacks.filter(f => f._id !== deleteDialog.feedbackId));
        toast.success('Feedback deleted successfully!');
      }
    } catch (error: any) {
      console.error('Failed to delete feedback:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete feedback';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const toggleVisibility = async (feedback: Feedback) => {
    try {
      const response = await feedbackAPI.updateFeedback(feedback._id, {
        ...feedback,
        isVisible: !feedback.isVisible
      });
      if (response.success) {
        setFeedbacks(feedbacks.map(f => 
          f._id === feedback._id ? response.feedback : f
        ));
        toast.success(`Feedback ${!feedback.isVisible ? 'shown' : 'hidden'} successfully!`);
      }
    } catch (error: any) {
      console.error('Failed to toggle visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}
      />
    ));
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Manage Feedback</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors text-sm"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Add New Feedback</span>
          <span className="xs:hidden">Add Feedback</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-foreground">
              {editingFeedback ? 'Edit Feedback' : 'Create New Feedback'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  placeholder="Client name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  placeholder="client@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  placeholder="Company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  placeholder="Job title"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={star <= formData.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Review *
              </label>
              <textarea
                required
                rows={4}
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="Client's feedback..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4 text-accent bg-background border-border rounded focus:ring-accent"
              />
              <label htmlFor="isVisible" className="text-sm text-foreground">
                Show on website
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                {editingFeedback ? 'Update Feedback' : 'Create Feedback'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedbacks List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="bg-card border border-border rounded-lg p-4 relative">
            {/* Visibility Badge */}
            <div className="absolute top-2 right-2">
              <button
                onClick={() => toggleVisibility(feedback)}
                className={`p-1.5 rounded-full transition-colors ${
                  feedback.isVisible 
                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                }`}
                title={feedback.isVisible ? 'Visible on website' : 'Hidden from website'}
              >
                {feedback.isVisible ? <Eye size={12} className="sm:w-3.5 sm:h-3.5" /> : <EyeOff size={12} className="sm:w-3.5 sm:h-3.5" />}
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {renderStars(feedback.rating)}
            </div>

            {/* Review */}
            <p className="text-xs sm:text-sm text-foreground mb-4 line-clamp-3">
              "{feedback.review}"
            </p>

            {/* User Info */}
            <div className="mb-4 pb-4 border-b border-border">
              <p className="font-semibold text-foreground text-xs sm:text-sm">{feedback.name}</p>
              <p className="text-xs text-muted-foreground break-all">{feedback.email}</p>
              {(feedback.position || feedback.company) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {feedback.position} {feedback.company && `at ${feedback.company}`}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => handleDuplicate(feedback)}
                  className="p-1 text-muted-foreground hover:text-accent transition-colors"
                  title="Duplicate feedback"
                >
                  <Copy size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleEdit(feedback)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit feedback"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleDelete(feedback._id)}
                  className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                  title="Delete feedback"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {feedbacks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No feedback yet. Create your first one!</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, feedbackId: null })}
        title="Delete Feedback"
        description="Are you sure you want to delete this feedback? This action cannot be undone."
        onConfirm={confirmDeleteFeedback}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
