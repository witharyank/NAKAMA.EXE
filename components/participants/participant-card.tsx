import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParticipantData } from "@/lib/matching";

export function ParticipantCard({ participant }: { participant: ParticipantData & { name: string } }) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-white border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">{participant.name}</CardTitle>
            <p className="text-sm font-medium text-primary mt-1">{participant.preferredRole}</p>
          </div>
          <Badge variant="secondary" className="bg-slate-200 text-slate-800 border-none font-semibold">Lvl {participant.experienceLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {participant.skills.length > 0 ? participant.skills.map((skill, i) => (
              <Badge key={i} variant="outline" className="text-slate-600 border-slate-200 bg-white">{skill}</Badge>
            )) : <span className="text-sm text-slate-400 italic">None listed</span>}
          </div>
        </div>
        {participant.interests && participant.interests.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {participant.interests.map((interest, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-500 font-normal hover:bg-slate-200">{interest}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
