import { Utensils, Star, Flame } from "lucide-react";
import { LocationInsight } from "../types";

export function CuisineSection({ cuisine }: { cuisine: LocationInsight['cuisine'] }) {
  return (
    <div className="space-y-12">
      <div className="text-center mb-16">
        <h3 className="text-5xl font-serif mb-4 italic">Culinary Journey</h3>
        <p className="text-white/40 max-w-2xl mx-auto">Discover the authentic flavors that define the local palate.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cuisine.map((item, i) => (
          <div key={i} className="luxury-card group hover:border-brand-gold/30 transition-all duration-500">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <Utensils className="w-6 h-6" />
                </div>
                {item.mustTry && (
                  <span className="flex items-center gap-1 text-[10px] bg-brand-gold text-brand-dark px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" />
                    Must Try
                  </span>
                )}
              </div>
              <h4 className="text-2xl font-serif mb-3 group-hover:text-brand-gold transition-colors">{item.name}</h4>
              <p className="text-sm text-white/50 leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono border border-white/10 px-2 py-0.5 rounded">
                  {item.type}
                </span>
                {item.type === 'dish' && <Flame className="w-3 h-3 text-orange-500/50" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
