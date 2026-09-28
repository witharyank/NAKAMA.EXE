import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChallengeData } from "@/lib/matching";
import { Users, MapPin } from "lucide-react";

export function ChallengeCard({ challenge }: { challenge: ChallengeData & { title: string, description: string, difficulty: string } }) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-white border-slate-200 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800 leading-tight">{challenge.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-accent" /> {challenge.difficulty}
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 bg-white shadow-sm flex items-center gap-1.5 py-1 px-2 text-primary border-primary/20">
            <Users className="w-3.5 h-3.5" /> {challenge.teamSize}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1 space-y-5">
        <p className="text-slate-600 text-sm leading-relaxed">{challenge.description}</p>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {challenge.requiredSkills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 font-normal hover:bg-slate-200">{skill}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Roles</p>
            <div className="flex flex-wrap gap-1.5">
              {challenge.requiredRoles.map((role, i) => (
                <Badge key={i} variant="outline" className="text-primary border-primary/20 bg-primary/5">{role}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
