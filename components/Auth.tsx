import React, { useState } from 'react';
import { Smartphone, Mail, Lock, AlertCircle } from 'lucide-react';
import Button from './Button';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Validates standard 11-digit mobile numbers (starts with 1, followed by 3-9)
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (error) setError(''); // Clear error on type
  };

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanId = identifier.trim();

    if (!cleanId) {
      setError('Please enter your details');
      return;
    }

    if (method === 'email') {
      if (!validateEmail(cleanId)) {
        setError('Format error: Please enter a valid email address');
        return;
      }
    } else {
      if (!validatePhone(cleanId)) {
        setError('Format error: Please enter a valid 11-digit mobile number');
        return;
      }
    }

    setIsLoading(true);
    // Simulate checking if user exists
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    // Simulate Auth API verification
    setTimeout(() => {
      setIsLoading(false);
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username: method === 'phone' ? 'MobileUser' : 'EmailUser',
        avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000)}`,
        [method]: identifier,
        friends: [],
        achievements: []
      };
      onLogin(mockUser);
    }, 1000);
  };

  const resetFlow = (newMethod: 'phone' | 'email') => {
    setMethod(newMethod);
    setStep('input');
    setIdentifier('');
    setPassword('');
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-[35px] shadow-xl p-8 border-4 border-white relative overflow-hidden">
        <h2 className="font-fredoka text-3xl text-center text-primary mb-6">
          Welcome Back 💩
        </h2>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
          <button
            onClick={() => resetFlow('phone')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              method === 'phone' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
            }`}
          >
            <Smartphone size={18} /> Mobile
          </button>
          <button
            onClick={() => resetFlow('email')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              method === 'email' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
            }`}
          >
            <Mail size={18} /> Email
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-500 rounded-xl flex items-center gap-2 text-xs font-bold animate-pulse">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {step === 'input' ? (
          <form onSubmit={handleIdentifierSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">
                {method === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  {method === 'phone' ? <Smartphone size={20} /> : <Mail size={20} />}
                </div>
                <input
                  type={method === 'phone' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => handleInputChange(setIdentifier, e.target.value)}
                  placeholder={method === 'phone' ? '13800138000' : 'you@example.com'}
                  className={`w-full bg-gray-50 border-2 focus:border-primary/50 outline-none rounded-2xl py-4 pl-12 pr-4 font-bold text-text-dark transition-colors ${error ? 'border-red-200 bg-red-50' : 'border-transparent'}`}
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Next'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">
                Enter password for <br/>
                <span className="font-bold text-primary">{identifier}</span>
              </p>
              <button 
                type="button" 
                onClick={() => setStep('input')}
                className="text-xs text-gray-400 font-bold hover:underline mt-2"
              >
                Change {method === 'phone' ? 'Number' : 'Email'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => handleInputChange(setPassword, e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-gray-50 border-2 focus:border-primary/50 outline-none rounded-2xl py-4 pl-12 pr-4 font-bold text-text-dark transition-colors ${error ? 'border-red-200 bg-red-50' : 'border-transparent'}`}
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-2">At least 6 characters</p>
            </div>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Login / Register'}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            By continuing, you agree to track your bowel movements responsibly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;