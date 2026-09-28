"use client";
import { useEffect, useRef, useCallback } from "react";
import { X, Anchor, Star, Crosshair, Scroll, Shield, Compass } from "lucide-react";

interface DossierParticipant {
  id: string;
  name: string;
  email?: string | null;
  skills: string[];
  interests: string[];
  preferredRole: string;
  experienceLevel: number;
}

interface ParticipantDossierProps {
  participant: DossierParticipant | null;
  onClose: () => void;
}

const RANK_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Cabin Boy",       color: "#0d5f66" },
  2: { label: "Deck Hand",       color: "#0d5f66" },
  3: { label: "First Mate",      color: "#0d5f66" },
  4: { label: "Navigator",       color: "#d4af37" },
  5: { label: "Shipwright",      color: "#d4af37" },
  6: { label: "Vice Captain",    color: "#d4af37" },
  7: { label: "Captain",         color: "#da2528" },
  8: { label: "Warlord",         color: "#da2528" },
  9: { label: "Admiral",         color: "#da2528" },
  10:{ label: "Yonko",           color: "#0a192f" },
};

function getRank(level: number) {
  const clamped = Math.max(1, Math.min(10, level));
  return RANK_MAP[clamped] ?? RANK_MAP[5];
}

function ExperienceBar({ level }: { level: number }) {
  const clamped = Math.max(1, Math.min(10, level));
  const pct = (clamped / 10) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#0a192f]/50">Combat Experience</span>
        <span className="text-[8px] font-black text-[#0a192f]">{clamped} / 10</span>
      </div>
      <div className="h-1.5 w-full bg-[#e6e0d3] relative overflow-hidden">
        <div
          className="h-full bg-[#da2528] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
        {[...Array(9)].map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-[#fdfbf7]" style={{ left: `${(i + 1) * 10}%` }} />
        ))}
      </div>
    </div>
  );
}

export function ParticipantDossier({ participant, onClose }: ParticipantDossierProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const prefersReduced = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!participant) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [participant, handleKeyDown]);

  // Click-outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!participant) return null;

  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(participant.name)}&backgroundColor=f5e6c8`;
  const rank = getRank(participant.experienceLevel);
  const isHighThreat = participant.experienceLevel > 3;

  // Derived bounty from experience (purely cosmetic)
  const bounty = (participant.experienceLevel * 123_000_000 + participant.skills.length * 50_000_000)
    .toLocaleString("en-IN");

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
      style={{
        background: "rgba(10, 25, 47, 0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: prefersReduced ? "none" : "dossierFadeIn 0.25s ease-out both",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Dossier: ${participant.name}`}
    >
      {/* Dossier Panel */}
      <div
        ref={panelRef}
        className="relative bg-[#fdfbf7] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#e6e0d3] shadow-2xl"
        style={{
          animation: prefersReduced ? "none" : "dossierSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#da2528]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border border-[#e6e0d3] bg-white hover:bg-[#da2528] hover:text-white hover:border-[#da2528] transition-colors text-[#0a192f]"
          aria-label="Close dossier"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Corner registration marks */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#0a192f]/30" />
        <div className="absolute top-3 right-12 w-3 h-3 border-t-2 border-r-2 border-[#0a192f]/30" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#0a192f]/30" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#0a192f]/30" />

        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* ── LEFT: Portrait Column ── */}
          <div className="md:w-72 shrink-0 bg-[#0a192f] flex flex-col items-center p-8 relative overflow-hidden">
            {/* Subtle dot grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
            />

            {/* WANTED header */}
            <div className="relative z-10 text-center mb-6">
              <p className="text-[8px] font-bold text-[#d4af37]/60 uppercase tracking-[0.4em] mb-1">Grand Line Registry</p>
              <h2 className="text-5xl font-black text-white font-serif tracking-[0.12em] leading-none">WANTED</h2>
              <p className="text-[7px] font-bold text-[#da2528] uppercase tracking-[0.3em] mt-1">DEAD OR ALIVE</p>
            </div>

            {/* Portrait */}
            <div className="relative z-10 w-full aspect-[3/4] border-[3px] border-[#d4af37]/60 bg-[#0d2040] overflow-hidden mb-5">
              <img
                src={avatarUrl}
                alt={participant.name}
                className="w-full h-full object-cover"
              />
              {/* Threat stamp */}
              <div className="absolute top-3 right-[-12px] bg-[#da2528] text-white font-black text-[8px] uppercase tracking-widest px-8 py-1 rotate-[35deg] shadow-lg">
                {isHighThreat ? "HIGH THREAT" : "ACTIVE"}
              </div>
            </div>

            {/* Name Block */}
            <div className="relative z-10 text-center space-y-1 mb-6">
              <h3 className="text-3xl font-black text-white font-serif tracking-tight leading-none">
                {participant.name}
              </h3>
              <p className="text-[9px] font-bold text-[#d4af37] uppercase tracking-[0.25em]">
                {participant.preferredRole}
              </p>
            </div>

            {/* Rank badge */}
            <div className="relative z-10 border border-[#d4af37]/40 px-6 py-2 text-center mb-4">
              <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.3em] mb-0.5">Rank Classification</p>
              <p className="text-sm font-black tracking-widest uppercase" style={{ color: rank.color }}>
                {rank.label}
              </p>
            </div>

            {/* Bounty */}
            <div className="relative z-10 text-center">
              <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1">Bounty</p>
              <p className="text-lg font-black text-[#d4af37] font-serif">B {bounty}</p>
            </div>

            {/* Anchor decoration */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
              <Anchor className="w-32 h-32 text-white" />
            </div>
          </div>

          {/* ── RIGHT: Dossier Information ── */}
          <div className="flex-1 p-8 space-y-7 relative">
            {/* Dossier Header */}
            <div className="border-b-2 border-[#0a192f] pb-4">
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-2">
                <Scroll className="w-3 h-3" />
                <span>Classified Dossier // Grand Line Maritime Authority</span>
              </div>
              <h2 className="text-4xl font-black text-[#0a192f] font-serif tracking-tight leading-none uppercase">
                {participant.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[9px] font-bold text-[#fdfbf7] bg-[#0a192f] px-3 py-1 uppercase tracking-widest">
                  {participant.preferredRole}
                </span>
                <span
                  className="text-[9px] font-bold px-3 py-1 uppercase tracking-widest border"
                  style={{ color: rank.color, borderColor: rank.color + "60", background: rank.color + "10" }}
                >
                  {rank.label}
                </span>
              </div>
            </div>

            {/* Identity */}
            <div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                <Shield className="w-3 h-3 text-[#da2528]" />
                <span>Identity Record</span>
                <div className="flex-1 h-px bg-[#e6e0d3]" />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-[7px] font-bold text-[#0a192f]/40 uppercase tracking-[0.2em] mb-0.5">Legal Name</p>
                  <p className="text-sm font-black text-[#0a192f] font-serif">{participant.name}</p>
                </div>
                <div>
                  <p className="text-[7px] font-bold text-[#0a192f]/40 uppercase tracking-[0.2em] mb-0.5">Combat Role</p>
                  <p className="text-sm font-black text-[#0a192f] font-serif">{participant.preferredRole}</p>
                </div>
                {participant.email && (
                  <div className="col-span-2">
                    <p className="text-[7px] font-bold text-[#0a192f]/40 uppercase tracking-[0.2em] mb-0.5">Transmission Channel</p>
                    <p className="text-xs font-bold text-[#0d5f66] font-mono">{participant.email}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <ExperienceBar level={participant.experienceLevel} />
                </div>
              </div>
            </div>

            {/* Known Skills */}
            <div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                <Star className="w-3 h-3 text-[#d4af37]" />
                <span>Known Combat Techniques</span>
                <div className="flex-1 h-px bg-[#e6e0d3]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {participant.skills.length > 0 ? participant.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-black text-[#0a192f] bg-white border border-[#0a192f] px-3 py-1.5 uppercase tracking-wider relative"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {skill}
                  </span>
                )) : (
                  <span className="text-[10px] text-[#0a192f]/40 italic font-serif">No skills on record.</span>
                )}
              </div>
            </div>

            {/* Interests / Objectives */}
            {participant.interests && participant.interests.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                  <Crosshair className="w-3 h-3 text-[#0d5f66]" />
                  <span>Strategic Objectives</span>
                  <div className="flex-1 h-px bg-[#e6e0d3]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {participant.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold text-[#0d5f66] bg-[#e0f2f1] border border-[#0d5f66]/20 px-3 py-1.5 uppercase tracking-wider"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Capability Meter — derived from existing data only */}
            <div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                <Compass className="w-3 h-3 text-[#d4af37]" />
                <span>Tactical Assessment</span>
                <div className="flex-1 h-px bg-[#e6e0d3]" />
              </div>
              <div className="space-y-2">
                {[
                  { label: "Skill Breadth",    value: Math.min(100, participant.skills.length * 17) },
                  { label: "Field Experience", value: Math.round((participant.experienceLevel / 10) * 100) },
                  { label: "Versatility",      value: Math.min(100, participant.interests.length * 20) },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#0a192f]/50">{label}</span>
                      <span className="text-[8px] font-black text-[#0a192f]">{value}%</span>
                    </div>
                    <div className="h-1 bg-[#e6e0d3] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#da2528] to-[#d4af37] transition-all duration-700 ease-out"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Classification stamp */}
            <div className="border-t border-[#e6e0d3] pt-4 flex justify-between items-end">
              <div>
                <p className="text-[7px] font-bold text-[#0a192f]/30 uppercase tracking-[0.3em]">
                  Classification: Recruitment Eligible · Grand Line Maritime Authority
                </p>
                <p className="text-[7px] font-mono text-[#0a192f]/20 mt-1">
                  DOSSIER-{participant.id.slice(0, 8).toUpperCase()} · NAKAMA.EXE
                </p>
              </div>
              <div className="shrink-0 border-2 border-[#da2528] text-[#da2528] px-3 py-1 rotate-[-2deg] opacity-70">
                <p className="text-[8px] font-black uppercase tracking-widest">APPROVED</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dossierFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dossierSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
