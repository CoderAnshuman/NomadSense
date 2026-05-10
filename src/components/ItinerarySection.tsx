import { Clock, MapPin, Sparkles } from "lucide-react";
import { LocationInsight } from "../types";
import { motion } from "motion/react";

export function ItinerarySection({ itinerary }: { itinerary: LocationInsight['itinerary'] }) {
  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <h3 className="text-5xl font-serif italic">AI Crafted Itinerary</h3>
        <div className="flex items-center gap-2 text-brand-gold text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          Optimized by Gemini
        </div>
      </div>

      <div className="space-y-12">
        {itinerary.map((day, dIdx) => (
          <div key={dIdx} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <div className="sticky top-32">
                <div className="text-brand-gold font-serif text-6xl mb-2">0{day.day}</div>
                <h4 className="text-xl font-serif text-white/80">{day.theme}</h4>
                <div className="h-[1px] w-full bg-white/10 mt-6" />
              </div>
            </div>
            
            <div className="lg:col-span-9 space-y-6">
              {day.items.map((item, iIdx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  key={iIdx} 
                  className="luxury-card p-8 flex flex-col md:flex-row gap-6 md:items-center hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-center gap-4 text-brand-gold/70 min-w-[120px]">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-sm">{item.time}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-xl font-medium">{item.activity}</h5>
                      <div className="text-brand-gold font-mono text-sm">${item.estimatedCost}</div>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
