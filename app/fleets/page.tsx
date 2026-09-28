"use client";
import { useEffect, useState } from 'react';
import { TeamCard } from '@/components/teams/team-card';
import { toast } from 'sonner';
import { Ship, Anchor, Activity, Radio } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col pt-12 pb-24 px-6 md:px-12 relative">
      <div className="w-full max-w-[1400px] mx-auto mb-10">
        
        <div className="bg-white/60 px-4 py-1.5 rounded-full border border-white/40 mb-6 flex items-center gap-2 inline-flex">
          <Activity className="w-3 h-3 text-[#da2528]" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#0a192f]">COMMAND DECK // LIVE TELEMETRY</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#0a192f] tracking-tight mb-2">
              FLEET COMMAND
            </h1>
            <p className="text-[#d4af37] text-lg font-serif italic">
              "Every ship needs a crew. Every crew needs a mission."
            </p>
          </div>
          
          <div className="shrink-0 flex gap-4">
            <Link href="/davy-back" className="bg-[#da2528] hover:bg-[#b71c1c] text-white rounded-xl font-bold tracking-widest uppercase text-[10px] px-6 py-3 shadow-md flex items-center gap-2">
              <Radio className="w-3 h-3" /> INITIATE FORMATION
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-white/60 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-[#ebf8f9] text-[#0d5f66] rounded-xl flex items-center justify-center">
                <Ship className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[9px] font-bold uppercase tracking-widest text-[#0a192f]/50">Active Fleets</p>
               <p className="text-3xl font-serif font-black text-[#0a192f]">{teams.length}</p>
             </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-white/60 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-[#fdfbf7] text-[#d4af37] rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[9px] font-bold uppercase tracking-widest text-[#0a192f]/50">Deployed Nakama</p>
               <p className="text-3xl font-serif font-black text-[#0a192f]">{teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}</p>
             </div>
          </div>
          <div className="bg-[#0a192f] rounded-2xl p-6 shadow-sm flex items-center gap-4 text-white relative overflow-hidden">
             <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at right, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
             <div className="w-12 h-12 bg-[#da2528] rounded-xl flex items-center justify-center relative z-10">
                <Anchor className="w-6 h-6" />
             </div>
             <div className="relative z-10">
               <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Average Synergy</p>
               <p className="text-3xl font-serif font-black text-white">
                  {teams.length > 0 ? Math.round(teams.reduce((acc, t) => acc + (t.compatibilityScore || 0), 0) / teams.length) : 0}%
               </p>
             </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-72 bg-white/40 animate-pulse rounded-2xl" />)}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm flex flex-col items-center">
            <Ship className="w-12 h-12 text-[#0a192f]/20 mb-4" />
            <h3 className="text-2xl font-serif font-bold text-[#0a192f] mb-2">No active fleets</h3>
            <p className="text-[#0a192f]/60 max-w-md mx-auto mb-6">Initiate the Davy Back matching engine to form crews.</p>
            <Link href="/davy-back" className="bg-[#0a192f] hover:bg-[#0a192f]/90 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-3">
              Go to Assembly
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(t => (
              <TeamCard key={t.id} team={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
