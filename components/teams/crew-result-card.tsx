"use client";
import { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crosshair, Star, ChevronDown, ChevronUp, Anchor } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CrewResultCard({ team, delay = 0 }: { team: any, delay?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [expanded, setExpanded] = useState(false);

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

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Card Entrance
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
      { opacity: 1, y: 0, duration: 0.8, delay, ease: "power3.out" }
    );

    const targetScore = Math.round(team.compatibilityScore || 0);
    const scoreObj = { val: 0 };
    
    if (prefersReducedMotion) {
      if (scoreRef.current) scoreRef.current.innerText = targetScore.toString();
      if (ringRef.current) ringRef.current.style.strokeDashoffset = `${100 - targetScore}`;
    } else {
      // Score Count-up
      gsap.to(scoreObj, {
        val: targetScore,
        duration: 1.5,
        delay: delay + 0.3,
        ease: "power2.out",
        onUpdate: () => {
          if (scoreRef.current) {
            scoreRef.current.innerText = Math.round(scoreObj.val).toString();
          }
        }
      });

      // SVG Ring fill
      gsap.fromTo(ringRef.current,
        { strokeDashoffset: 100 },
        { strokeDashoffset: 100 - targetScore, duration: 1.5, delay: delay + 0.3, ease: "power2.out" }
      );
    }
  }, { scope: cardRef });

  return (
    <Card ref={cardRef} className="opacity-0 group relative bg-[#fdfbf7] border border-[#e6e0d3] h-full flex flex-col overflow-hidden rounded-none shadow-lg">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#c62828]" />
      
      <CardHeader className="pb-6 pt-6 border-b border-[#e6e0d3] bg-[#0a192f] text-white relative overflow-hidden px-6">
        <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
          <CompassIcon className="w-48 h-48" />
        </div>
        
        <div className="flex justify-between items-start gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Anchor className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Assembled Fleet</span>
            </div>
            <CardTitle className="text-3xl font-black leading-none text-white font-serif tracking-tight">{team.name}</CardTitle>
            {team.assignedChallenge && (
              <p className="text-xs font-medium text-[#fdfbf7]/60 mt-3 font-serif italic max-w-[200px] truncate">
                Target: <span className="text-[#fdfbf7] not-italic font-sans font-bold tracking-widest uppercase">{team.assignedChallenge.title}</span>
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center shrink-0 relative w-16 h-16 bg-[#d4af37]/10 backdrop-blur-sm rounded-none border border-[#d4af37]/30 transform rotate-3">
            <svg viewBox="0 0 36 36" className="w-16 h-16 absolute inset-0 -rotate-90">
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="rgba(212,175,55,0.1)" strokeWidth="3" />
              <circle 
                ref={ringRef}
                cx="18" cy="18" r="15.91549430918954" 
                fill="transparent" 
                stroke="#d4af37" 
                strokeWidth="3" 
                strokeDasharray="100 100" 
                strokeDashoffset="100" 
                className="transition-all duration-200"
              />
            </svg>
            <div className="flex flex-col items-center justify-center relative z-10">
              <span ref={scoreRef} className="text-xl font-black text-[#d4af37] leading-none">0</span>
            </div>
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
              <div key={member.id} className="flex items-center gap-3 group/member p-2 border border-[#e6e0d3] hover:border-[#0a192f]/20 bg-white transition-colors">
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
        
        <div className="pt-4 border-t border-[#e6e0d3]">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-[10px] font-bold text-[#0a192f] uppercase tracking-[0.25em] hover:text-[#c62828] transition-colors py-2 focus:outline-none"
            aria-expanded={expanded}
          >
            Algorithmic Synergy
            {expanded ? <ChevronUp className="w-4 h-4 text-[#c62828]" /> : <ChevronDown className="w-4 h-4 text-[#0a192f]/40" />}
          </button>
          
          {expanded && (
            <div className="mt-5 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200 pb-2">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <h4 className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-[#d4af37]" /> Skill Coverage
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {skillCoverage.length > 0 ? skillCoverage.map((s: string, i: number) => (
                      <span key={i} className="text-[9px] font-bold text-[#0a192f] bg-white border border-[#e6e0d3] px-2 py-0.5">{s}</span>
                    )) : <span className="text-[10px] text-[#0a192f]/40 font-serif italic">N/A</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                    <Crosshair className="w-3 h-3 text-[#c62828]" /> Role Coverage
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {roleCoverage.length > 0 ? roleCoverage.map((r: string, i: number) => (
                      <span key={i} className="text-[9px] font-bold uppercase tracking-[0.1em] text-white bg-[#0a192f] px-2 py-0.5">{r}</span>
                    )) : <span className="text-[10px] text-[#0a192f]/40 font-serif italic">N/A</span>}
                  </div>
                </div>
              </div>
              <ul className="text-xs text-[#0a192f]/70 space-y-2 bg-white p-4 border border-[#e6e0d3]">
                <li className="flex items-start gap-2">
                  <span className="text-[#c62828] font-bold mt-0.5">✓</span> 
                  <span className="leading-tight">{skillCoverage.length >= 4 ? "Strong skill distribution perfectly aligned with mission." : "Baseline skill evaluation passed."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c62828] font-bold mt-0.5">✓</span> 
                  <span className="leading-tight">{roleCoverage.length >= 4 ? "Key roles fulfilled for maximum efficiency." : "Roles structured adequately for the challenge."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c62828] font-bold mt-0.5">✓</span> 
                  <span className="leading-tight">Experience levels logically balanced to prevent crew volatility.</span>
                </li>
              </ul>
            </div>
          )}
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
