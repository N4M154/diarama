export interface TownEntry {
  id: string;
  author: string;
  content: string;
  location: string;
  timestamp: number;
  isGuest?: boolean;
  themes: string[];
}

export interface TownData {
  id: string;
  name: string;
  entries: TownEntry[];
  crest: string;
  motto: string;
  createdAt: number;
  lastUpdated: number;
}

export interface TownLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  entries: string[];
  icon: string;
}

export interface CrestPattern {
  pattern: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockCondition: string;
  themes: string[];
}