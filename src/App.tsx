/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppState, LocationInsight } from './types';
import { getLocationInsight } from './services/geminiService';
import { SearchHero } from './components/SearchHero';
import { InsightDashboard } from './components/InsightDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({
    searchQuery: '',
    locationInsight: null,
    isLoading: false,
    error: null,
  });

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, searchQuery: query }));
    try {
      const insight = await getLocationInsight(query);
      setState(prev => ({ ...prev, locationInsight: insight, isLoading: false }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "Failed to explore this place. Please try a different location or check your configuration." 
      }));
    }

  };

  const handleReset = () => {
    setState({
      searchQuery: '',
      locationInsight: null,
      isLoading: false,
      error: null,
    });
  };

  return (
    <div className="min-h-screen text-brand-paper">
      <AnimatePresence mode="wait">
        {!state.locationInsight ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SearchHero onSearch={handleSearch} isLoading={state.isLoading} />
            
            {state.isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-brand-gold animate-spin" />
                  <div className="absolute inset-0 blur-xl bg-brand-gold/20 animate-pulse"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-serif mb-2 italic">Consulting local lore...</h3>
                  <p className="text-white/40 text-sm tracking-[0.2em] font-mono uppercase">Grounding insights via Gemini</p>
                </div>
              </motion.div>
            )}

            {state.error && (
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-2xl backdrop-blur-xl">
                {state.error}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <InsightDashboard insight={state.locationInsight} onBack={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

