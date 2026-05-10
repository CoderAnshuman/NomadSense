import React, { useState, FormEvent } from "react";
import { Search, MapPin, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchHero({ onSearch, isLoading }: SearchHeroProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-gold text-xs font-medium tracking-widest uppercase mb-8">
          <Sparkles className="w-3 h-3" />
          AI-Powered Cultural Explorer
        </div>
        
        <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-tight leading-tight">
          Unveil the soul of <span className="italic gold-text">every place</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          NomadSense uses Gemini grounding to reveal hidden histories, living traditions, and the vibrant culture of your next destination.
        </p>

        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto group">
          <div className="relative flex items-center">
            <Search className="absolute left-6 w-5 h-5 text-white/30 group-focus-within:text-brand-gold transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to explore?"
              className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-16 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all backdrop-blur-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-3 bg-brand-gold text-brand-dark px-8 py-3.5 rounded-full font-medium hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Explore"}
            </button>
          </div>
        </form>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-white/40">
          <span>Popular:</span>
          {["Kyoto, Japan", "Varanasi, India", "Marrakech, Morocco", "Cusco, Peru"].map((loc) => (
            <button 
              key={loc}
              onClick={() => onSearch(loc)}
              className="hover:text-brand-gold transition-colors underline underline-offset-4"
            >
              {loc}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
