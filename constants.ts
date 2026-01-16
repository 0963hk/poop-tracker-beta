import { User } from './types';

// Acting as our "Database" of users
export const MOCK_USERS: User[] = [
  {
    id: 'f1',
    username: 'KingLog',
    avatar: 'https://picsum.photos/100/100?random=1',
    weeklyScore: 980,
    totalLogs: 12,
    lastActive: '2h ago',
    friends: ['f2', 'f3'],
    achievements: ['first_drop', 'streak_7']
  },
  {
    id: 'f2',
    username: 'FiberQueen',
    avatar: 'https://picsum.photos/100/100?random=2',
    weeklyScore: 850,
    totalLogs: 8,
    lastActive: '5h ago',
    friends: ['f1'],
    achievements: ['first_drop']
  },
  {
    id: 'f3',
    username: 'RegularJoe',
    avatar: 'https://picsum.photos/100/100?random=3',
    weeklyScore: 720,
    totalLogs: 7,
    lastActive: '1d ago',
    friends: ['f1'],
    achievements: []
  },
  {
    id: 'f4',
    username: 'TacoTuesday',
    avatar: 'https://picsum.photos/100/100?random=4',
    weeklyScore: 450,
    totalLogs: 15,
    lastActive: '10m ago',
    friends: [],
    achievements: []
  },
  {
    id: 'f5',
    username: 'SplashZone',
    avatar: 'https://picsum.photos/100/100?random=5',
    weeklyScore: 320,
    totalLogs: 4,
    lastActive: '3d ago',
    friends: [],
    achievements: []
  },
  {
    id: 'f6',
    username: 'PoopMaster3000',
    avatar: 'https://picsum.photos/100/100?random=6',
    weeklyScore: 120,
    totalLogs: 2,
    lastActive: '1w ago',
    friends: [],
    achievements: []
  }
];