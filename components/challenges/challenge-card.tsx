import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChallengeData } from "@/lib/matching";
import { Users, Target, Ship } from "lucide-react";

interface ChallengeCardProps {
  challenge: ChallengeData & { title: string; description: string; difficulty: string };
  onClick?: () => void;
}

export function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  return (
    <Card
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={`group relative hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-[#fdfbf7] border border-[#e6e0d3] h-full flex flex-col overflow-hidden rounded-none${onClick ? " cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#da2528] focus-visible:ring-offset-2" : ""}`}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#0a192f] group-hover:bg-[#d4af37] transition-colors" />
      <div className="absolute top-2 left-0 w-full h-px bg-[#c62828]" />
      
      <CardHeader className="pb-6 pt-8 border-b border-[#e6e0d3] bg-[#fdfbf7] relative z-10 px-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#0a192f]/60">
            <Target className="w-3.5 h-3.5 text-[#c62828]" />
            <span>Mission Dossier</span>
          </div>
          <div className="bg-[#e0f2f1] text-[#0d5f66] px-2 py-1 text-[8px] font-bold tracking-widest uppercase border border-[#0d5f66]/20">
            {challenge.difficulty}
          </div>
        </div>
        
        <CardTitle className="text-3xl font-black text-[#0a192f] font-serif leading-none tracking-tight mb-4">{challenge.title}</CardTitle>
        
        <div className="flex items-center gap-3 text-xs text-[#0a192f]/60 font-bold tracking-widest uppercase">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#d4af37]" /> {challenge.teamSize} Crew Required
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 px-6 pb-8 flex-1 space-y-8 relative z-10 bg-white">
        <div className="relative">
          <div className="absolute -left-3 top-0 bottom-0 w-1 bg-[#c62828]/20" />
          <p className="text-[#0a192f] text-sm leading-relaxed font-serif italic pl-2">{challenge.description}</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.25em] mb-3">Required Roles</p>
            <div className="flex flex-wrap gap-2">
              {challenge.requiredRoles.map((role, i) => (
                <span key={i} className="text-[9px] uppercase tracking-widest font-bold text-[#0a192f] bg-[#f5e6c8]/50 border border-[#d4af37] px-2 py-1 flex items-center gap-1.5">
                  <Ship className="w-2.5 h-2.5 text-[#c62828]" /> {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.25em] mb-3">Required Capabilities</p>
            <div className="flex flex-wrap gap-1.5">
              {challenge.requiredSkills.map((skill, i) => (
                <span key={i} className="text-[10px] font-medium text-[#0a192f] bg-[#fdfbf7] border border-[#e6e0d3] px-2 py-0.5 shadow-sm">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Hover overlay hint */}
        {onClick && (
          <div className="absolute inset-0 bg-[#0a192f]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] border border-white/40 px-5 py-2">
              OPEN MISSION BRIEF
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
