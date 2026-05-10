import { motion } from "motion/react";
import { Compass, Calendar, Landmark, Info, Sparkles, Map as MapIcon, ChevronRight } from "lucide-react";
import { LocationInsight } from "../types";
import { InteractiveMap } from "./InteractiveMap";

interface InsightDashboardProps {
  insight: LocationInsight;
  onBack: () => void;
}

export function InsightDashboard({ insight, onBack }: InsightDashboardProps) {
  return (
    <div className="min-h-screen bg-brand-dark pb-20">
      <nav className="glass-nav py-6 px-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2 font-serif text-2xl tracking-tight">
          <Compass className="gold-text w-6 h-6" />
          Nomad<span className="gold-text">Sense</span>
        </div>
        <button 
          onClick={onBack}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-medium"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          New Search
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Header section */}
        <header className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[1px] w-12 bg-brand-gold"></div>
            <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-semibold">Destination Unveiled</span>
          </div>
          <h2 className="text-7xl md:text-8xl font-serif mb-8 leading-none tracking-tighter">
            {insight.name}
          </h2>
          <p className="text-xl md:text-2xl text-white/50 font-light max-w-4xl leading-relaxed">
            {insight.description}
          </p>
        </header>

        {/* Culture section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
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
                  Upcoming Festivals
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
        <section className="mb-24">
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
      </main>

      <footer className="max-w-7xl mx-auto px-8 pt-20 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs tracking-widest uppercase mb-4">NomadSense powered by Gemini & Grounding</p>
        <p className="font-serif italic text-white/40">Travel is fatal to prejudice, bigotry, and narrow-mindedness.</p>
      </footer>
    </div>
  );
}
