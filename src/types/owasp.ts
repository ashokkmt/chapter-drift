// OWASP NEST Data Types

export interface Chapter {
  id: string;
  name: string;
  region: string;
  description?: string;
  popularity: number; // Based on activity/members
  url?: string;
  leaders?: string[];
  meetingInfo?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    slack?: string;
  };
}

export interface Region {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  level?: string;
  type?: string;
  url?: string;
}

export interface Repository {
  id: string;
  name: string;
  url?: string;
  stars?: number;
  forks?: number;
}

export interface Event {
  id: string;
  name: string;
  date?: string;
  location?: string;
  url?: string;
}

export interface Committee {
  id: string;
  name: string;
  description?: string;
}

export interface Issue {
  id: string;
  title: string;
  status?: string;
  url?: string;
}
