import { Card, CardContent } from "@/components/ui/card";
import { ParticipantData } from "@/lib/matching";

interface ParticipantCardProps {
  participant: ParticipantData & { name: string; email?: string | null };
  onClick?: () => void;
  isFeatured?: boolean;
}

export function ParticipantCard({ participant, onClick, isFeatured }: ParticipantCardProps) {
  // Use DiceBear for an anime-style visual fallback based on the participant's name
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(participant.name)}&backgroundColor=f5e6c8`;
  
  // Fake bounty based on experience
  const bounty = (participant.experienceLevel * 150000000 + participant.skills.length * 50000000).toLocaleString();
  
  return (
    <Card
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={`group relative transition-all duration-500 bg-[#fdfbf7] overflow-hidden rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 flex flex-col items-center pt-8 pb-6 px-6 border-0 w-full max-w-[340px] mx-auto${onClick ? " cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#da2528] focus-visible:ring-offset-2" : ""}`}
      style={{
         border: '1px solid #e6e0d3',
         boxShadow: '0 10px 25px rgba(0,0,0,0.1), inset 0 0 40px rgba(212,175,55,0.05)'
      }}
    >
      {/* Background paper texture simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Availability badge */}
      <div className="absolute top-4 right-4 z-10 border border-[#c62828] text-[#c62828] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm bg-white/80 backdrop-blur-sm shadow-sm rotate-2">
         AVAILABLE
      </div>
      
      {/* Wanted Header */}
      <div className="text-center w-full mb-5 relative z-10">
        <h2 className="text-4xl font-black text-[#0a192f] font-serif tracking-widest leading-none mb-2">
          WANTED
        </h2>
        <p className="text-[7px] font-bold text-[#da2528] uppercase tracking-[0.3em]">
          DEAD OR ALIVE // NAKAMA ARCHIVES
        </p>
      </div>
      
      {/* Image Area */}
      <div className="relative w-full aspect-square mb-6 border-[3px] border-[#0a192f] bg-[#f5e6c8] overflow-hidden group-hover:border-[#da2528] transition-colors rounded-sm z-10">
        <img 
          src={avatarUrl} 
          alt={participant.name} 
          className="w-full h-full object-cover object-center opacity-95 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
        />
        {/* Hover hint overlay */}
        {onClick && (
          <div className="absolute inset-0 bg-[#0a192f]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] border border-white/40 px-4 py-2 bg-[#0a192f]/40 backdrop-blur-sm rounded">
              OPEN DOSSIER
            </p>
          </div>
        )}
      </div>
      
      {/* Information Area */}
      <CardContent className="w-full p-0 flex flex-col items-center text-center space-y-4 relative z-10">
        <div>
          <h3 className="text-xl font-black text-[#0a192f] font-serif tracking-tight leading-none mb-1.5 uppercase">
            {participant.name}
          </h3>
          <p className="text-[9px] font-bold text-[#0d5f66] uppercase tracking-[0.15em]">
            {participant.preferredRole}
          </p>
        </div>
        
        <div className="w-full">
          <div className="flex flex-wrap gap-1.5 justify-center mt-2 mb-4">
            {participant.skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="text-[9px] font-bold text-[#0a192f] bg-[#f5e6c8]/50 border border-[#d4af37]/40 px-2 py-0.5 rounded shadow-sm">{skill}</span>
            ))}
            {participant.skills.length > 4 && (
               <span className="text-[9px] font-bold text-[#0a192f] bg-[#f5e6c8]/50 border border-[#d4af37]/40 px-2 py-0.5 rounded shadow-sm">+{participant.skills.length - 4}</span>
            )}
          </div>
        </div>
        
        <div className="w-full border-t border-[#e6e0d3] pt-4 mt-2">
          <p className="text-[7px] font-bold text-[#da2528] uppercase tracking-[0.2em] mb-1">BOUNTY DEADLINE</p>
          <p className="text-2xl font-serif font-black text-[#da2528] tracking-tight mb-4">
            B {bounty}
          </p>
          
          <button className={`w-full py-2.5 rounded text-[10px] font-black uppercase tracking-widest text-white transition-colors ${isFeatured && participant.experienceLevel > 3 ? 'bg-[#da2528] hover:bg-[#b71c1c]' : 'bg-[#1a1a1a] hover:bg-[#000000]'}`}>
            INSPECT NAKAMA
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
