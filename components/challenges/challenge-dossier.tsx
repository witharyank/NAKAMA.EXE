"use client";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X, Target, Users, Ship, Star, Crosshair,
  Anchor, Scroll, Map, ChevronRight, Zap
} from "lucide-react";

interface DossierChallenge {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  requiredRoles: string[];
  teamSize: number;
  difficulty: string;
}

interface ChallengeDossierProps {
  challenge: DossierChallenge | null;
  onClose: () => void;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Easy:   { label: "EASY",   color: "#0d5f66", bg: "#e0f2f1", border: "#0d5f66" },
  Medium: { label: "MEDIUM", color: "#d4af37", bg: "#fdf6dc", border: "#d4af37" },
  Hard:   { label: "HARD",   color: "#da2528", bg: "#fce8e8", border: "#da2528" },
};

function getDifficulty(d: string) {
  return DIFFICULTY_CONFIG[d] ?? DIFFICULTY_CONFIG["Medium"];
}

// Deterministic threat score from challenge data
function getThreatScore(c: DossierChallenge) {
  const base = c.requiredSkills.length * 10 + c.requiredRoles.length * 8 + c.teamSize * 5;
  return Math.min(99, base);
}

function ThreatMeter({ score }: { score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#0a192f]/50">Threat Index</span>
        <span className="text-[8px] font-black text-[#da2528]">{score} / 99</span>
      </div>
      <div className="h-1.5 w-full bg-[#e6e0d3] relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#d4af37] to-[#da2528] transition-all duration-700 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

const ROLE_ICON_MAP: Record<string, string> = {
  "frontend engineer":         "⚡",
  "backend engineer":          "⚙️",
  "full stack engineer":       "🔗",
  "ui/ux designer":            "🎨",
  "data scientist":            "📊",
  "machine learning engineer": "🤖",
  "devops engineer":           "🛠️",
  "security engineer":         "🛡️",
  "mobile developer":          "📱",
  "software engineer":         "💻",
};

function getRoleIcon(role: string) {
  return ROLE_ICON_MAP[role.toLowerCase()] ?? "⚓";
}

export function ChallengeDossier({ challenge, onClose }: ChallengeDossierProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!challenge) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [challenge, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleAssembleCrew = () => {
    onClose();
    router.push(`/davy-back?mission=${challenge!.id}`);
  };

  if (!challenge) return null;

  const diff = getDifficulty(challenge.difficulty);
  const threat = getThreatScore(challenge);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
      style={{
        background: "rgba(10, 25, 47, 0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: prefersReduced ? "none" : "missionFadeIn 0.25s ease-out both",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Mission Dossier: ${challenge.title}`}
    >
      <div
        className="relative bg-[#fdfbf7] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#e6e0d3] shadow-2xl"
        style={{
          animation: prefersReduced ? "none" : "missionSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Top bar: navy + crimson line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#0a192f]" />
        <div className="absolute top-2 left-0 right-0 h-px bg-[#c62828]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border border-[#e6e0d3] bg-white hover:bg-[#da2528] hover:text-white hover:border-[#da2528] transition-colors text-[#0a192f]"
          aria-label="Close dossier"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Registration marks */}
        <div className="absolute top-5 left-3 w-3 h-3 border-t-2 border-l-2 border-[#0a192f]/30" />
        <div className="absolute top-5 right-12 w-3 h-3 border-t-2 border-r-2 border-[#0a192f]/30" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#0a192f]/30" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#0a192f]/30" />

        <div className="flex flex-col md:flex-row min-h-[520px]">

          {/* ── LEFT: Mission Identity Panel ── */}
          <div className="md:w-64 shrink-0 bg-[#0a192f] flex flex-col p-8 relative overflow-hidden">
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            {/* Anchor watermark */}
            <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
              <Anchor className="w-48 h-48 text-white" />
            </div>

            <div className="relative z-10 space-y-6 flex-1">
              {/* Label */}
              <div>
                <p className="text-[7px] font-bold text-[#d4af37]/60 uppercase tracking-[0.4em] mb-1">
                  Grand Line Authority
                </p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.3em]">
                  Classified Mission Brief
                </p>
              </div>

              {/* Large compass icon */}
              <div className="w-16 h-16 border border-[#d4af37]/30 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                <Map className="w-8 h-8 text-[#d4af37]/60" />
              </div>

              {/* Difficulty */}
              <div className="border border-white/10 p-3">
                <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1.5">Difficulty</p>
                <span
                  className="text-sm font-black uppercase tracking-widest px-2 py-1 inline-block"
                  style={{ color: diff.color, background: diff.color + "20", border: `1px solid ${diff.border}60` }}
                >
                  {diff.label}
                </span>
              </div>

              {/* Team size */}
              <div className="border border-white/10 p-3">
                <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1.5">Crew Required</p>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#d4af37]" />
                  <span className="text-2xl font-black text-white font-serif">{challenge.teamSize}</span>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest self-end mb-1">members</span>
                </div>
              </div>

              {/* Threat Index */}
              <div className="border border-white/10 p-3">
                <ThreatMeter score={threat} />
              </div>

              {/* Status stamp */}
              <div className="border border-[#c62828]/40 px-3 py-2 text-center rotate-[-1deg]">
                <p className="text-[7px] font-bold text-[#c62828] uppercase tracking-[0.3em]">STATUS</p>
                <p className="text-xs font-black text-[#d4af37] tracking-widest uppercase mt-0.5">OPEN</p>
              </div>
            </div>

            {/* Dossier ID at bottom */}
            <div className="relative z-10 mt-6 border-t border-white/10 pt-4">
              <p className="text-[7px] font-mono text-white/20 uppercase">
                MISS-{challenge.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* ── RIGHT: Dossier Content ── */}
          <div className="flex-1 p-8 space-y-7">

            {/* Header */}
            <div className="border-b-2 border-[#0a192f] pb-5 pt-2">
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-2">
                <Scroll className="w-3 h-3" />
                <span>Grand Line Maritime Authority // Mission Directive</span>
              </div>
              <h2 className="text-4xl font-black text-[#0a192f] font-serif tracking-tight leading-none uppercase mb-3">
                {challenge.title}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-[9px] font-bold px-3 py-1 uppercase tracking-widest border"
                  style={{ color: diff.color, borderColor: diff.border + "60", background: diff.bg }}
                >
                  {diff.label}
                </span>
                <span className="text-[9px] font-bold text-[#0a192f] bg-[#f5e6c8]/60 border border-[#d4af37]/30 px-3 py-1 uppercase tracking-widest flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-[#d4af37]" /> {challenge.teamSize} Crew
                </span>
                <span className="text-[9px] font-bold text-[#0a192f]/40 uppercase tracking-widest flex items-center gap-1">
                  <Target className="w-2.5 h-2.5 text-[#c62828]" /> Mission Active
                </span>
              </div>
            </div>

            {/* Mission Brief */}
            <div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                <Scroll className="w-3 h-3 text-[#c62828]" />
                <span>Mission Brief</span>
                <div className="flex-1 h-px bg-[#e6e0d3]" />
              </div>
              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c62828]/30" />
                <p className="text-[#0a192f] text-sm leading-relaxed font-serif italic">
                  {challenge.description}
                </p>
              </div>
            </div>

            {/* Required Capabilities */}
            <div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                <Star className="w-3 h-3 text-[#d4af37]" />
                <span>Required Capabilities</span>
                <div className="flex-1 h-px bg-[#e6e0d3]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {challenge.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-black text-[#0a192f] bg-white border border-[#0a192f] px-3 py-1.5 uppercase tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Crew Roster Requirements */}
            <div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                <Crosshair className="w-3 h-3 text-[#0d5f66]" />
                <span>Crew Roster Requirements</span>
                <div className="flex-1 h-px bg-[#e6e0d3]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {challenge.requiredRoles.map((role, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-[#f5e6c8]/30 border border-[#d4af37]/30 px-3 py-2"
                  >
                    <span className="text-base leading-none">{getRoleIcon(role)}</span>
                    <div>
                      <p className="text-[8px] font-bold text-[#0a192f]/50 uppercase tracking-[0.15em] leading-none mb-0.5">
                        Position {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="text-[10px] font-black text-[#0a192f] uppercase tracking-wider leading-none">
                        {role}
                      </p>
                    </div>
                    <Ship className="w-3 h-3 text-[#c62828] ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Assessment */}
            <div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-[#0a192f]/40 uppercase tracking-[0.3em] mb-3">
                <Zap className="w-3 h-3 text-[#d4af37]" />
                <span>Tactical Assessment</span>
                <div className="flex-1 h-px bg-[#e6e0d3]" />
              </div>
              <div className="space-y-2">
                {[
                  { label: "Skill Complexity",     value: Math.min(100, challenge.requiredSkills.length * 17) },
                  { label: "Role Coverage Required",value: Math.min(100, challenge.requiredRoles.length * 17) },
                  { label: "Fleet Scale",           value: Math.min(100, challenge.teamSize * 14) },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#0a192f]/50">{label}</span>
                      <span className="text-[8px] font-black text-[#0a192f]">{value}%</span>
                    </div>
                    <div className="h-1 bg-[#e6e0d3] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0d5f66] to-[#d4af37] transition-all duration-700 ease-out"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA — Assemble Crew */}
            <div className="border-t border-[#e6e0d3] pt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <p className="text-[7px] font-mono text-[#0a192f]/30 uppercase">
                  MISS-{challenge.id.slice(0, 8).toUpperCase()} · NAKAMA.EXE
                </p>
                <p className="text-[7px] font-bold text-[#0a192f]/30 uppercase tracking-[0.3em]">
                  Recruitment Pending · Grand Line Maritime Authority
                </p>
              </div>
              <button
                onClick={handleAssembleCrew}
                className="shrink-0 flex items-center gap-2 bg-[#da2528] hover:bg-[#b71c1c] text-white font-black text-[10px] uppercase tracking-[0.25em] px-6 py-3 transition-colors shadow-[0_4px_14px_0_rgba(218,37,40,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#da2528] focus-visible:ring-offset-2"
                aria-label={`Assemble crew for mission: ${challenge.title}`}
              >
                <Anchor className="w-4 h-4" />
                ASSEMBLE CREW
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes missionFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes missionSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
