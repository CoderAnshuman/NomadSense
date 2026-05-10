import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Calendar, 
  Landmark, 
  Info, 
  Sparkles, 
  Map as MapIcon, 
  ChevronRight, 
  Utensils, 
  Coffee, 
  BookOpen, 
  Layers,
  Loader2,
  CheckCircle,
  Plus,
  CheckSquare,
  PenTool,
  Save,
  Trash2
} from "lucide-react";
import { UserProfile, LocationInsight, UserTrip } from '../types';
import { InteractiveMap } from "./InteractiveMap";
import { ItinerarySection } from "./ItinerarySection";
import { CuisineSection } from "./CuisineSection";
import { EtiquetteSection } from "./EtiquetteSection";
import { TravelTipsSection } from "./TravelTipsSection";

import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

interface InsightDashboardProps {
  insight: LocationInsight;
  user: UserProfile | null;
  trip?: UserTrip;
  onBack: () => void;
  onPlanTrip: () => void;
  onLoginRequired: () => void;
  onUpdateTrip?: (trip: UserTrip) => void;
}

type Tab = "overview" | "plan" | "taste" | "guide" | "checklist" | "journal";

export function InsightDashboard({ insight, user, trip, onBack, onPlanTrip, onLoginRequired, onUpdateTrip }: InsightDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  
  // Checklist and Notes state
  const [checklist, setChecklist] = useState<{id: string, task: string, completed: boolean}[]>(trip?.checklist || []);
  const [notes, setNotes] = useState(trip?.notes || "");
  const [newItem, setNewItem] = useState("");

  const handleSaveToProfile = async () => {
    if (!user) {
      onLoginRequired();
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date();
      const startDate = now.toISOString().split('T')[0];
      const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await addDoc(collection(db, 'users', user.userId, 'trips'), {
        destination: insight.name,
        startDate,
        endDate,
        days: 3,
        budget: 1000,
        peopleCount: 1,
        transportMode: 'Flight',
        insight: insight,
        userId: user.userId,
        createdAt: serverTimestamp(),
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTrip = async () => {
    if (!user || !trip) return;
    setIsSaving(true);
    try {
      const tripRef = doc(db, 'users', user.userId, 'trips', trip.id);
      await updateDoc(tripRef, {
        checklist,
        notes,
        updatedAt: serverTimestamp()
      });
      if (onUpdateTrip) {
        onUpdateTrip({ ...trip, checklist, notes });
      }
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const addChecklistItem = () => {
    if (!newItem.trim()) return;
    const item = { id: Math.random().toString(36).substr(2, 9), task: newItem, completed: false };
    setChecklist([...checklist, item]);
    setNewItem("");
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "plan", label: "Plan", icon: Calendar },
    ...(trip ? [
      { id: "checklist", label: "Checklist", icon: CheckSquare },
      { id: "journal", label: "Journal", icon: PenTool },
    ] : []),
    { id: "taste", label: "Taste", icon: Coffee },
    { id: "guide", label: "Guide", icon: BookOpen },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-dark pb-20">
      <nav className="glass-nav py-6 px-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2 font-serif text-2xl tracking-tight">
          <Compass className="gold-text w-6 h-6" />
          Nomad<span className="gold-text">Sense</span>
        </div>
        
        <div className="hidden md:flex items-center bg-white/5 rounded-full p-1 border border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? "bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20" 
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <button 
          onClick={onBack}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-medium"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          New Search
        </button>
      </nav>

      {/* Mobile Tab Nav */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-4 bg-white/5 border-b border-white/10 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id ? "bg-brand-gold text-brand-dark" : "bg-white/5 text-white/40"
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-24"
            >
              {/* Header section */}
              <header>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-[1px] w-12 bg-brand-gold"></div>
                  <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-semibold">Destination Unveiled</span>
                </div>
                <h2 className="text-7xl md:text-8xl font-serif mb-8 leading-none tracking-tighter">
                  {insight.name}
                </h2>
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <p className="text-xl md:text-2xl text-white/50 font-light max-w-2xl leading-relaxed">
                    {insight.description}
                  </p>
                  <button 
                    onClick={onPlanTrip}
                    className="bg-brand-gold text-brand-dark px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-gold/10 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                  >
                    Custom Plan
                  </button>
                  <button 
                    onClick={handleSaveToProfile}
                    disabled={isSaving || saveStatus === 'success'}
                    className={`px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] border transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                      saveStatus === 'success' 
                        ? 'bg-green-500/10 border-green-500 text-green-500' 
                        : 'border-white/20 hover:border-brand-gold hover:text-brand-gold text-white/60'
                    }`}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {saveStatus === 'success' ? 'Saved' : 'Save to Profile'}
                  </button>
                </div>
              </header>

              {/* Culture section */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                  <div className="luxury-card p-10 h-full">
                    <h3 className="text-3xl font-serif mb-6 flex items-center gap-3">
                      <Info className="gold-text" />
                      Living Culture
                    </h3>
                    <p className="text-white/70 mb-8 leading-relaxed italic">
                      "{insight.culture.summary}"
                    </p>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-brand-gold uppercase tracking-wider text-[10px] font-bold mb-3">Key Facts</h4>
                        <ul className="space-y-2">
                          {insight.culture.facts.map((f, i) => (
                            <li key={i} className="text-sm text-white/60 border-l border-white/10 pl-4">{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    <div className="luxury-card p-10">
                      <h3 className="text-3xl font-serif mb-8 flex items-center gap-3">
                        <Sparkles className="gold-text" />
                        Traditions
                      </h3>
                      <ul className="space-y-4">
                        {insight.culture.traditions.map((t, i) => (
                          <li key={i} className="flex gap-4 group">
                            <span className="font-mono text-brand-gold opacity-30 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                            <p className="text-white/70 leading-relaxed">{t}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="luxury-card p-10">
                      <h3 className="text-3xl font-serif mb-8 flex items-center gap-3">
                        <Calendar className="gold-text" />
                        Festivals
                      </h3>
                      <div className="space-y-6">
                        {insight.festivals.map((f, i) => (
                          <div key={i} className="relative pl-6 border-l border-brand-gold/20">
                            {f.isComingSoon && (
                              <span className="absolute -left-1.5 top-0 w-3 h-3 bg-brand-gold rounded-full animate-ping" />
                            )}
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-white">{f.name}</h4>
                              <span className="text-[10px] text-brand-gold font-mono uppercase italic">{f.timing}</span>
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">{f.significance}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Famous Places section */}
              <section>
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h3 className="text-4xl md:text-5xl font-serif mb-4 flex items-center gap-4">
                      <Landmark className="gold-text w-10 h-10" />
                      Must-Visit Landmarks
                    </h3>
                    <p className="text-white/40 max-w-xl">
                      Curation of architectural marvels and natural wonders that define {insight.name}.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {insight.famousPlaces.map((place, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="luxury-card p-6 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-brand-gold/60 font-bold mb-4 block">
                          {place.category}
                        </span>
                        <h4 className="text-xl font-serif mb-3 leading-tight">{place.name}</h4>
                        <p className="text-xs text-white/50 leading-relaxed mb-6">
                          {place.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono">
                        <MapIcon className="w-3 h-3" />
                        {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <InteractiveMap insight={insight} />
              </section>

              {/* Activities section */}
              <section className="bg-brand-gold/5 rounded-[40px] p-12 lg:p-20 border border-brand-gold/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-5xl font-serif mb-16 text-center italic">Local Experiences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {insight.activities.map((act, i) => (
                      <div key={i} className="text-center group">
                        <div className="mb-6 mx-auto w-16 h-16 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h4 className="text-2xl font-serif mb-4 leading-tight">{act.title}</h4>
                        <p className="text-sm text-white/50 leading-relaxed mb-4">
                          {act.description}
                        </p>
                        <span className="inline-block py-1 px-3 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 uppercase tracking-widest">
                          {act.vibe}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-24"
            >
              {trip && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="luxury-card p-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Planned Budget</p>
                    <p className="text-4xl font-serif text-brand-gold">${trip.budget}</p>
                  </div>
                  <div className="luxury-card p-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Duration</p>
                    <p className="text-4xl font-serif text-brand-gold">{trip.days} Days</p>
                  </div>
                  <div className="luxury-card p-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Itinerary Cost</p>
                    <p className="text-4xl font-serif text-brand-gold">
                      ${insight.itinerary.reduce((total, day) => total + day.items.reduce((dayTotal, item) => dayTotal + (item.estimatedCost || 0), 0), 0)}
                    </p>
                  </div>
                </div>
              )}
              <ItinerarySection itinerary={insight.itinerary} />
            </motion.div>
          )}

          {activeTab === "checklist" && trip && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center">
                <h3 className="text-5xl font-serif italic mb-4">Travel Checklist</h3>
                <p className="text-white/40">Keep track of your essentials and preparations.</p>
              </div>

              <div className="luxury-card p-10 space-y-8">
                <div className="flex gap-4">
                  <input 
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                    placeholder="Add an item (e.g., Pack passport, Buy insurance)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-full py-4 px-8 focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                  />
                  <button 
                    onClick={addChecklistItem}
                    className="bg-brand-gold text-brand-dark px-8 rounded-full font-bold uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {checklist.length > 0 ? (
                    checklist.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 group p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                        <button 
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            item.completed ? 'bg-brand-gold border-brand-gold text-brand-dark' : 'border-white/20 text-transparent'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <span className={`flex-1 ${item.completed ? 'text-white/20 line-through' : 'text-white'}`}>
                          {item.task}
                        </span>
                        <button 
                          onClick={() => removeChecklistItem(item.id)}
                          className="text-white/10 hover:text-red-400 p-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-white/20 italic">No items in your checklist. Start by adding one above.</div>
                  )}
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={handleUpdateTrip}
                    disabled={isSaving}
                    className="bg-brand-gold text-brand-dark px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "journal" && trip && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center">
                <h3 className="text-5xl font-serif italic mb-4">Travel Journal</h3>
                <p className="text-white/40">Log your thoughts, hidden gems, and reflections here.</p>
              </div>

              <div className="luxury-card p-12 space-y-8">
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Capture your memories..."
                  className="w-full min-h-[500px] bg-transparent border-none text-xl leading-relaxed text-white/80 focus:ring-0 resize-none font-serif placeholder:text-white/10"
                />
                
                <div className="pt-8 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={handleUpdateTrip}
                    disabled={isSaving}
                    className="bg-brand-gold text-brand-dark px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Journal
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "taste" && (
            <motion.div
              key="taste"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-24"
            >
              <CuisineSection cuisine={insight.cuisine} />
              <div className="border-t border-white/5 pt-20">
                <EtiquetteSection etiquette={insight.etiquette.filter(e => e.rule.toLowerCase().includes('food') || e.rule.toLowerCase().includes('dining'))} />
              </div>
            </motion.div>
          )}

          {activeTab === "guide" && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-24"
            >
              <TravelTipsSection tips={insight.travelTips} />
              <EtiquetteSection etiquette={insight.etiquette} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-8 pt-20 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs tracking-widest uppercase mb-4">NomadSense powered by Gemini & Grounding</p>
        <p className="font-serif italic text-white/40">Travel is fatal to prejudice, bigotry, and narrow-mindedness.</p>
      </footer>
    </div>
  );
}
