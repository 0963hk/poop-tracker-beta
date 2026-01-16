import React from 'react';
import { Notification } from '../types';
import { Check, X, Bell } from 'lucide-react';
import Button from './Button';

interface InboxProps {
  notifications: Notification[];
  onAccept: (notificationId: string) => void;
  onDecline: (notificationId: string) => void;
  onClose: () => void;
}

const Inbox: React.FC<InboxProps> = ({ notifications, onAccept, onDecline, onClose }) => {
  const pendingRequests = notifications.filter(n => n.status === 'PENDING');

  return (
    <div className="w-full h-full animate-fade-in pb-24 pt-2">
       <div className="flex justify-between items-center px-4 mb-6">
          <h2 className="font-fredoka text-2xl text-primary">Inbox</h2>
          <button onClick={onClose} className="text-gray-400 font-bold text-sm">Close</button>
       </div>

      {pendingRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 opacity-60">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Bell size={32} />
          </div>
          <p className="font-bold">No new messages</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="px-4 space-y-4">
           <h3 className="text-xs font-extrabold text-primary/60 uppercase tracking-widest ml-1">Friend Requests</h3>
           
           {pendingRequests.map(notification => (
             <div key={notification.id} className="bg-white p-4 rounded-2xl shadow-md border-2 border-purple-50 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                   <img src={notification.fromAvatar} alt={notification.fromUsername} className="w-10 h-10 rounded-full border border-gray-200" />
                   <div>
                      <p className="font-bold text-text-dark text-sm">
                        <span className="text-primary">{notification.fromUsername}</span> wants to be friends!
                      </p>
                      <p className="text-xs text-gray-400">{new Date(notification.date).toLocaleDateString()}</p>
                   </div>
                </div>
                
                <div className="flex gap-2">
                   <button 
                      onClick={() => onDecline(notification.id)}
                      className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm flex items-center justify-center gap-1 active:scale-95 transition-transform"
                   >
                      <X size={16} /> Decline
                   </button>
                   <button 
                      onClick={() => onAccept(notification.id)}
                      className="flex-1 py-2 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-1 shadow-md shadow-purple-200 active:scale-95 transition-transform"
                   >
                      <Check size={16} /> Accept
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;
