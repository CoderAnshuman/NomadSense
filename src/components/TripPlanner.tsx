import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, MapPin, Calendar, DollarSign, Users, Plane, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types';

import { generatePersonalizedTripPlan } from '../services/geminiService';

interface TripPlannerProps {
  user: UserProfile;
  initialDestination?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function TripPlanner({ user, initialDestination = '', onBack, onSuccess }: TripPlannerProps) {
  const [formData, setFormData] = useState({
    destination: initialDestination,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    days: 3,
    budget: 1000,
    peopleCount: 1,
    transportMode: 'Flight',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Generate the personalized plan first
      const insight = await generatePersonalizedTripPlan(
        formData.destination,
        formData.days,
        formData.budget,
        formData.peopleCount,
        formData.transportMode
      );

      await addDoc(collection(db, 'users', user.userId, 'trips'), {
        ...formData,
        userId: user.userId,
        insight: insight, // Saving the full generated insight
        createdAt: serverTimestamp(),
      });
      setIsSaved(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate and save trip plan.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSaved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="luxury-card p-20 text-center space-y-8"
        >
          <div className="mx-auto w-24 h-24 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-serif">Trip Saved!</h2>
            <p className="text-white/40 max-w-xs mx-auto italic font-light">Your adventure to {formData.destination} has been secured in your profile.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card w-full max-w-2xl p-10 lg:p-16 space-y-12"
      >
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white/20 hover:text-brand-gold transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6">
              <Compass className="w-3 h-3" />
              Strategic Planning
            </div>
            <h1 className="text-4xl font-serif">Plan Your Trip</h1>
          </div>
          <div className="w-6" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 font-bold ml-6">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                  placeholder="Where to?"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 font-bold ml-6">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 font-bold ml-6">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      const end = new Date(e.target.value);
                      const start = new Date(formData.startDate);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                      setFormData({...formData, endDate: e.target.value, days: diffDays});
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 font-bold ml-6">Budget ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 font-bold ml-6">Number of People</label>
                <div className="relative">
                  <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="number"
                    value={formData.peopleCount}
                    onChange={(e) => setFormData({...formData, peopleCount: parseInt(e.target.value) || 1})}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold/60 font-bold ml-6">Transportation</label>
                <div className="relative">
                  <Plane className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <select 
                    value={formData.transportMode}
                    onChange={(e) => setFormData({...formData, transportMode: e.target.value})}
                    className="w-full bg-brand-dark border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 text-xl focus:ring-1 focus:ring-brand-gold outline-none transition-all appearance-none"
                  >
                    <option value="Flight">Flight</option>
                    <option value="Train">Train</option>
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                    <option value="Sea">Sea</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-gold text-brand-dark py-6 rounded-[2rem] text-lg font-bold uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <CheckCircle className="w-6 h-6" />
                Save Trip Plan
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
