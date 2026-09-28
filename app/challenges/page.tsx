"use client";
import { useEffect, useState } from 'react';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { ChallengeDossier } from '@/components/challenges/challenge-dossier';
import { ChallengeForm } from '@/components/challenges/challenge-form';
import { toast } from 'sonner';
import { Map, MapPin } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);

  const loadChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      const json = await res.json();
      if (json.success) {
        setChallenges(json.data);
      } else {
        toast.error('Failed to load challenges');
      }
    } catch (e) {
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-12 pb-24 px-6 md:px-12 relative">
      <div className="w-full max-w-[1400px] mx-auto mb-10">
        
        <div className="bg-white/60 px-4 py-1.5 rounded-full border border-white/40 mb-6 flex items-center gap-2 inline-flex">
          <MapPin className="w-3 h-3 text-[#0a192f]" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#0a192f]">EXPEDITION WAYPOINTS</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#0a192f] tracking-tight mb-2">
              GRAND LINE CHALLENGES
            </h1>
            <p className="text-[#d4af37] text-lg font-serif italic">
              "Distant tropical island destinations floating across the azure ocean."
            </p>
          </div>
          
          <div className="shrink-0 relative z-10">
            <ChallengeForm onCreated={loadChallenges} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white/40 animate-pulse rounded-2xl" />)}
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm flex flex-col items-center">
            <Map className="w-12 h-12 text-[#0a192f]/20 mb-4" />
            <h3 className="text-2xl font-serif font-bold text-[#0a192f] mb-2">No active missions</h3>
            <p className="text-[#0a192f]/60 max-w-md mx-auto">Define a new Grand Line mission to assemble crews.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((c, i) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                isFeatured={i === 3} // Just to show varied sizing, making one span full width
                onClick={() => setSelectedChallenge(c)}
              />
            ))}
          </div>
        )}
      </div>

      <ChallengeDossier
        challenge={selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
      />
    </div>
  );
}
