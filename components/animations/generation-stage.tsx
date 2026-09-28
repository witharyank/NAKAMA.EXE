"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Anchor, Search, GitMerge, Users, CheckCircle2, Loader2 } from "lucide-react";

export function GenerationStage({ 
  onComplete, 
  participantCount 
}: { 
  onComplete: () => void,
  participantCount: number
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<SVGGElement>(null);
  const [status, setStatus] = useState("Preparing the fleet...");
  
  // Cap at 12 nodes max so animation stays clean
  const displayCount = Math.min(Math.max(participantCount, 3), 12);
  const nodes = Array.from({ length: displayCount });

  useGSAP(() => {
    // Accessibility: reduce motion if user prefers
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tl = gsap.timeline({
      onComplete: () => {
        setStatus("Crews ready.");
        setTimeout(onComplete, 600); 
      }
    });

    if (prefersReducedMotion) {
      tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
        .call(() => setStatus("Reading crew strengths..."))
        .to({}, { duration: 0.8 })
        .call(() => setStatus("Finding the right combination..."))
        .to({}, { duration: 0.8 })
        .call(() => setStatus("Forming crews..."));
      return;
    }

    // GSAP Cinematic Sequence
    
    // STEP 1 - PREPARING: Nodes scatter in
    tl.fromTo(nodesRef.current, 
      { 
        opacity: 0, 
        scale: 0, 
        x: () => gsap.utils.random(-120, 120), 
        y: () => gsap.utils.random(-70, 70) 
      },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.7, 
        stagger: 0.04, 
        ease: "back.out(1.5)" 
      }
    );

    // STEP 2 - SCANNING: Pulse
    tl.call(() => setStatus("Reading crew strengths..."))
      .to(nodesRef.current, { 
        scale: 1.15, 
        opacity: 0.7, 
        duration: 0.35, 
        yoyo: true, 
        repeat: 1, 
        stagger: 0.04, 
        ease: "sine.inOut" 
      });

    // STEP 3 - MATCHING: Lines appear, nodes shift slightly
    tl.call(() => setStatus("Finding the right combination..."))
      .to(nodesRef.current, {
        x: () => gsap.utils.random(-80, 80),
        y: () => gsap.utils.random(-50, 50),
        duration: 0.8,
        ease: "power2.inOut"
      })
      .fromTo(linesRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 0.4, scale: 1, duration: 0.4 },
        "-=0.6"
      )
      .to(linesRef.current, { opacity: 0, duration: 0.3 }, "+=0.3");

    // STEP 4 - FORMING: Nodes cluster tightly together
    const clusters = [
      { x: -60, y: -20 },
      { x: 60, y: 20 },
      { x: -40, y: 40 },
      { x: 40, y: -40 }
    ];
    
    tl.call(() => setStatus("Forming crews..."))
      .to(nodesRef.current, {
        x: (index) => clusters[index % clusters.length].x + gsap.utils.random(-10, 10),
        y: (index) => clusters[index % clusters.length].y + gsap.utils.random(-10, 10),
        scale: 0.9,
        duration: 0.7,
        ease: "power3.inOut"
      });
      
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center py-16 relative overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm min-h-[350px]">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at center, #0f766e 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />
      
      {/* Abstract Visualization Canvas */}
      <div className="relative w-full max-w-[320px] h-[180px] flex items-center justify-center mb-10">
        {/* Matching network lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <g ref={linesRef} className="opacity-0 stroke-primary/40 stroke-[1.5]" fill="none">
            <path d="M 60 90 Q 160 30 260 90" />
            <path d="M 90 130 Q 160 170 230 130" />
            <path d="M 110 50 L 210 150" />
            <path d="M 210 50 L 110 150" />
          </g>
        </svg>

        {/* Participant Data Nodes */}
        {nodes.map((_, i) => (
          <div 
            key={i}
            ref={el => { if (el) nodesRef.current[i] = el; }}
            className="absolute w-8 h-8 rounded-full bg-white border-2 border-primary/30 flex items-center justify-center shadow-md z-10"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent/90" />
          </div>
        ))}
      </div>

      {/* Dynamic Accessible Status */}
      <div className="flex flex-col items-center z-10">
        <div className="flex items-center gap-2.5 text-slate-800 font-medium bg-slate-50 px-5 py-2.5 rounded-full border border-slate-200 shadow-sm transition-all duration-300">
          {status === "Preparing the fleet..." && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          {status === "Reading crew strengths..." && <Search className="w-4 h-4 animate-spin-slow text-primary" />}
          {status === "Finding the right combination..." && <GitMerge className="w-4 h-4 animate-bounce text-accent" />}
          {status === "Forming crews..." && <Users className="w-4 h-4 text-primary" />}
          {status === "Crews ready." && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          
          {/* aria-live announces the current step to screen readers automatically */}
          <span aria-live="polite" className="text-sm tracking-tight">{status}</span>
        </div>
      </div>
    </div>
  );
}
