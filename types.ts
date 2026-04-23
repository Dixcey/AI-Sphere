export interface GraphNode {
  id: string;
  name: string;
  group: 'company' | 'founder' | 'researcher' | 'investor' | 'media';
  role?: string; // Job title or description
  handle?: string; // X (Twitter) username without @
  associated?: string; // Associated company or lab
  val?: number; // Influence score (calculated runtime)
  color?: string; // Visual color
  x?: number;
  y?: number;
  z?: number;
  // New fields
  imageUrl?: string;
  bioTags?: string[];
  joinedDate?: string;
  verified?: 'blue' | 'gold' | 'gray';
  bio?: string; // Short bio from X profile
  followers?: number; // Follower count
  following?: number; // Following count
  location?: string; // Location from X profile
  website?: string; // Website URL from X profile
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface SentimentScores {
  trends: 'optimistic' | 'pessimistic' | 'neutral';
  regulation: number;  // -1 (against) to 1 (pro)
  usage: number;       // -1 (restrictive) to 1 (enthusiastic)
  trust: number;       // -1 (high risk perceived) to 1 (high trust in AI)
  agent: number;       // -1 (skeptical) to 1 (bullish)
}

// LinkedIn extras (connections + location) keyed by influencer id
export interface LinkedInExtra {
  connections: string;
  location: string;
}

// A single career stage in a person's timeline.
// y = year range (e.g., "2019–"), r = role/title, c = company.
export interface CareerStage {
  y: string;
  r: string;
  c: string;
}

// Inferred sentiment per career stage — array is ordered newest→oldest,
// matching the ordering used in `careerHistory`.
export interface SentimentStage {
  reg: number; // regulation
  use: number; // AI usage
  tru: number; // trust
  age: number; // AI agents
}

export interface InfluencerResponse {
  newNodes: Array<{ 
    name: string; 
    group: 'company' | 'founder' | 'researcher' | 'investor' | 'media';
    role: string;
    handle: string;
    associated: string;
    bioTags: string[];
    joinedDate: string;
    bio: string;
  }>;
  newLinks: Array<{ source: string; target: string }>;
}