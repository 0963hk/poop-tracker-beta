import React, { useState, useEffect } from 'react';
import { Timer, ScrollText, Trophy, User as UserIcon, Bell } from 'lucide-react';
import Auth from './components/Auth';
import Tracker from './components/Tracker';
import History from './components/History';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Inbox from './components/Inbox';
import AddFriend from './components/AddFriend';
import { User, Log, Notification, ACHIEVEMENTS_DATA } from './types';
import { MOCK_USERS } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  // Simulated Global Database State
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [activeTab, setActiveTab] = useState<'tracker' | 'history' | 'leaderboard' | 'profile' | 'inbox' | 'add-friend'>('tracker');
  const [previousTab, setPreviousTab] = useState<'tracker' | 'history' | 'leaderboard' | 'profile'>('tracker');

  // Load data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('poop_user');
    const savedLogs = localStorage.getItem('poop_logs');
    const savedNotifications = localStorage.getItem('poop_notifications');
    const savedAllUsers = localStorage.getItem('poop_all_users');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedAllUsers) setAllUsers(JSON.parse(savedAllUsers));
    else localStorage.setItem('poop_all_users', JSON.stringify(MOCK_USERS));
  }, []);

  // Persist data
  useEffect(() => {
    if (logs.length > 0) localStorage.setItem('poop_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('poop_user', JSON.stringify(user));
      // Update the user in allUsers list to sync leaderboard
      setAllUsers(prev => prev.map(u => u.id === user.id ? user : u));
    }
    else localStorage.removeItem('poop_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('poop_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('poop_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const handleLogin = (newUser: User) => {
    if (!newUser.friends) newUser.friends = [];
    if (!newUser.achievements) newUser.achievements = [];
    setUser(newUser);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('tracker');
  };

  const checkAchievements = (currentLogs: Log[], currentUser: User) => {
    const newAchievements = [...(currentUser.achievements || [])];
    let updated = false;

    // 1. First Drop Achievement
    if (currentLogs.length >= 1 && !newAchievements.includes('first_drop')) {
      newAchievements.push('first_drop');
      updated = true;
      alert(`🏆 成就达成: ${ACHIEVEMENTS_DATA['first_drop'].title}!`);
    }

    // 2. Weekly Streak (7 consecutive days)
    if (!newAchievements.includes('streak_7')) {
      const uniqueDates = Array.from(new Set(
        currentLogs.map(l => new Date(l.date).setHours(0,0,0,0))
      )).sort((a,b) => b-a);

      let maxStreak = 0;
      let currentStreak = 0;

      if (uniqueDates.length >= 7) {
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const current = uniqueDates[i];
          const next = uniqueDates[i+1];
          const diffDays = Math.round((current - next) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
          } else {
            currentStreak = 0;
          }
          if (currentStreak >= 6) { 
             maxStreak = 7;
             break;
          }
        }
      }

      if (maxStreak >= 7) {
         newAchievements.push('streak_7');
         updated = true;
         alert(`🏆 成就达成: ${ACHIEVEMENTS_DATA['streak_7'].title}!`);
      }
    }

    if (updated) {
      setUser({ ...currentUser, achievements: newAchievements });
    }
  };

  const saveLog = (newLogData: Omit<Log, 'id'>) => {
    const newLog: Log = { ...newLogData, id: Date.now().toString() };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    setActiveTab('history');
    
    if (user) {
        checkAchievements(updatedLogs, user);
    }
  };

  const clearHistory = () => {
    if (confirm('Flush all history? 🚽')) {
      setLogs([]);
      localStorage.removeItem('poop_logs');
    }
  };

  const handleSendFriendRequest = (toUserId: string) => {
    alert("Request Sent! (Simulated)");
  };

  const handleAcceptRequest = (notificationId: string) => {
    const notif = notifications.find(n => n.id === notificationId);
    if (!notif || !user) return;
    const updatedUser = { ...user, friends: [...user.friends, notif.fromUserId] };
    setUser(updatedUser);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setAllUsers(prev => prev.map(u => {
        if (u.id === notif.fromUserId && !u.friends.includes(user.id)) {
            return { ...u, friends: [...u.friends, user.id] };
        }
        return u;
    }));
  };

  const handleDeclineRequest = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const pendingCount = notifications.filter(n => n.status === 'PENDING').length;

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page text-text-dark font-nunito flex justify-center">
      <div className="w-full max-md h-screen flex flex-col relative bg-bg-page shadow-2xl overflow-hidden">
        
        {/* Header */}
        <header className="pt-8 pb-4 px-6 flex justify-between items-center bg-bg-page z-10">
          <h1 className="font-fredoka text-3xl text-primary drop-shadow-sm flex items-center gap-2">
            Poop Tracker 💩
          </h1>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => { setPreviousTab(activeTab as any); setActiveTab('inbox'); }}
                className="w-10 h-10 rounded-full bg-white border-2 border-purple-100 flex items-center justify-center relative text-primary hover:bg-purple-50 transition-colors"
             >
                <Bell size={20} />
                {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {pendingCount}
                    </span>
                )}
             </button>
             <button onClick={() => setActiveTab('profile')} className="relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-primary overflow-hidden shadow-sm">
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                </div>
                {/* Active Nameplate on Header Icon */}
                {user.selectedAchievementId && (
                   <div className="absolute -bottom-1 -right-1 bg-yellow-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-white shadow-sm ring-1 ring-yellow-400/20">
                      {ACHIEVEMENTS_DATA[user.selectedAchievementId].icon}
                   </div>
                )}
             </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 hide-scrollbar">
          {activeTab === 'tracker' && <Tracker onSave={saveLog} />}
          {activeTab === 'history' && <History logs={logs} onClear={clearHistory} />}
          
          {activeTab === 'leaderboard' && (
            <Leaderboard 
                currentUser={user} 
                userLogs={logs} 
                allUsers={allUsers}
                onAddFriend={() => { setPreviousTab('leaderboard'); setActiveTab('add-friend'); }} 
            />
          )}
          
          {activeTab === 'profile' && (
            <Profile user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />
          )}

          {activeTab === 'inbox' && (
            <Inbox 
                notifications={notifications} 
                onAccept={handleAcceptRequest} 
                onDecline={handleDeclineRequest}
                onClose={() => setActiveTab(previousTab)}
            />
          )}

          {activeTab === 'add-friend' && (
             <AddFriend 
                allUsers={allUsers} 
                currentUser={user} 
                onSendRequest={handleSendFriendRequest} 
                onBack={() => setActiveTab(previousTab)}
             />
          )}
        </main>

        {(activeTab !== 'inbox' && activeTab !== 'add-friend') && (
            <nav className="absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md rounded-[30px] shadow-lg border-2 border-white/50 p-2 flex justify-between items-center z-50">
            <NavButton 
                active={activeTab === 'tracker'} 
                onClick={() => setActiveTab('tracker')} 
                icon={<Timer size={24} />} 
                label="Track" 
            />
            <NavButton 
                active={activeTab === 'history'} 
                onClick={() => setActiveTab('history')} 
                icon={<ScrollText size={24} />} 
                label="History" 
            />
            <NavButton 
                active={activeTab === 'leaderboard'} 
                onClick={() => setActiveTab('leaderboard')} 
                icon={<Trophy size={24} />} 
                label="Rank" 
            />
            <NavButton 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
                icon={<UserIcon size={24} />} 
                label="Me" 
            />
            </nav>
        )}

      </div>
    </div>
  );
}

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
      active ? 'text-primary scale-110' : 'text-gray-400 hover:text-purple-300'
    }`}
  >
    <div className={`p-1 rounded-xl transition-colors ${active ? 'bg-purple-100' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold mt-1">{label}</span>
  </button>
);

export default App;