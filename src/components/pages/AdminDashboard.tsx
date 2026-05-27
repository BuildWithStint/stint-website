'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, FolderOpen, LogOut, UsersRound, MessageSquare, Settings, ExternalLink } from 'lucide-react';
import { ManageUsers } from '../admin/ManageUsers';
import { ManageProjects } from '../admin/ManageProjects';
import { ManageTeam } from '../admin/ManageTeam';
import { ManageFeedback } from '../admin/ManageFeedback';
import { ManageContactSettings } from '../admin/ManageContactSettings';

type TabType = 'users' | 'projects' | 'team' | 'feedback' | 'settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'projects' as TabType, label: 'Projects', icon: FolderOpen },
    { id: 'team' as TabType, label: 'Team', icon: UsersRound },
    { id: 'feedback' as TabType, label: 'Feedback', icon: MessageSquare },
    { id: 'settings' as TabType, label: 'Contact Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <ManageUsers />;
      case 'projects':
        return <ManageProjects />;
      case 'team':
        return <ManageTeam />;
      case 'feedback':
        return <ManageFeedback />;
      case 'settings':
        return <ManageContactSettings />;
      default:
        return <ManageUsers />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground cursor-auto">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <span className="ml-4 px-2 py-1 bg-accent/20 text-accent text-sm rounded-full">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Site
              </a>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent text-background'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-card rounded-lg border border-border p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}