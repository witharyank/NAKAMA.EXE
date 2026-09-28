"use client";
import { useEffect, useState } from 'react';
import { TeamCard } from '@/components/teams/team-card';
import { toast } from 'sonner';
import { Ship, Anchor } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FleetsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const json = await res.json();
      if (json.success) {
        setTeams(json.data);
      } else {
        toast.error('Failed to load fleets');
      }
    } catch (e) {
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row gap-12 mb-16 items-center">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em]">
            <div className="w-3 h-3 rounded-full bg-[#d4af37] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
            <span>LOG POSE SYNCHRONIZATION // FORMATION ARCHIVES</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-black text-[#0a192f] font-serif tracking-tight leading-none uppercase">
            GRAND FLEET <span className="text-[#d4af37]">REGISTRY</span>
          </h1>
          
          <div className="flex gap-4 items-start pl-2">
            <div className="w-1 h-12 bg-[#c62828] shrink-0 mt-1" />
            <p className="text-2xl text-[#c62828] font-serif italic">
              "Every ship needs a crew. Every crew needs a mission."
            </p>
          </div>
          
          <p className="text-[#0a192f]/70 text-lg max-w-2xl leading-relaxed pb-4">
            Review the intelligently assembled crews ready for deployment. The algorithmic engine has finalized compatibility, balancing skills, experience, and role fulfillment.
          </p>
          
          <div className="flex gap-4 pb-8">
            <Button render={<Link href="/davy-back" />} className="bg-[#da2528] hover:bg-[#b71c1c] text-white rounded font-bold tracking-widest uppercase text-xs px-8 h-12 shadow-[0_4px_14px_0_rgba(218,37,40,0.39)]">
              <Anchor className="w-4 h-4 mr-2" /> FORM NEW CREWS
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t border-[#e6e0d3] mb-8">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em] mb-3">
          <Ship className="w-4 h-4 text-[#d4af37]" />
          <span>NAVAL REGISTRY // ASSEMBLED FLEETS</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-[#0a192f] font-serif uppercase tracking-tight mb-2">ACTIVE FLEETS</h2>
            <p className="text-[#0a192f]/60 text-lg font-serif italic">"Crews formed through verified compatibility."</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-72 bg-[#e6e0d3]/30 animate-pulse rounded-none" />)}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-none border border-[#e6e0d3] shadow-sm relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at center, #0a192f 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="w-20 h-20 bg-[#fdfbf7] text-[#0a192f] rounded-none border border-[#e6e0d3] flex items-center justify-center mb-6 relative z-10 shadow-sm rotate-3">
            <Ship className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#0a192f] mb-3 relative z-10">No crews assembled.</h3>
          <p className="text-[#0a192f]/60 mb-8 max-w-md mx-auto relative z-10 text-lg">Proceed to the Davy Back to initiate the compatibility matching engine.</p>
          <div className="relative z-10 shadow-lg">
            <Button render={<Link href="/davy-back" />} className="bg-[#c62828] hover:bg-[#a01f1f] text-white font-bold rounded-none h-12 px-8 uppercase tracking-widest text-[10px]">
              Proceed to Davy Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map(t => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      )}
    </div>
  );
}
