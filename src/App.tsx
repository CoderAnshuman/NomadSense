/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppState, LocationInsight, UserProfile } from './types';
import { getLocationInsight } from './services/geminiService';
import { SearchHero } from './components/SearchHero';
import { InsightDashboard } from './components/InsightDashboard';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { TripPlanner } from './components/TripPlanner';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, User as UserIcon, Home, Compass } from 'lucide-react';
import { auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type View = 'auth' | 'home' | 'dashboard' | 'profile' | 'planner';
type AuthMode = 'login' | 'register';

export default function App() {
  const [state, setState] = useState<AppState>({
    searchQuery: '',
    locationInsight: null,
    activeTrip: null,
    isLoading: false,
    error: null,
    user: null,
    authLoading: true,
  });

  const [view, setView] = useState<View>('home');
  const [previousView, setPreviousView] = useState<View>('home');
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const navigateTo = (newView: View) => {
    setPreviousView(view);
    setView(newView);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setState(prev => ({ ...prev, user: userDoc.data() as UserProfile, authLoading: false }));
        } else {
          setState(prev => ({ ...prev, authLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, user: null, authLoading: false }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, searchQuery: query }));
    try {
      const insight = await getLocationInsight(query);
      setState(prev => ({ ...prev, locationInsight: insight, isLoading: false }));
      navigateTo('dashboard');
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "Failed to explore this place. Please try a different location or check your configuration." 
      }));
    }
  };

  const handleAuthSuccess = (userProfile: UserProfile) => {
    setState(prev => ({ ...prev, user: userProfile }));
    navigateTo('home');
  };

  const handleLoginRequired = () => {
    setAuthMode('login');
    navigateTo('auth');
  };

  if (state.authLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-brand-paper bg-brand-dark overflow-x-hidden">
      {/* Navigation Overlay */}
      {view !== 'auth' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center bg-brand-dark/20 backdrop-blur-2xl border border-white/10 rounded-full p-2 px-8 gap-12 shadow-2xl">
          <button 
            onClick={() => { navigateTo('home'); setState(prev => ({ ...prev, locationInsight: null, activeTrip: null })); }}
            className={`p-2 transition-colors ${view === 'home' ? 'text-brand-gold' : 'text-white/40 hover:text-white'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => state.user ? navigateTo('profile') : handleLoginRequired()}
            className={`p-2 transition-colors ${view === 'profile' ? 'text-brand-gold' : 'text-white/40 hover:text-white'}`}
          >
            <UserIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'auth' ? (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {authMode === 'login' ? (
              <Login 
                onSuccess={handleAuthSuccess} 
                onSwitchToRegister={() => setAuthMode('register')} 
              />
            ) : (
              <Register 
                onSuccess={handleAuthSuccess} 
                onSwitchToLogin={() => setAuthMode('login')} 
              />
            )}
          </motion.div>
        ) : view === 'home' ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SearchHero onSearch={handleSearch} isLoading={state.isLoading} />
            {state.isLoading && (
              <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-[200] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
                <p className="text-brand-gold font-serif italic text-lg">Consulting local lore...</p>
              </div>
            )}
          </motion.div>
        ) : view === 'dashboard' && state.locationInsight ? (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InsightDashboard 
              insight={state.locationInsight} 
              user={state.user}
              trip={state.activeTrip || undefined}
              onBack={() => {
                setState(prev => ({ ...prev, activeTrip: null }));
                setView(previousView === 'profile' ? 'profile' : 'home');
              }} 
              onPlanTrip={() => state.user ? navigateTo('planner') : handleLoginRequired()}
              onLoginRequired={handleLoginRequired}
              onUpdateTrip={(updatedTrip) => {
                setState(prev => ({ ...prev, activeTrip: updatedTrip }));
              }}
            />
          </motion.div>
        ) : view === 'profile' && state.user ? (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Profile 
              user={state.user} 
              onLogout={() => { navigateTo('home'); setState(prev => ({ ...prev, user: null, activeTrip: null })); }} 
              onPlanTrip={() => navigateTo('planner')}
              onViewTrip={(trip) => {
                if (trip.insight) {
                  setState(prev => ({ ...prev, locationInsight: trip.insight, activeTrip: trip }));
                  navigateTo('dashboard');
                }
              }}
            />
          </motion.div>
        ) : view === 'planner' && state.user ? (
          <motion.div key="planner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TripPlanner 
              user={state.user} 
              initialDestination={state.locationInsight?.name}
              onBack={() => navigateTo('profile')} 
              onSuccess={() => navigateTo('profile')}
            />
          </motion.div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <button onClick={() => setView('home')} className="text-brand-gold">Back to Safety</button>
          </div>
        )}
      </AnimatePresence>

      {state.error && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-full backdrop-blur-xl animate-bounce">
          {state.error}
          <button onClick={() => setState({...state, error: null})} className="ml-4 underline">dismiss</button>
        </div>
      )}
    </div>
  );
}

