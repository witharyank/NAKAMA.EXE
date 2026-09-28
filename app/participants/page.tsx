"use client";
import { useEffect, useState } from 'react';
import { ParticipantCard } from '@/components/participants/participant-card';
import { ParticipantGridCard } from '@/components/participants/participant-grid-card';
import { ParticipantDossier } from '@/components/participants/participant-dossier';
import { toast } from 'sonner';
import { Anchor, Search, Filter, Plus } from 'lucide-react';
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

  const featured = participants.slice(0, 3);
  const others = participants.slice(3);

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 pb-24 px-6 relative">
      
      {/* ── TOP SECTION: WANTED BOARD (Screenshot 2) ── */}
      <div className="w-full max-w-[1200px] flex flex-col items-center mb-16">
        <div className="bg-white/60 px-4 py-1.5 rounded-full border border-white/40 mb-6 flex items-center gap-2">
          <Anchor className="w-3 h-3 text-[#0a192f]" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#0a192f]">NAKAMA ARCHIVES // GRAND LINE</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-black text-[#0a192f] mb-4 text-center tracking-tight">
          AVAILABLE CREW MEMBERS
        </h1>
        <p className="text-[#0a192f]/70 text-sm md:text-base text-center max-w-2xl mb-12">
          Review verified skills, combat-ready operational roles, and crew compatibility before dispatching your recruitment invitation.
        </p>

        {/* Wooden Board Container */}
        <div className="w-full bg-[#6a422d] rounded-3xl p-8 md:p-12 shadow-[inset_0_0_60px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.3)] relative border-4 border-[#523120]">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {loading ? (
               [1, 2, 3].map(i => <div key={i} className="h-[400px] bg-[#f5e6c8]/10 animate-pulse rounded" />)
            ) : featured.map((p, i) => (
              <div key={p.id} className={`transform ${i === 0 ? '-rotate-2' : i === 1 ? 'scale-105 z-10' : 'rotate-2'} transition-transform hover:rotate-0 hover:scale-105 duration-300 relative`}>
                 {/* Pin */}
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4af37] border border-[#a67c00] shadow-md z-20" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)' }} />
                 {/* Top Tactical Priority badge for center */}
                 {i === 1 && (
                   <div className="absolute -top-3 -left-4 bg-[#da2528] text-white text-[8px] font-black tracking-widest px-3 py-1 uppercase border border-[#b71c1c] shadow-md z-20">
                     TOP TACTICAL PRIORITY
                   </div>
                 )}
                 <ParticipantCard 
                   participant={p} 
                   onClick={() => setSelectedParticipant(p)}
                   isFeatured={true}
                 />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: PARTICIPANT DISCOVERY (Screenshot 3) ── */}
      <div className="w-full max-w-[1400px] bg-[#fdfbf7] rounded-3xl shadow-xl border border-white p-8 md:p-12">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
           <div>
             <div className="bg-[#fce8e8] text-[#da2528] border border-[#da2528]/20 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-4">
               <div className="w-1.5 h-1.5 bg-[#da2528] rounded-full" /> RECRUITMENT DIRECTORY // GRAND LINE FLEET CARDS
             </div>
             <h2 className="text-4xl md:text-5xl font-serif font-black text-[#0a192f] tracking-tight flex items-center gap-3">
               FIND YOUR NAKAMA
               <div className="w-8 h-8 rounded-full bg-[#d4af37] text-white flex items-center justify-center text-sm shadow-inner">
                 <Search className="w-4 h-4" />
               </div>
             </h2>
             <p className="text-[#0a192f]/70 text-sm mt-3 max-w-xl">
               Discover crewmates by skills, interests and preferred crew roles. Calibrate your Log Pose and assemble an invincible armada before crossing the calm belt.
             </p>
           </div>
           
           <Button className="bg-[#da2528] hover:bg-[#b71c1c] text-white rounded-full font-bold tracking-widest uppercase text-[10px] px-6 h-12 shadow-[0_4px_14px_0_rgba(218,37,40,0.39)] shrink-0 transition-transform hover:-translate-y-0.5">
             <Plus className="w-4 h-4 mr-2" /> ADD PARTICIPANT
           </Button>
         </div>

         {/* Filter Bar */}
         <div className="flex flex-col md:flex-row gap-4 mb-10 pb-6 border-b border-[#e6e0d3]">
           <div className="flex-1 relative">
             <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#0a192f]/40" />
             <input 
               type="text" 
               placeholder="Search by name, skill, or interest..." 
               className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e6e0d3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5f66]/20"
             />
           </div>
           <div className="flex gap-2">
             <Button variant="outline" className="bg-white border-[#e6e0d3] text-[#0a192f] rounded-xl text-[10px] font-bold tracking-wider uppercase h-[46px]">ALL CREW ROLES</Button>
             <Button variant="outline" className="bg-white border-[#e6e0d3] text-[#0a192f] rounded-xl text-[10px] font-bold tracking-wider uppercase h-[46px]">ALL TECHNICAL SKILLS</Button>
             <Button variant="outline" className="bg-white border-[#e6e0d3] text-[#0a192f] rounded-xl text-[10px] font-bold tracking-wider uppercase h-[46px]">ALL INTEREST DOMAINS</Button>
             <Button variant="outline" className="bg-[#e0f2f1] border-[#0d5f66]/20 text-[#0d5f66] rounded-xl text-[10px] font-bold tracking-wider uppercase h-[46px]">
               <Filter className="w-3 h-3 mr-2" /> NAKAMA AVAILABLE // MATCH: ON
             </Button>
           </div>
         </div>

         {/* Grid */}
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />)}
            </div>
         ) : others.length === 0 ? (
           <div className="text-center py-20">
             <p className="text-[#0a192f]/50">No additional candidates found.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {others.map(p => (
               <ParticipantGridCard 
                 key={p.id} 
                 participant={p} 
                 onClick={() => setSelectedParticipant(p)} 
               />
             ))}
           </div>
         )}
      </div>

      <ParticipantDossier
        participant={selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
      />
    </div>
  );
}
