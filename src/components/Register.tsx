import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Globe, Info, Loader2, Camera, ArrowLeft } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface RegisterProps {
  onSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onSuccess, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    city: '',
    country: '',
    additionalInfo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userProfile = {
        userId: userCredential.user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        city: formData.city,
        country: formData.country,
        additionalInfo: formData.additionalInfo,
        photoUrl: '', // Placeholder
        username: formData.email.split('@')[0],
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      onSuccess(userProfile);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card w-full max-w-2xl p-10 space-y-8"
      >
        <div className="flex items-center justify-between">
          <button onClick={onSwitchToLogin} className="text-white/20 hover:text-brand-gold transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex-1">
            <div className="mx-auto w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-6 relative overflow-hidden group">
              <User className="w-12 h-12" />
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-brand-gold" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs uppercase tracking-widest font-bold text-white/10 pointer-events-none">Photo</div>
            </div>
          </div>
          <div className="w-5" /> {/* Balancer */}
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-2">Create Profile</h1>
          <p className="text-white/40 text-sm italic">Join our global community of explorers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">First Name</label>
              <input 
                type="text"
                placeholder="John"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Last Name</label>
              <input 
                type="text"
                placeholder="Doe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Email Address</label>
              <input 
                type="email"
                placeholder="john@doe.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Phone Number</label>
              <input 
                type="tel"
                placeholder="+1 234 567 890"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">City</label>
              <input 
                type="text"
                placeholder="San Francisco"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Country</label>
              <input 
                type="text"
                placeholder="USA"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Password</label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold ml-4">Additional Information</label>
            <textarea 
              placeholder="Tell us about your travel dreams..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all h-32 resize-none"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-400/5 py-2 rounded-lg border border-red-400/20">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-gold text-brand-dark py-4 rounded-2xl font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register User"}
          </button>
        </form>

        <div className="text-center pt-4">
          <button 
            onClick={onSwitchToLogin}
            className="text-white/40 text-xs hover:text-brand-gold transition-colors underline underline-offset-4"
          >
            Already have an account? Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
