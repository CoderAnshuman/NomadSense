import { ShieldCheck, ShieldAlert, BookOpen } from "lucide-react";
import { LocationInsight } from "../types";

export function EtiquetteSection({ etiquette }: { etiquette: LocationInsight['etiquette'] }) {
  return (
    <div className="luxury-card border-none bg-brand-gold/5 p-12 lg:p-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent)] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h3 className="text-5xl font-serif mb-16 text-center italic flex items-center justify-center gap-6">
          <BookOpen className="w-12 h-12 gold-text" />
          Cultural Etiquette
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {etiquette.map((item, i) => (
            <div key={i} className="flex gap-6">
              <div className={`mt-1 w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${item.isEssential ? 'bg-red-500/20 text-red-400' : 'bg-brand-gold/20 text-brand-gold'}`}>
                {item.isEssential ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">{item.rule}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
