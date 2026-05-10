import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Globe, Info, Compass, Calendar, LogOut, Plus } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { UserProfile, UserTrip } from '../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onPlanTrip: () => void;
  onViewTrip: (trip: UserTrip) => void;
}

export function Profile({ user, onLogout, onPlanTrip, onViewTrip }: ProfileProps) {
  const [trips, setTrips] = useState<UserTrip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  useEffect(() => {
    async function fetchTrips() {
      try {
        const q = query(
          collection(db, 'users', user.userId, 'trips'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedTrips = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserTrip[];
        setTrips(fetchedTrips);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setIsLoadingTrips(false);
      }
    }
    fetchTrips();
  }, [user.userId]);

  const filteredTrips = trips.filter(trip => {
    const today = new Date().toISOString().split('T')[0];
    if (activeTab === 'ongoing') {
      return (trip.startDate && trip.endDate) && (today >= trip.startDate && today <= trip.endDate);
    }
    if (activeTab === 'upcoming') {
      return !trip.startDate || today < trip.startDate; // Old trips without dates go here too
    }
    if (activeTab === 'completed') {
      return (trip.startDate && trip.endDate) && (today > trip.endDate);
    }
    return true;
  });

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-20">
      <nav className="glass-nav py-6 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-serif text-2xl tracking-tight">
          <Compass className="gold-text w-6 h-6" />
          Nomad<span className="gold-text">Sense</span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-white/40 hover:text-red-400 transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar / User Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="luxury-card p-10 text-center">
              <div className="mx-auto w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-6 relative overflow-hidden">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
              <h2 className="text-3xl font-serif mb-1">{user.firstName} {user.lastName}</h2>
              <p className="text-brand-gold text-xs font-mono uppercase tracking-[0.2em] mb-6">@{user.username}</p>
              
              <div className="h-[1px] w-full bg-white/5 mb-6" />
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 text-white/60">
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-4 text-white/60">
                    <Phone className="w-4 h-4 text-brand-gold" />
                    <span className="text-sm">{user.phoneNumber}</span>
                  </div>
                )}
                {(user.city || user.country) && (
                  <div className="flex items-center gap-4 text-white/60">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    <span className="text-sm">{user.city}{user.city && user.country ? ', ' : ''}{user.country}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="luxury-card p-10">
              <h3 className="text-xl font-serif mb-4 flex items-center gap-3">
                <Info className="gold-text w-5 h-5" />
                Bio
              </h3>
              <p className="text-sm text-white/50 leading-relaxed italic">
                {user.additionalInfo || "No bio information provided."}
              </p>
            </div>
          </div>

          {/* Main Content / Trips */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-4xl font-serif italic">My Gallery</h3>
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                {['upcoming', 'ongoing', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeTab === tab ? 'bg-brand-gold text-brand-dark' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button 
                onClick={onPlanTrip}
                className="bg-brand-gold text-brand-dark px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                Plan New Trip
              </button>
            </div>

            {isLoadingTrips ? (
              <div className="luxury-card p-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div>
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTrips.map((trip) => (
                  <motion.div 
                    key={trip.id}
                    onClick={() => onViewTrip(trip)}
                    whileHover={{ y: -5 }}
                    className="luxury-card p-8 group relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 blur-2xl group-hover:bg-brand-gold/10 transition-all" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-1 rounded border border-brand-gold/20 font-mono uppercase tracking-[0.2em]">
                          {trip.transportMode || 'Flight'}
                        </span>
                        <Calendar className="w-4 h-4 text-white/20" />
                      </div>
                      <h4 className="text-2xl font-serif mb-2">{trip.destination}</h4>
                      {trip.startDate && (
                        <p className="text-[10px] text-brand-gold/60 uppercase tracking-widest mb-4">
                          {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-white/40 mb-6">
                        <span>{trip.days} Days</span>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <span>{trip.peopleCount || 1} People</span>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-xs uppercase tracking-widest text-white/20">Budget</span>
                        <span className="text-brand-gold font-serif text-xl">${trip.budget}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="luxury-card p-20 text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                  <Compass className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-serif">No trips saved yet</h4>
                  <p className="text-white/30 text-sm max-w-xs mx-auto">Explore the world and start planning your next great adventure.</p>
                </div>
                <button 
                  onClick={onPlanTrip}
                  className="text-brand-gold text-xs font-bold uppercase tracking-widest underline underline-offset-8"
                >
                  Start Planning
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
