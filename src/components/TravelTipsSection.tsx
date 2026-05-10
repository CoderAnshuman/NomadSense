import { Languages, Bus, CloudSun, CreditCard } from "lucide-react";
import { LocationInsight } from "../types";

export function TravelTipsSection({ tips }: { tips: LocationInsight['travelTips'] }) {
  const getIcon = (cat: string) => {
    switch(cat) {
      case 'language': return <Languages className="w-6 h-6" />;
      case 'transport': return <Bus className="w-6 h-6" />;
      case 'weather': return <CloudSun className="w-6 h-6" />;
      case 'budget': return <CreditCard className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {tips.map((tip, i) => (
        <div key={i} className="luxury-card p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold mb-8">
            {getIcon(tip.category)}
          </div>
          <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-gold/60 mb-6">{tip.category}</h4>
          <p className="text-sm text-white/70 leading-relaxed font-light italic">
            "{tip.content}"
          </p>
        </div>
      ))}
    </div>
  );
}

import { BookOpen } from "lucide-react";
