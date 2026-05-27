'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import type { TeamMember } from '../types/index';
import { teamAPI } from '../services/api';

interface TeamContextType {
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from API on initial render
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await teamAPI.getTeamMembers();
      if (response.success) {
        // Map _id to id for frontend compatibility
        const members = response.teamMembers.map((m: any) => ({
          ...m,
          id: m._id
        }));
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const response = await teamAPI.createTeamMember(member);
      if (response.success) {
        const newMember = { ...response.teamMember, id: response.teamMember._id };
        setTeamMembers(prev => [...prev, newMember]);
      }
    } catch (error) {
      console.error('Failed to add team member:', error);
      throw error;
    }
  };

  const updateTeamMember = async (id: string, member: Partial<TeamMember>) => {
    try {
      const response = await teamAPI.updateTeamMember(id, member);
      if (response.success) {
        const updated = { ...response.teamMember, id: response.teamMember._id };
        setTeamMembers(prev =>
          prev.map(m => (m.id === id ? updated : m))
        );
      }
    } catch (error) {
      console.error('Failed to update team member:', error);
      throw error;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const response = await teamAPI.deleteTeamMember(id);
      if (response.success) {
        setTeamMembers(prev => prev.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete team member:', error);
      throw error;
    }
  };

  return (
    <TeamContext.Provider value={{ teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, isLoading }}>
      {children}
    </TeamContext.Provider>
  );
}