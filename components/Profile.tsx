import React, { useState, useRef } from 'react';
import { User, ACHIEVEMENTS_DATA } from '../types';
import Button from './Button';
import { LogOut, Edit2, Bell, Shield, RefreshCw, ChevronRight, Upload, Check } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      username: editName,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(user.username);
    setEditAvatar(user.avatar);
    setIsEditing(false);
  };

  const generateRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setEditAvatar(`https://picsum.photos/200/200?random=${randomId}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSelectAchievement = (id: string) => {
    // If clicking the same one, unequip it
    const newSelectedId = user.selectedAchievementId === id ? undefined : id;
    onUpdateUser({
      ...user,
      selectedAchievementId: newSelectedId
    });
  };

  if (isEditing) {
    return (
      <div className="w-full flex flex-col items-center h-full animate-fade-in pb-24 pt-4">
        <h2 className="font-fredoka text-2xl text-primary mb-6">Edit Profile</h2>
        
        <div className="bg-white p-8 rounded-[35px] shadow-xl w-full border-4 border-white flex flex-col gap-6">
            {/* Avatar Edit */}
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4 group">
                    <img src={editAvatar} alt="Avatar" className="w-full h-full rounded-full border-4 border-purple-100 object-cover shadow-sm transition-opacity group-hover:opacity-80" />
                    
                    {/* Randomize Button */}
                    <button 
                        onClick={generateRandomAvatar}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center text-primary hover:bg-purple-50 transition-all shadow-md z-10"
                        title="Random Avatar"
                    >
                        <RefreshCw size={18} />
                    </button>

                    {/* Upload Button */}
                    <button 
                        onClick={triggerFileUpload}
                        className="absolute inset-0 m-auto w-12 h-12 bg-black/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/50 transition-all"
                        title="Upload Photo"
                    >
                        <Upload size={24} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tap to Change</p>
            </div>

            {/* Name Edit */}
            <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                    Display Name
                </label>
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/50 outline-none rounded-2xl py-4 px-4 font-bold text-text-dark text-center text-xl transition-all"
                />
            </div>

            <div className="flex gap-3 mt-2">
                <Button variant="secondary" fullWidth onClick={handleCancel} className="!py-3 !text-sm">
                    Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={handleSave} className="!py-3 !text-sm">
                    Save Changes
                </Button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full animate-fade-in pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative mb-4">
            <img src={user.avatar} alt="Profile" className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover" />
            {user.selectedAchievementId && (
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md text-xl animate-pulse" title="Active Nameplate">
                 {ACHIEVEMENTS_DATA[user.selectedAchievementId]?.icon}
              </div>
            )}
        </div>
        <h2 className="font-fredoka text-3xl text-primary mb-1">{user.username}</h2>
        <div className="flex items-center gap-2">
           {user.selectedAchievementId && (
              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200">
                {ACHIEVEMENTS_DATA[user.selectedAchievementId].title}
              </span>
           )}
           <p className="text-xs font-bold text-gray-400">{user.email || user.phone}</p>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 px-2 space-y-6">

        {/* Achievements Section */}
        <div className="space-y-3">
             <div className="flex justify-between items-center px-4">
                <div className="text-xs font-extrabold text-primary/60 uppercase tracking-widest">成就板块 (点击悬挂铭牌)</div>
                <div className="text-[10px] text-gray-400 font-bold">{user.achievements?.length || 0}/2 已达成</div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               {['first_drop', 'streak_7'].map(id => {
                 const badge = ACHIEVEMENTS_DATA[id];
                 const isEarned = user.achievements?.includes(id);
                 const isSelected = user.selectedAchievementId === id;
                 
                 return (
                   <button 
                     key={id} 
                     disabled={!isEarned}
                     onClick={() => handleSelectAchievement(id)}
                     className={`p-3 rounded-2xl border-2 transition-all text-left flex items-center gap-3 relative ${
                       !isEarned 
                         ? 'bg-gray-100 border-gray-100 grayscale opacity-60' 
                         : isSelected
                           ? 'bg-yellow-50 border-yellow-400 shadow-md ring-4 ring-yellow-400/10'
                           : 'bg-white border-yellow-100 shadow-sm hover:border-yellow-200'
                     }`}
                   >
                      <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl ${isSelected ? 'bg-yellow-200' : 'bg-yellow-50'}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-text-dark text-xs">{badge.title}</div>
                        <div className="text-[9px] text-gray-400 leading-tight">
                          {isEarned ? (isSelected ? '展示中' : '可展示') : '未获得'}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full border-2 border-white shadow-sm">
                           <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                   </button>
                 );
               })}
             </div>
        </div>
        
        {/* Account Section */}
        <div className="space-y-3">
            <div className="text-xs font-extrabold text-primary/60 uppercase tracking-widest ml-4">Account</div>
            <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-white text-text-dark font-bold py-4 rounded-3xl shadow-sm border-2 border-transparent hover:border-purple-100 flex items-center justify-between px-5 transition-all active:scale-[0.99]"
            >
                <span className="flex items-center gap-4">
                    <div className="bg-purple-100 p-2.5 rounded-xl text-primary"><Edit2 size={20} /></div>
                    <span>Edit Profile</span>
                </span>
                <ChevronRight size={20} className="text-gray-300" />
            </button>
        </div>

        {/* Logout */}
        <button 
            onClick={onLogout}
            className="w-full mt-4 bg-red-50 text-red-500 font-bold py-4 rounded-3xl shadow-none border-2 border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-all active:scale-[0.99]"
        >
             <LogOut size={20} />
             Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;