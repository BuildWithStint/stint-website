'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, Shield } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { AlertDialog } from '../ui/Dialog';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export function ManageUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'admin' as const });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null
  });

  // Check if current user is super user
  if (!user?.isSuperUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need super user privileges to access user management.</p>
        </div>
      </div>
    );
  }

  // Load users from API on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getUsers();
      if (response.success) {
        // Filter out the default admin account
        const filteredUsers = response.users.filter((user: User) => user.email !== 'admin@stint.com');
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await usersAPI.createUser(newUser);
      if (response.success) {
        setUsers([...users, response.user]);
        setNewUser({ email: '', password: '', role: 'admin' });
        setShowCreateForm(false);
      }
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setError(error.response?.data?.error || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    setDeleteDialog({ open: true, userId: id });
  };

  const confirmDeleteUser = async () => {
    if (!deleteDialog.userId) return;
    
    try {
      const response = await usersAPI.deleteUser(deleteDialog.userId);
      if (response.success) {
        setUsers(users.filter(user => user._id !== deleteDialog.userId));
      }
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      setError(error.response?.data?.error || 'Failed to delete user');
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Manage Users</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          Add New Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Create User Form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Create New Admin</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter password (min 6 characters)"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors"
              >
                Create Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setError('');
                }}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">All Users ({users.length})</h3>
        </div>
        
        <div className="divide-y divide-border">
          {users.map((user, index) => (
            <div key={user._id || `user-${index}`} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Mail size={16} className="text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield size={12} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground capitalize">{user.role}</span>
                    <span className="text-sm text-muted-foreground">• Created {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {users.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, userId: null })}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDeleteUser}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}