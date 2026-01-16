import React, { useState } from 'react';
import { User } from '../types';
import { Search, UserPlus, CheckCircle, Users } from 'lucide-react';

interface AddFriendProps {
  allUsers: User[];
  currentUser: User;
  onSendRequest: (toUserId: string) => void;
  onBack: () => void;
}

const AddFriend: React.FC<AddFriendProps> = ({ allUsers, currentUser, onSendRequest, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentIds, setSentIds] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSend = (userId: string) => {
    onSendRequest(userId);
    setSentIds([...sentIds, userId]);
  };

  // Filter users only if there is a search term
  const results = searchTerm.trim().length > 0 
    ? allUsers.filter(u => 
        u.id !== currentUser.id && 
        !currentUser.friends.includes(u.id) &&
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="w-full h-full animate-fade-in pb-24 pt-2">
       <div className="flex items-center gap-2 px-4 mb-6">
          <button onClick={onBack} className="text-gray-400 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">← Back</button>
          <h2 className="font-fredoka text-2xl text-primary">Find Friends</h2>
       </div>

       <div className="px-4 mb-6">
         <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
               <Search size={20} />
            </div>
            <input 
               type="text" 
               placeholder="Enter username to search..." 
               value={searchTerm}
               onChange={handleSearch}
               className="w-full bg-white border-2 border-purple-50 focus:border-primary/50 outline-none rounded-2xl py-4 pl-12 pr-4 font-bold text-text-dark shadow-sm transition-all"
               autoFocus
            />
         </div>
       </div>

       <div className="px-4 space-y-3">
          {searchTerm.trim().length > 0 && results.length === 0 && (
             <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 opacity-40">
                    <Users size={32} />
                </div>
                <p className="text-gray-400 font-bold">No users found matching "{searchTerm}"</p>
             </div>
          )}

          {searchTerm.trim().length === 0 && (
             <div className="text-center py-12 opacity-60">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={40} className="text-primary/40" />
                </div>
                <p className="font-bold text-gray-400">Search for real users to add them as friends!</p>
                <p className="text-xs text-gray-300 mt-1">Try searching for "Regular" or "King"</p>
             </div>
          )}

          {results.map(user => {
             const isSent = sentIds.includes(user.id);
             return (
               <div key={user.id} className="bg-white p-4 rounded-2xl shadow-sm border border-transparent flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-3">
                     <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full border border-gray-100 object-cover" />
                     <div>
                        <p className="font-bold text-text-dark">{user.username}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                           {user.weeklyScore || 0} PTS
                        </p>
                     </div>
                  </div>
                  
                  <button 
                     onClick={() => !isSent && handleSend(user.id)}
                     disabled={isSent}
                     className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isSent 
                           ? 'bg-green-100 text-green-600' 
                           : 'bg-primary text-white shadow-lg active:scale-90 hover:bg-primary/90'
                     }`}
                  >
                     {isSent ? <CheckCircle size={20} /> : <UserPlus size={20} />}
                  </button>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default AddFriend;