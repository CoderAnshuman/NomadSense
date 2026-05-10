import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Loader2, Camera } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LoginProps {
  onSuccess: (user: any) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onSuccess, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        onSuccess(userDoc.data());
      } else {
        setError("User profile not found. Please register.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="luxury-card w-full max-w-md p-10 space-y-8"
      >
        <div className="text-center">
          <div className="mx-auto w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-6 relative overflow-hidden group">
            <User className="w-12 h-12" />
            <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-6 h-6 text-brand-gold" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs uppercase tracking-widest font-bold text-white/10 pointer-events-none">Photo</div>
          </div>
          <h1 className="text-3xl font-serif mb-2">Welcome Back</h1>
          <p className="text-white/40 text-sm italic">Unlock your personalized world.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Username (Email)</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nomad@sense.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-400/5 py-2 rounded-lg border border-red-400/20">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-gold text-brand-dark py-4 rounded-2xl font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login Button"}
          </button>
        </form>

        <div className="text-center pt-4">
          <button 
            onClick={onSwitchToRegister}
            className="text-white/40 text-xs hover:text-brand-gold transition-colors underline underline-offset-4"
          >
            Don't have an account? Register User
          </button>
        </div>
      </motion.div>
    </div>
  );
}
