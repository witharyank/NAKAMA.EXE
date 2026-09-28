import { ChallengeData } from "@/lib/matching";
import { Users, Clock, ShieldCheck, Plus, ArrowRight } from "lucide-react";

interface ChallengeCardProps {
  challenge: ChallengeData & { title: string; description: string; difficulty: string };
  onClick?: () => void;
  isFeatured?: boolean;
}

export function ChallengeCard({ challenge, onClick, isFeatured }: ChallengeCardProps) {
  const isHard = challenge.difficulty.toLowerCase() === 'hard';
  
  // Fake affinity based on difficulty/size to mimic the screenshot
  const affinity = isHard ? 92 : 95;
  const time = isHard ? '48h' : '24h';

  return (
    <div
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={`group relative hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-[#ebf8f9] border border-white/60 p-6 flex flex-col rounded-3xl cursor-pointer ${isFeatured ? 'md:col-span-2 lg:col-span-3' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl">🏝️</span>
        <div className={`text-[9px] font-black uppercase tracking-widest ${isHard ? 'text-[#da2528]' : 'text-[#0d5f66]'}`}>
          {challenge.difficulty} // {isHard ? 'YONKO CLASS' : 'GRAND LINE'}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-[#0a192f] mb-3">{challenge.title}</h3>
      <p className="text-[#0a192f]/70 text-sm leading-relaxed mb-6 min-h-[60px]">
        {challenge.description}
      </p>
      
      <div className="space-y-3 mb-8 text-[11px] font-bold text-[#0a192f] tracking-wide">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#0a192f]/50" /> {time} Voyage Duration
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[#0a192f]/50" /> Optimal Crew: {challenge.teamSize} Sailors
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0a192f]/50" /> Match Affinity: {affinity}%
        </div>
      </div>
      
      <div className="mt-auto">
        <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
          isHard 
            ? 'bg-[#da2528] hover:bg-[#b71c1c] text-white shadow-md' 
            : 'bg-white hover:bg-[#0d5f66] hover:text-white text-[#0d5f66] shadow-sm'
        }`}>
          SET COURSE <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
