export interface Log {
  id: string;
  date: string; // ISO string
  duration: string; // MM:SS
  score: number;
  bristolType: number;
  effort: number;
  color: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  phone?: string;
  email?: string;
  friends: string[]; // Array of user IDs
  achievements: string[]; // Array of achievement IDs
  selectedAchievementId?: string; // The one currently "hanging"
  weeklyScore?: number; // Snapshot for leaderboard
  totalLogs?: number;   // Snapshot for leaderboard
  lastActive?: string;
}

export interface Notification {
  id: string;
  type: 'FRIEND_REQUEST';
  fromUserId: string;
  fromUsername: string;
  fromAvatar: string;
  date: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  weeklyScore: number;
  totalLogs: number;
  lastActive: string;
  rank: number;
  achievements: string[];
  selectedAchievementId?: string;
  isMe?: boolean;
}

export const ACHIEVEMENTS_DATA: Record<string, { id: string; icon: string; title: string; description: string }> = {
  'first_drop': { 
    id: 'first_drop', 
    icon: '🥇', 
    title: '黄金开局', 
    description: '完成第一次排便记录' 
  },
  'streak_7': { 
    id: 'streak_7', 
    icon: '🏆', 
    title: '肠道劳模', 
    description: '连续七天坚持打卡' 
  }
};

export enum BristolType {
  HardLumps = 1,
  LumpySausage = 2,
  Cracked = 3,
  Snake = 4,
  SoftBlobs = 5,
  Mushy = 6,
  Liquid = 7,
}

export const BRISTOL_DATA: Record<number, { emoji: string; label: string }> = {
  1: { emoji: "🌑", label: "Hard Rocks" },
  2: { emoji: "🍇", label: "Lumpy Log" },
  3: { emoji: "🌽", label: "Cracked Log" },
  4: { emoji: "🐍", label: "Perfect Snake" },
  5: { emoji: "🍦", label: "Soft Blobs" },
  6: { emoji: "🥣", label: "Mushy" },
  7: { emoji: "🌊", label: "Waterfall" },
};

export const POOP_COLORS = [
  { name: 'Brown', value: '#5D4037' },
  { name: 'Light', value: '#8D6E63' },
  { name: 'Green', value: '#15803D' },
  { name: 'Red', value: '#B91C1C' },
  { name: 'Black', value: '#111827' },
];