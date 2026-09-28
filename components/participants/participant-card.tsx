import { Card, CardContent } from "@/components/ui/card";
import { ParticipantData } from "@/lib/matching";

interface ParticipantCardProps {
  participant: ParticipantData & { name: string; email?: string | null };
  onClick?: () => void;
}

export function ParticipantCard({ participant, onClick }: ParticipantCardProps) {
  // Use DiceBear for an anime-style visual fallback based on the participant's name
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(participant.name)}&backgroundColor=f5e6c8`;
  
  return (
    <Card
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={`group relative transition-all duration-500 bg-[#fdfbf7] border border-[#e6e0d3] overflow-hidden rounded-none shadow-md hover:shadow-xl hover:-translate-y-2 flex flex-col items-center pt-8 pb-4 px-6${onClick ? " cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#da2528] focus-visible:ring-offset-2" : ""}`}
    >
      {/* Corner marks */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-[#0a192f] opacity-40" />
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-[#0a192f] opacity-40" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-[#0a192f] opacity-40" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-[#0a192f] opacity-40" />
      
      {/* Wanted Header */}
      <div className="text-center w-full mb-4">
        <h2 className="text-4xl font-black text-[#0a192f] font-serif tracking-[0.15em] leading-none mb-2">
          WANTED
        </h2>
        <p className="text-[7px] font-bold text-[#da2528] uppercase tracking-[0.3em]">
          DEAD OR ALIVE // HACKATHON REGISTRY
        </p>
      </div>
      
      {/* Image Area */}
      <div className="relative w-full aspect-[3/4] mb-6 border-[3px] border-[#0a192f] bg-[#0a192f] overflow-hidden group-hover:border-[#da2528] transition-colors">
        <img 
          src={avatarUrl} 
          alt={participant.name} 
          className="w-full h-full object-cover object-center opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
        />
        {/* Angled Stamp */}
        <div className="absolute top-4 right-[-10px] bg-[#da2528] text-white font-black text-[9px] uppercase tracking-widest px-8 py-1 rotate-[35deg] shadow-lg border border-[#b71c1c]">
          {participant.experienceLevel > 3 ? "HIGH THREAT" : "ACTIVE"}
        </div>
        {/* Hover hint overlay */}
        {onClick && (
          <div className="absolute inset-0 bg-[#0a192f]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] border border-white/40 px-4 py-2">
              OPEN DOSSIER
            </p>
          </div>
        )}
      </div>
      
      {/* Information Area */}
      <CardContent className="w-full p-0 flex flex-col items-center text-center space-y-4">
        <div>
          <h3 className="text-2xl font-black text-[#0a192f] font-serif tracking-tight leading-none mb-1">
            {participant.name}
          </h3>
          <p className="text-[10px] font-bold text-[#0d5f66] uppercase tracking-[0.2em]">
            ROLE: {participant.preferredRole}
          </p>
        </div>
        
        <div className="w-full h-px bg-[#e6e0d3] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fdfbf7] px-2 text-[#0a192f]/40 text-xs">★</div>
        </div>
        
        <div className="w-full">
          <p className="text-[8px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em] mb-2">KNOWN SKILLS</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {participant.skills.length > 0 ? participant.skills.map((skill, i) => (
              <span key={i} className="text-[9px] font-bold text-[#0a192f] bg-white border border-[#e6e0d3] px-2 py-0.5 uppercase tracking-wider">{skill}</span>
            )) : <span className="text-[9px] text-[#0a192f]/40 italic">Unknown</span>}
          </div>
        </div>
        
        {participant.interests && participant.interests.length > 0 && (
          <div className="w-full">
            <p className="text-[8px] font-bold text-[#0a192f]/60 uppercase tracking-[0.2em] mb-1.5">OBJECTIVES</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {participant.interests.map((interest, i) => (
                <span key={i} className="text-[8px] text-[#0a192f]/60 uppercase tracking-widest">{interest}{i < participant.interests!.length - 1 ? " • " : ""}</span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
