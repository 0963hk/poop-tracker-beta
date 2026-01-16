import React, { useState, useEffect } from 'react';
import { BRISTOL_DATA, POOP_COLORS, BristolType, Log } from '../types';
import Button from './Button';

interface TrackerProps {
  onSave: (log: Omit<Log, 'id'>) => void;
}

const Tracker: React.FC<TrackerProps> = ({ onSave }) => {
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [effort, setEffort] = useState(5);
  const [bristol, setBristol] = useState<number>(4);
  const [selectedColor, setSelectedColor] = useState('Brown');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTiming && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming, startTime]);

  const toggleTimer = () => {
    if (!isTiming) {
      setIsTiming(true);
      setStartTime(Date.now());
      setElapsed(0);
    } else {
      setIsTiming(false);
      setShowForm(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const calculateScore = () => {
    let score = 0;
    // Texture (Max 40)
    if (bristol === 4) score = 40;
    else if (bristol === 3 || bristol === 5) score = 30;
    else score = 10;
    
    // Effort (Max 40 - inverse logic, lower effort is better)
    // 1 (Easy) -> 40pts, 10 (Hard) -> 4pts
    score += Math.max(0, 44 - (effort * 4));

    // Color (Max 20)
    if (selectedColor === 'Brown' || selectedColor === 'Light') score += 20;
    else if (selectedColor === 'Green') score += 10;
    
    return Math.min(100, score);
  };

  const handleSave = () => {
    onSave({
      date: new Date().toISOString(),
      duration: formatTime(elapsed),
      score: calculateScore(),
      bristolType: bristol,
      effort: effort,
      color: selectedColor
    });
    // Reset
    setShowForm(false);
    setElapsed(0);
    setStartTime(null);
    setEffort(5);
    setBristol(4);
    setSelectedColor('Brown');
  };

  if (showForm) {
    return (
      <div className="w-full animate-fade-in pb-20">
        <div className="bg-white rounded-[35px] shadow-xl p-6 border-4 border-white mb-6">
          
          {/* Effort */}
          <div className="mb-6">
            <label className="block font-bold text-primary text-sm uppercase tracking-wider mb-2">
              Effort Level
            </label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
              <span className="text-2xl">😖</span>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={effort}
                onChange={(e) => setEffort(parseInt(e.target.value))}
                className="flex-1 accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-2xl">😇</span>
            </div>
            <div className="text-center text-xs text-gray-400 mt-1 font-bold">
              {effort === 1 ? 'Walk in the park' : effort === 10 ? 'Fighting demons' : 'Normal'}
            </div>
          </div>

          {/* Bristol */}
          <div className="mb-6">
            <label className="block font-bold text-primary text-sm uppercase tracking-wider mb-4">
              Texture (Bristol)
            </label>
            <div className="flex flex-col items-center mb-4">
              <span className="text-6xl mb-2 animate-bounce-short">{BRISTOL_DATA[bristol].emoji}</span>
              <span className="text-gray-500 font-bold text-sm">{BRISTOL_DATA[bristol].label}</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setBristol(num)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                    bristol === num 
                      ? 'bg-purple-100 text-primary border-primary' 
                      : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-8">
            <label className="block font-bold text-primary text-sm uppercase tracking-wider mb-4">
              Color
            </label>
            <div className="flex justify-center gap-4">
              {POOP_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${
                    selectedColor === c.name 
                      ? 'border-primary scale-110 shadow-lg' 
                      : 'border-white ring-2 ring-gray-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <Button variant="brown" fullWidth onClick={handleSave}>
            SAVE LOG 💩
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in pb-20">
      <div className="bg-white w-full rounded-[35px] shadow-xl p-10 border-4 border-white text-center relative overflow-hidden">
        <div 
          className={`text-8xl mb-6 transition-transform duration-700 ease-in-out inline-block ${
            isTiming ? 'animate-breathe' : ''
          }`}
        >
          💩
        </div>
        <div className="font-fredoka text-6xl text-text-dark mb-8 tabular-nums tracking-tight">
          {formatTime(elapsed)}
        </div>
        <Button 
          variant={isTiming ? 'secondary' : 'primary'} 
          fullWidth 
          onClick={toggleTimer}
        >
          {isTiming ? 'FINISH' : 'START POOPING'}
        </Button>
      </div>
    </div>
  );
};

export default Tracker;