"use client";
import { useRef } from "react";
import { Users, Crosshair, Star, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CrewResultCard({ team, delay = 0 }: { team: any, delay?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

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
  const members = team.members || [];
  
  // Fake stats based on team data to match UI metrics
  const roleMatch = roleCoverage.length >= 4 ? 100 : Math.round((roleCoverage.length / 5) * 100);
  const skillSyn = Math.min(100, 70 + skillCoverage.length * 5);
  const challengeMatch = Math.round(team.compatibilityScore || 0);
  const clinicalPace = Math.min(100, 60 + members.length * 8);

  useGSAP(() => {
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay, ease: "power3.out" }
    );
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="opacity-0 bg-[#fdfbf7] border border-white/60 rounded-[32px] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center w-full max-w-[1200px] mx-auto mb-16">
      
      {/* Top Header */}
      <div className="w-full flex justify-between items-center mb-16">
        <div className="flex bg-[#0a192f] rounded-full overflow-hidden text-[9px] font-bold uppercase tracking-widest text-white shadow-md">
          <div className="px-4 py-2 bg-[#0a192f]">MODE:</div>
          <div className="px-4 py-2 bg-[#0d5f66]">Balanced</div>
          <div className="px-4 py-2 hover:bg-[#0a192f]/80 cursor-pointer transition-colors">Skill Focused</div>
          <div className="px-4 py-2 hover:bg-[#0a192f]/80 cursor-pointer transition-colors">Role Focused</div>
        </div>
        
        <Link href="/fleets" className="bg-[#da2528] hover:bg-[#b71c1c] text-white rounded-xl font-bold tracking-widest uppercase text-[10px] px-6 py-3 shadow-[0_4px_14px_0_rgba(218,37,40,0.39)] transition-transform hover:-translate-y-0.5 flex items-center gap-2">
          <Layers className="w-4 h-4" /> ASSEMBLE THIS CREW <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      {/* Radar Visualization */}
      <div className="relative w-[600px] h-[400px] flex items-center justify-center mb-12">
        {/* Hexagon SVG */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-80">
          {/* Outer Hexagon */}
          <polygon points="200,50 330,125 330,275 200,350 70,275 70,125" fill="#e0f2f1" stroke="#0d5f66" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
          <polygon points="200,50 330,125 330,275 200,350 70,275 70,125" fill="none" stroke="#0d5f66" strokeWidth="1.5" />
          
          {/* Inner Hexagon */}
          <polygon points="200,125 265,162 265,237 200,275 135,237 135,162" fill="none" stroke="#0d5f66" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
          
          {/* Connecting Lines */}
          <line x1="200" y1="200" x2="200" y2="50" stroke="#0d5f66" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
          <line x1="200" y1="200" x2="330" y2="125" stroke="#0d5f66" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
          <line x1="200" y1="200" x2="330" y2="275" stroke="#0d5f66" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
          <line x1="200" y1="200" x2="200" y2="350" stroke="#0d5f66" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
          <line x1="200" y1="200" x2="70" y2="275" stroke="#0d5f66" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
          <line x1="200" y1="200" x2="70" y2="125" stroke="#0d5f66" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
        </svg>
        
        {/* Central Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white border-4 border-[#e6e0d3] flex items-center justify-center shadow-lg relative z-10 before:absolute before:inset-[-8px] before:rounded-full before:border before:border-[#d4af37]/40">
             <Star className="w-6 h-6 text-[#da2528]" />
          </div>
          <span className="mt-2 text-[9px] font-bold text-[#0a192f] uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm border border-white/40">COMMAND TIER</span>
        </div>
        
        {/* Dynamic Outer Nodes */}
        {members.map((member: any, i: number) => {
          // Positions for up to 5 members forming a pentagon-like layout or distributing on the hex
          const positions = [
            { top: '5%', left: '50%' },     // Top
            { top: '30%', left: '80%' },    // Top Right
            { top: '75%', left: '75%' },    // Bottom Right
            { top: '90%', left: '50%' },    // Bottom
            { top: '75%', left: '25%' },    // Bottom Left
            { top: '30%', left: '20%' },    // Top Left
          ];
          const pos = positions[i % positions.length];
          
          return (
            <div key={member.id} className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 z-20" style={{ top: pos.top, left: pos.left }}>
              <div className="w-12 h-12 rounded-[14px] bg-white border border-[#e6e0d3] flex items-center justify-center shadow-md mb-2 overflow-hidden">
                <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=f5e6c8`} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] font-bold text-[#0a192f] uppercase tracking-widest bg-white px-2 py-1 rounded shadow-sm border border-[#e6e0d3]">
                {member.name.split(' ')[0]} <span className="text-[#0a192f]/40 mx-0.5">|</span> <span className="text-[#0d5f66]">{member.preferredRole.substring(0, 4)}</span>
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Revealed Crew Block */}
      <div className="bg-white border border-[#e6e0d3] rounded-xl px-12 py-6 text-center shadow-sm w-full max-w-[700px] mb-12">
        <p className="text-[10px] font-bold text-[#0d5f66] uppercase tracking-[0.3em] mb-1">REVEALED CREW FORMATION</p>
        <h2 className="text-2xl font-serif font-black text-[#da2528] tracking-widest uppercase mb-1">{team.name}</h2>
        <p className="text-[10px] font-bold text-[#0a192f]/60 uppercase tracking-widest">
          {members.length}-Rank Archetype — Matched for {team.assignedChallenge?.title || "Unknown"} Challenge
        </p>
      </div>
      
      {/* Metrics Row */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "CLINICAL PACE", val: clinicalPace, color: "#0d5f66" },
          { label: "ROLE COVERAGE", val: roleMatch, color: "#da2528" },
          { label: "SKILL SYNERGY", val: skillSyn, color: "#d4af37" },
          { label: "CHALLENGE MATCH", val: challengeMatch, color: "#0a192f" }
        ].map((metric, i) => (
          <div key={i} className="bg-white border border-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <p className="text-[9px] font-bold text-[#0a192f] uppercase tracking-[0.2em] mb-3">{metric.label}</p>
            <p className={`text-3xl font-serif font-black mb-3`} style={{ color: metric.color }}>{metric.val}%</p>
            <div className="w-full h-1.5 bg-[#f5e6c8] rounded-full overflow-hidden">
               <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${metric.val}%`, backgroundColor: metric.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
