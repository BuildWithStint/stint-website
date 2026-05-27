import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, FolderOpen, LogOut, UsersRound, MessageSquare, Settings, ExternalLink } from 'lucide-react';
import { ManageUsers } from '../components/admin/ManageUsers';
import { ManageProjects } from '../components/admin/ManageProjects.tsx';
import { ManageTeam } from '../components/admin/ManageTeam';
import { ManageFeedback } from '../components/admin/ManageFeedback';
import { ManageContactSettings } from '../components/admin/ManageContactSettings';

type TabType = 'users' | 'projects' | 'team' | 'feedback' | 'settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const { user, logout } = useAuth();

  // Get tab from URL parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab') as TabType;
    
    // Validate that the tab parameter is a valid tab
    const validTabs: TabType[] = ['users', 'projects', 'team', 'feedback', 'settings'];
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as TabType;
      
      const validTabs: TabType[] = ['users', 'projects', 'team', 'feedback', 'settings'];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('projects'); // Default tab
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const tabs = [
    { id: 'projects' as TabType, label: 'Manage Projects', icon: FolderOpen },
    { id: 'team' as TabType, label: 'Manage Team', icon: UsersRound },
    { id: 'feedback' as TabType, label: 'Manage Feedback', icon: MessageSquare },
    { id: 'settings' as TabType, label: 'Contact Settings', icon: Settings },
    { id: 'users' as TabType, label: 'Manage Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background cursor-auto">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:border-accent transition-colors"
              >
                <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">View Website</span>
                <span className="xs:hidden">Website</span>
              </a>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Logout</span>
                <span className="xs:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Tabs */}
        <div className="border-b border-border mb-6 sm:mb-8">
          <nav className="-mb-px flex overflow-x-auto scrollbar-hide space-x-4 sm:space-x-8 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">
                    {tab.id === 'projects' && 'Projects'}
                    {tab.id === 'team' && 'Team'}
                    {tab.id === 'feedback' && 'Feedback'}
                    {tab.id === 'settings' && 'Settings'}
                    {tab.id === 'users' && 'Users'}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4 sm:mt-8">
          {activeTab === 'users' && <ManageUsers />}
          {activeTab === 'projects' && <ManageProjects />}
          {activeTab === 'team' && <ManageTeam />}
          {activeTab === 'feedback' && <ManageFeedback />}
          {activeTab === 'settings' && <ManageContactSettings />}
        </div>
      </div>
    </div>
  );
}