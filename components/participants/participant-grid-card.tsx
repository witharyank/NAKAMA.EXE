import { ParticipantData } from "@/lib/matching";
import { Anchor, Search, Plus, MapPin } from "lucide-react";

interface ParticipantGridCardProps {
  participant: ParticipantData & { name: string; email?: string | null };
  onClick?: () => void;
}

export function ParticipantGridCard({ participant, onClick }: ParticipantGridCardProps) {
  // Use DiceBear for an anime-style visual fallback
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(participant.name)}&backgroundColor=f5e6c8`;
  const bounty = (participant.experienceLevel * 150000000 + participant.skills.length * 50000000).toLocaleString();

  return (
    <div 
      className="bg-[#fcf8ef] border border-[#e6e0d3] rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
      onClick={onClick}
    >
      {/* Top badges */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5 text-[#da2528] text-[9px] font-black uppercase tracking-widest">
          <Anchor className="w-3 h-3" />
          ROLE: {participant.preferredRole}
        </div>
        <div className="text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-widest">
          FLEET CANDIDATE
        </div>
      </div>
      
      {/* Image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0a192f] mb-5 border border-[#e6e0d3]">
        <img 
          src={avatarUrl} 
          alt={participant.name} 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute bottom-2 left-2 bg-[#0a192f]/80 backdrop-blur text-white text-[9px] font-mono px-2 py-1 rounded shadow border border-white/10 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#d4af37]" /> B {bounty}
        </div>
      </div>
      
      {/* Info */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-serif font-black text-[#0a192f] tracking-tight uppercase leading-none">
          {participant.name}
        </h3>
        <span className="bg-[#e0f2f1] text-[#0d5f66] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1 shrink-0">
          <Plus className="w-3 h-3" /> RECRUIT
        </span>
      </div>
      
      <p className="text-[#0a192f]/60 text-xs line-clamp-2 mb-5 min-h-[32px]">
        {participant.experienceLevel > 6 ? 'Veteran' : 'Skilled'} {participant.preferredRole} with expertise in {participant.skills.slice(0, 2).join(" and ")}. Ready for Grand Line challenges.
      </p>
      
      {/* Skills */}
      <div className="mt-auto">
        <div className="mb-4">
          <p className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.2em] mb-2">TECHNICAL SKILLS</p>
          <div className="flex flex-wrap gap-1.5">
            {participant.skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="text-[9px] font-bold text-[#0a192f] bg-white border border-[#e6e0d3] px-2 py-0.5 rounded shadow-sm">{skill}</span>
            ))}
            {participant.skills.length > 4 && (
              <span className="text-[9px] font-bold text-[#0a192f] bg-white border border-[#e6e0d3] px-2 py-0.5 rounded shadow-sm">+{participant.skills.length - 4}</span>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.2em] mb-2">DESIRED DOMAINS</p>
          <div className="flex flex-wrap gap-1.5">
            {participant.interests.slice(0, 3).map((interest, i) => (
              <span key={i} className="text-[9px] font-bold text-[#0a192f] bg-white border border-[#e6e0d3] px-2 py-0.5 rounded shadow-sm">{interest}</span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-lg border border-[#0a192f]/20 text-[#0a192f] text-[9px] font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-1.5 bg-transparent">
            <Search className="w-3 h-3" /> INSPECT PROFILE
          </button>
          <button className="flex-1 py-2.5 rounded-lg bg-[#e8cd82] hover:bg-[#d4af37] text-[#0a192f] text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <Anchor className="w-3 h-3" /> SELECT NAKAMA
          </button>
        </div>
      </div>
    </div>
  );
}
