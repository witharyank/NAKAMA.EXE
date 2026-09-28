import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Crosshair, Star, Anchor, Shield } from "lucide-react";

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
    <Card className="group relative hover:shadow-2xl transition-all duration-300 bg-white border border-[#e6e0d3] h-full flex flex-col overflow-hidden rounded-3xl">
      <CardHeader className="pb-4 pt-6 border-b border-[#e6e0d3] bg-[#fdfbf7] relative z-10 px-6">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="flex items-center gap-1.5 bg-[#ebf8f9] text-[#0d5f66] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#0d5f66]/20">
            <Anchor className="w-3 h-3" /> FLEET UNIT
          </div>
          <div className="bg-[#0a192f] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
            {Math.round(team.compatibilityScore || 0)}% SYNERGY
          </div>
        </div>
        <CardTitle className="text-2xl font-black text-[#0a192f] font-serif leading-none tracking-tight mt-2">{team.name}</CardTitle>
        {team.assignedChallenge && (
          <p className="text-xs font-medium text-[#0a192f]/60 mt-1 font-serif italic truncate">
            Target: <span className="text-[#0a192f] not-italic font-sans font-bold tracking-widest uppercase">{team.assignedChallenge.title}</span>
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-6 px-6 pb-6 flex-1 space-y-6 relative z-10">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[9px] font-bold text-[#0a192f]/50 uppercase tracking-[0.25em] flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#da2528]" /> Deployed Roster ({team.members?.length || 0})
            </h4>
          </div>
          <div className="space-y-3">
            {team.members?.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 group/member p-2 rounded-xl hover:bg-[#fdfbf7] transition-colors border border-transparent hover:border-[#e6e0d3]">
                <div className="w-10 h-10 rounded-full border border-[#e6e0d3] overflow-hidden bg-[#e6e0d3] shrink-0">
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
              <Star className="w-3 h-3 text-[#d4af37]" /> Core Competencies
            </h4>
            <div className="flex flex-wrap gap-1">
              {skillCoverage.slice(0, 5).map((s: string, i: number) => (
                <span key={i} className="text-[9px] font-bold text-[#0a192f] bg-[#fdfbf7] border border-[#e6e0d3] px-2 py-0.5 rounded shadow-sm">{s}</span>
              ))}
              {skillCoverage.length > 5 && (
                <span className="text-[9px] font-bold text-[#0a192f] bg-[#fdfbf7] border border-[#e6e0d3] px-2 py-0.5 rounded shadow-sm">+{skillCoverage.length - 5}</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#0d5f66]" /> Structural Roles
            </h4>
            <div className="flex flex-wrap gap-1">
              {roleCoverage.slice(0, 4).map((r: string, i: number) => (
                <span key={i} className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#0d5f66] bg-[#ebf8f9] px-2 py-0.5 rounded">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
