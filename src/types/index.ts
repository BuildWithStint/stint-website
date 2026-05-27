import type { LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  number: string;
  title: string;
  desc: string;
  tags: string[];
  color: string;
}

export interface WorkConcept {
  label: string;
  title: string;
  desc: string;
  image: string;
  accent: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  tools: string[];
  accent: string;
  index: string;
}

export interface ContactForm {
  name: string;
  email: string;
  project: string;
  budget: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  label: string;
  image: string;
  deploymentLink: string;
  accent: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
