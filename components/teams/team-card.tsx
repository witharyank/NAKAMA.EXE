import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crosshair, Star } from "lucide-react";

export function TeamCard({ team }: { team: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-white border-slate-200 h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-900 text-white">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl font-bold leading-tight text-white">{team.name}</CardTitle>
            {team.assignedChallenge && (
              <p className="text-sm font-medium text-slate-300 mt-1 line-clamp-1">
                Mission: {team.assignedChallenge.title}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-2xl font-bold text-accent">{Math.round(team.compatibilityScore || 0)}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Match Score</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 flex-1 space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Crew Members ({team.members?.length || 0})
          </h4>
          <div className="space-y-3">
            {team.members?.map((member: any) => (
              <div key={member.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                <span className="font-medium text-slate-800 text-sm">{member.name}</span>
                <Badge variant="secondary" className="text-[10px] bg-slate-200 text-slate-600">{member.preferredRole}</Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Star className="w-3 h-3 text-accent" /> Skill Coverage
            </h4>
            <div className="flex flex-wrap gap-1">
              {team.skillCoverage?.map((s: string, i: number) => (
                <span key={i} className="text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-primary" /> Role Coverage
            </h4>
            <div className="flex flex-wrap gap-1">
              {team.roleCoverage?.map((r: string, i: number) => (
                <span key={i} className="text-xs text-slate-600 bg-primary/10 text-primary px-1.5 py-0.5 rounded">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
