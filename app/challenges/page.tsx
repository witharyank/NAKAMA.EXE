"use client";
import { useEffect, useState } from 'react';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { ChallengeForm } from '@/components/challenges/challenge-form';
import { toast } from 'sonner';
import { Map } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="container mx-auto px-6 py-12 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row gap-12 mb-16 items-center">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em]">
            <div className="w-3 h-3 rounded-full bg-[#0d5f66] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
            <span>LOG POSE SYNCHRONIZATION // OBJECTIVE LEDGER</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-black text-[#0a192f] font-serif tracking-tight leading-none uppercase">
            GRAND LINE <span className="text-[#0d5f66]">MISSION BOARD</span>
          </h1>
          
          <div className="flex gap-4 items-start pl-2">
            <div className="w-1 h-12 bg-[#c62828] shrink-0 mt-1" />
            <p className="text-2xl text-[#c62828] font-serif italic">
              "Chart your course. Define the challenge. Find the crew capable of conquering it."
            </p>
          </div>
          
          <p className="text-[#0a192f]/70 text-lg max-w-2xl leading-relaxed pb-4">
            Establish the parameters, required roles, and specialized capabilities for your current expedition. The matching engine will cross-reference these requirements against the active roster.
          </p>
          
          <div className="flex gap-4 pb-8">
            <div className="relative z-10 shadow-lg shrink-0">
              <ChallengeForm onCreated={loadChallenges} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-16 border-t border-[#e6e0d3] mb-8">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em] mb-3">
          <Map className="w-4 h-4 text-[#d4af37]" />
          <span>MISSION LEDGER // OPEN CONTRACTS</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-[#0a192f] font-serif uppercase tracking-tight mb-2">ACTIVE MISSIONS</h2>
            <p className="text-[#0a192f]/60 text-lg font-serif italic">"Available operations pending crew assembly."</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-[#e6e0d3]/30 animate-pulse rounded-none" />)}
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-none border border-[#e6e0d3] shadow-sm relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at center, #0a192f 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="w-20 h-20 bg-[#fdfbf7] text-[#0a192f] rounded-none border border-[#e6e0d3] flex items-center justify-center mb-6 relative z-10 shadow-sm rotate-3">
            <Map className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#0a192f] mb-3 relative z-10">No missions charted.</h3>
          <p className="text-[#0a192f]/60 mb-8 max-w-md mx-auto relative z-10 text-lg">Define your first mission to begin evaluating compatibility scores.</p>
          <div className="relative z-10 shadow-lg"><ChallengeForm onCreated={loadChallenges} /></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {challenges.map(c => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      )}
    </div>
  );
}
