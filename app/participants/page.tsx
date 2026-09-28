"use client";
import { useEffect, useState } from 'react';
import { ParticipantCard } from '@/components/participants/participant-card';
import { ParticipantDossier } from '@/components/participants/participant-dossier';
import { ParticipantForm } from '@/components/participants/participant-form';
import { toast } from 'sonner';
import { Users, Compass, Anchor, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);

  const loadParticipants = async () => {
    try {
      const res = await fetch('/api/participants');
      const json = await res.json();
      if (json.success) {
        setParticipants(json.data);
      } else {
        toast.error('Failed to load participants');
      }
    } catch (e) {
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12 max-w-[1400px]">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-12 mb-16 items-center">
        {/* Left Side: Editorial Typography & Actions */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em]">
            <div className="w-3 h-3 rounded-full bg-[#da2528] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
            <span>BOUNTY REGISTRATION 1524 // PIRATE RECRUITMENT PROTOCOL</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-black text-[#0a192f] font-serif tracking-tight leading-none uppercase">
            THE WANTED <span className="text-[#da2528]">ROSTER</span>
          </h1>
          
          <div className="flex gap-4 items-start pl-2">
            <div className="w-1 h-12 bg-[#d4af37] shrink-0 mt-1" />
            <p className="text-2xl text-[#d4af37] font-serif italic">
              "Recruit the right nakama. Build the perfect crew. Set sail."
            </p>
          </div>
          
          <p className="text-[#0a192f]/70 text-lg max-w-2xl leading-relaxed pb-4">
            Tactical dossiers of elite maritime engineers and architects available for crew integration. Real-time capability mapping across the Grand Line Hackathon Fleet.
          </p>
          
          <div className="flex gap-4 pb-8">
            <Button className="bg-[#da2528] hover:bg-[#b71c1c] text-white rounded font-bold tracking-widest uppercase text-xs px-8 h-12 shadow-[0_4px_14px_0_rgba(218,37,40,0.39)]">
              <Compass className="w-4 h-4 mr-2" /> INSPECT THE ROSTER
            </Button>
            <Button className="bg-[#e0f2f1] hover:bg-[#cbeae8] text-[#0d5f66] rounded font-bold tracking-widest uppercase text-xs px-8 h-12">
              <Anchor className="w-4 h-4 mr-2" /> JOIN THE CREW
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-8 p-6 bg-[#f5e6c8]/30 rounded-xl border border-[#e6e0d3]">
            <div>
              <p className="text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.1em] mb-1">ACTIVE BOUNTIES</p>
              <p className="text-2xl font-serif font-black text-[#da2528]">B 2,450,000,000</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.1em] mb-1">ASSEMBLED FLEETS</p>
              <p className="text-2xl font-serif font-black text-[#0d5f66]">142 Crews</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.1em] mb-1">CURRENT TARGET</p>
              <p className="text-2xl font-serif font-black text-[#d4af37]">All-Blue Grand ...</p>
            </div>
          </div>
        </div>
        
        {/* Right Side: Image Framing */}
        <div className="lg:w-[500px] xl:w-[600px] shrink-0 relative group">
          <div className="bg-[#e0f2f1] rounded-2xl p-4 shadow-xl border-2 border-white transform transition-transform group-hover:scale-[1.01] duration-500">
            {/* Window controls styling */}
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-[9px] font-mono text-[#0d5f66] opacity-70">logPose.sh</span>
              <div className="flex items-center gap-4 text-[9px] font-mono text-[#0d5f66] bg-white/50 px-3 py-1 rounded-full">
                <span>Captain Profile: Captain Kai</span>
                <span className="bg-[#0a192f] text-white px-2 py-0.5 rounded">Rank: Grand Line Voyager</span>
                <span className="text-[#0a192f]/40">Status: Read (Local Terminal)</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#da2528]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0d5f66]/80" />
              </div>
            </div>
            {/* The Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-4 border-[#0a192f] bg-[#0a192f]">
              <img src="/images/luffy.png" alt="Featured Pirate" className="w-full h-full object-cover object-top opacity-90" />
            </div>
          </div>
          
          {/* Floating Label */}
          <div className="absolute -bottom-6 -left-6 bg-white border border-[#e6e0d3] shadow-lg rounded p-4 flex gap-4 max-w-[300px]">
            <div className="bg-[#da2528] w-12 h-12 rounded flex items-center justify-center shrink-0">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-widest mb-1">LOG POSE ENGINE</p>
              <h4 className="text-[#0a192f] font-black tracking-tight leading-none mb-1">GRAND LINE READY</h4>
              <p className="text-[9px] font-mono text-[#0a192f]/40 uppercase truncate">SYNCHRONIZED // 89.4% VECTOR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t border-[#e6e0d3] mb-8">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em] mb-3">
          <Compass className="w-4 h-4 text-[#d4af37]" />
          <span>NAKAMA ARCHIVES // GRAND LINE RECRUITMENT</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-[#0a192f] font-serif uppercase tracking-tight mb-2">AVAILABLE CREW MEMBERS</h2>
            <p className="text-[#0a192f]/60 text-lg font-serif italic">"Review skills, roles and compatibility before assembling your crew."</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-[#0d5f66] text-white px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">ALL BOUNTIES</span>
            <span className="bg-[#e0f2f1] text-[#0d5f66] px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">NAVIGATORS</span>
            <span className="bg-[#e0f2f1] text-[#0d5f66] px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">SHIPWRIGHTS</span>
            <span className="bg-[#e0f2f1] text-[#0d5f66] px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">ARCHITECTS</span>
            <span className="bg-[#e0f2f1] text-[#0d5f66] px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">DOCTORS / ML</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 bg-[#e6e0d3]/30 animate-pulse rounded-none" />)}
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-none border border-[#e6e0d3] shadow-sm relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at center, #0a192f 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="w-20 h-20 bg-[#fdfbf7] text-[#0a192f] rounded-none border border-[#e6e0d3] flex items-center justify-center mb-6 relative z-10 shadow-sm rotate-3">
            <Users className="w-8 h-8 text-[#c62828]" />
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#0a192f] mb-3 relative z-10">The roster is empty.</h3>
          <p className="text-[#0a192f]/60 mb-8 max-w-md mx-auto relative z-10 text-lg">No crew members have been registered. Begin assembling your fleet for the Davy Back match.</p>
          <div className="relative z-10 shadow-lg"><ParticipantForm onCreated={loadParticipants} /></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {participants.map(p => (
            <ParticipantCard
              key={p.id}
              participant={p}
              onClick={() => setSelectedParticipant(p)}
            />
          ))}
        </div>
      )}

      <ParticipantDossier
        participant={selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
      />
    </div>
  );
}
