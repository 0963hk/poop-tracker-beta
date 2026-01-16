import React from 'react';
import { Log, BRISTOL_DATA } from '../types';
import { Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HistoryProps {
  logs: Log[];
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ logs, onClear }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <span className="text-4xl mb-4">🚽</span>
        <p className="font-bold">No logs yet.</p>
        <p className="text-sm">Start tracking to see history!</p>
      </div>
    );
  }

  // Prepare chart data (Last 7 logs)
  const chartData = logs.slice(0, 7).reverse().map((log, index) => ({
    name: index + 1, // just sequence
    score: log.score,
    date: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' })
  }));

  return (
    <div className="w-full pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end mb-4 px-2">
        <h2 className="font-fredoka text-2xl text-primary">Your History</h2>
        <button 
          onClick={onClear} 
          className="text-red-400 text-xs font-bold hover:text-red-600 flex items-center gap-1"
        >
          <Trash2 size={12} /> CLEAR ALL
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-3xl shadow-sm mb-6 h-48 border-2 border-purple-50">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#F3E8FF'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10B981' : entry.score > 50 ? '#F59E0B' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>

      {/* List */}
      <div className="space-y-3">
        {logs.map((log) => {
           const date = new Date(log.date);
           const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
           const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

           return (
            <div key={log.id} className="bg-white p-4 rounded-2xl flex items-center shadow-sm">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mr-4 shrink-0">
                {BRISTOL_DATA[log.bristolType]?.emoji || '💩'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-text-dark text-sm">{dateStr} • {timeStr}</div>
                <div className="text-xs text-gray-500 font-bold">
                  {log.duration} • {BRISTOL_DATA[log.bristolType]?.label}
                </div>
              </div>
              <div className={`font-fredoka text-xl font-bold ${
                log.score >= 80 ? 'text-green-500' : log.score >= 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {log.score}
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default History;
