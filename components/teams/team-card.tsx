import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crosshair, Star, Anchor } from "lucide-react";

export function TeamCard({ team }: { team: any }) {
  const safeParse = (str: string | null | undefined): string[] => {
    if (!str) return [];
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const skillCoverage = safeParse(team.skillCoverage);
  const roleCoverage = safeParse(team.roleCoverage);

  return (
    <Card className="group relative hover:shadow-2xl transition-all duration-500 bg-[#fdfbf7] border border-[#e6e0d3] h-full flex flex-col overflow-hidden rounded-none">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#c62828] group-hover:bg-[#d4af37] transition-colors" />
      
      <CardHeader className="pb-6 pt-6 border-b border-[#e6e0d3] bg-[#0a192f] text-white relative z-10 px-6 overflow-hidden">
        <div className="absolute -right-6 -top-6 opacity-10 group-hover:rotate-45 transition-transform duration-1000 pointer-events-none">
          <CompassIcon className="w-32 h-32" />
        </div>
        
        <div className="flex justify-between items-start gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Anchor className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Assembled Fleet</span>
            </div>
            <CardTitle className="text-3xl font-black text-white font-serif leading-none tracking-tight">{team.name}</CardTitle>
            {team.assignedChallenge && (
              <p className="text-xs font-medium text-[#fdfbf7]/60 mt-3 font-serif italic max-w-[200px] truncate">
                Target: <span className="text-[#fdfbf7] not-italic font-sans font-bold tracking-widest uppercase">{team.assignedChallenge.title}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center shrink-0 w-14 h-14 border-2 border-[#d4af37]/50 rounded-none bg-white/5 shadow-inner transform rotate-3 group-hover:rotate-0 transition-transform">
            <span className="text-2xl font-black text-[#d4af37] leading-none">{Math.round(team.compatibilityScore || 0)}</span>
            <span className="text-[7px] text-white/50 tracking-[0.2em] uppercase mt-1">Match</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 px-6 pb-6 flex-1 space-y-6 relative z-10 bg-[#fdfbf7]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[9px] font-bold text-[#0a192f]/50 uppercase tracking-[0.25em] flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#c62828]" /> Roster ({team.members?.length || 0})
            </h4>
          </div>
          <div className="space-y-3">
            {team.members?.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 group/member p-2 border border-transparent hover:border-[#e6e0d3] hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-full border border-[#0a192f]/20 overflow-hidden bg-[#e6e0d3] shrink-0">
                  <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=f5e6c8`} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0a192f] text-sm font-serif truncate">{member.name}</p>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#0a192f]/60 truncate">{member.preferredRole}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-[#e6e0d3] space-y-4">
          <div>
            <h4 className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <Star className="w-3 h-3 text-[#d4af37]" /> Skill Coverage
            </h4>
            <div className="flex flex-wrap gap-1">
              {skillCoverage.map((s: string, i: number) => (
                <span key={i} className="text-[9px] font-bold text-[#0a192f] bg-white border border-[#e6e0d3] px-2 py-0.5">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <Crosshair className="w-3 h-3 text-[#c62828]" /> Role Coverage
            </h4>
            <div className="flex flex-wrap gap-1">
              {roleCoverage.map((r: string, i: number) => (
                <span key={i} className="text-[9px] font-bold uppercase tracking-[0.1em] text-white bg-[#0a192f] px-2 py-0.5">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
