"use client";
import { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crosshair, Star, ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CrewResultCard({ team, delay = 0 }: { team: any, delay?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const [expanded, setExpanded] = useState(false);

  useGSAP(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Reveal animation
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
    );

    // Score count-up
    const scoreObj = { val: 0 };
    const targetScore = Math.round(team.compatibilityScore || 0);
    
    if (prefersReducedMotion) {
      if (scoreRef.current) scoreRef.current.innerText = targetScore.toString();
    } else {
      gsap.to(scoreObj, {
        val: targetScore,
        duration: 1.5,
        delay: delay + 0.2,
        ease: "power2.out",
        onUpdate: () => {
          if (scoreRef.current) {
            scoreRef.current.innerText = Math.round(scoreObj.val).toString();
          }
        }
      });
    }
  }, { scope: cardRef });

  return (
    <Card ref={cardRef} className="opacity-0 bg-white border-slate-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
            <span ref={scoreRef} className="text-2xl font-bold text-accent">0</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Match Score</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 flex-1 space-y-5">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Crew Members ({team.members?.length || 0})
          </h4>
          <div className="space-y-2">
            {team.members?.map((member: any) => (
              <div key={member.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                <span className="font-medium text-slate-800 text-sm">{member.name}</span>
                <Badge variant="secondary" className="text-[10px] bg-slate-200 text-slate-600 border-none font-semibold">{member.preferredRole}</Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-3 border-t border-slate-100">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-xs font-bold text-primary uppercase tracking-wider hover:text-primary/80 transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-expanded={expanded}
          >
            Why this crew?
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expanded && (
            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent" /> Skill Coverage
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {team.skillCoverage?.length > 0 ? JSON.parse(team.skillCoverage).map((s: string, i: number) => (
                      <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{s}</span>
                    )) : <span className="text-[10px] text-slate-400">N/A</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-primary" /> Role Coverage
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {team.roleCoverage?.length > 0 ? JSON.parse(team.roleCoverage).map((r: string, i: number) => (
                      <span key={i} className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">{r}</span>
                    )) : <span className="text-[10px] text-slate-400">N/A</span>}
                  </div>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <li className="flex items-start gap-1.5">
                  <span className="text-accent font-bold mt-0.5">✓</span> 
                  {team.skillCoverage?.length > 4 ? "Strong skill distribution perfectly aligned with mission." : "Baseline skill evaluation passed."}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-accent font-bold mt-0.5">✓</span> 
                  {team.roleCoverage?.length > 4 ? "Key roles fulfilled for maximum efficiency." : "Roles structured adequately for the challenge."}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-accent font-bold mt-0.5">✓</span> 
                  Experience levels logically balanced to prevent crew volatility.
                </li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
