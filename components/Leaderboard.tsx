import React from 'react';
import { Trophy, Crown, UserPlus, Users } from 'lucide-react';
import { User, Log, ACHIEVEMENTS_DATA } from '../types';
import Button from './Button';

interface LeaderboardProps {
  currentUser: User;
  userLogs: Log[];
  allUsers: User[];
  onAddFriend: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, userLogs, allUsers, onAddFriend }) => {
  // Calculate current user stats
  const userWeeklyScore = userLogs.slice(0, 10).reduce((acc, log) => acc + log.score, 0);
  const userTotalLogs = userLogs.length;
  
  // Create Current User Entry
  const currentUserEntry = {
    ...currentUser,
    weeklyScore: userWeeklyScore,
    totalLogs: userTotalLogs,
    lastActive: 'Now',
    isMe: true
  };

  // Filter Friends: Get users whose ID is in currentUser.friends
  const friends = allUsers
    .filter(u => currentUser.friends.includes(u.id))
    .map(u => ({ ...u, isMe: false }));

  // Combine, Sort, and Rank
  const leaderboardData = [...friends, currentUserEntry]
    .sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0))
    .map((p, index) => ({ ...p, rank: index + 1 }));

  return (
    <div className="w-full pb-24 animate-fade-in relative">
      
      {/* Header Card */}
      <div className="bg-gradient-to-r from-primary to-purple-700 rounded-[30px] p-6 text-white mb-6 shadow-xl shadow-purple-200">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                <Trophy size={18} />
                <span className="text-xs font-bold tracking-widest uppercase">Weekly Championship</span>
                </div>
                <h2 className="font-fredoka text-3xl mb-1">Top Poopers</h2>
            </div>
            <button 
                onClick={onAddFriend}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-xl transition-colors"
            >
                <UserPlus size={24} className="text-white" />
            </button>
        </div>
        <p className="text-sm opacity-90 mt-1">
            {friends.length === 0 
                ? "You're all alone here! Add friends to compete." 
                : `Competing against ${friends.length} friend${friends.length !== 1 ? 's' : ''}`
            }
        </p>
      </div>

      {/* Empty State */}
      {leaderboardData.length <= 1 && (
        <div className="text-center py-8 px-4 bg-white rounded-[30px] border-2 border-dashed border-gray-200 mb-6">
            <div className="w-16 h-16 bg-purple-50 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={32} />
            </div>
            <p className="font-bold text-gray-500 mb-4">No friends on the leaderboard yet.</p>
            <Button variant="outline" onClick={onAddFriend} className="!py-2 text-sm">
                Find Friends
            </Button>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {leaderboardData.map((player) => (
          <div 
            key={player.id} 
            className={`relative flex items-center p-4 rounded-2xl transition-transform ${
              player.isMe 
                ? 'bg-white border-2 border-primary shadow-lg scale-[1.02] z-10' 
                : 'bg-white shadow-sm border border-transparent'
            }`}
          >
            {/* Rank */}
            <div className={`w-8 font-fredoka font-bold text-xl text-center mr-3 ${
              player.rank === 1 ? 'text-yellow-500 text-2xl' : 
              player.rank === 2 ? 'text-gray-400' :
              player.rank === 3 ? 'text-orange-400' : 'text-gray-300'
            }`}>
              {player.rank === 1 ? <Crown size={24} className="mx-auto" /> : `#${player.rank}`}
            </div>

            {/* Avatar */}
            <div className="relative mr-4">
              <img 
                src={player.avatar} 
                alt={player.username} 
                className="w-12 h-12 rounded-full border-2 border-purple-100 object-cover"
              />
              {player.selectedAchievementId && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[10px] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                   {ACHIEVEMENTS_DATA[player.selectedAchievementId].icon}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col">
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-sm truncate max-w-[100px] ${player.isMe ? 'text-primary' : 'text-text-dark'}`}>
                        {player.username}
                    </h3>
                    {/* Selected Nameplate */}
                    {player.selectedAchievementId && (
                        <span className="bg-yellow-50 border border-yellow-300 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap shadow-sm">
                            <span className="text-[11px]">{ACHIEVEMENTS_DATA[player.selectedAchievementId].icon}</span>
                            <span>{ACHIEVEMENTS_DATA[player.selectedAchievementId].title}</span>
                        </span>
                    )}
                 </div>
                 <div className="text-[10px] text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                        💩 {player.totalLogs || 0} drops
                    </span>
                    {player.lastActive && (
                        <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{player.lastActive}</span>
                        </>
                    )}
                 </div>
              </div>
            </div>

            {/* Score */}
            <div className="text-right min-w-[50px]">
              <div className="font-fredoka font-bold text-lg text-primary">
                {player.weeklyScore || 0}
              </div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                PTS
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;