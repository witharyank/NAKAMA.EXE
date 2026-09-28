"use client"

import * as React from "react"

export interface TigerTearRevealProps {
  /** The big word that gets torn. */
  word?: string
  /** Small line above the word. Empty hides it. */
  tagline?: string
  /** Word colour. */
  ink?: string
  /** Paper colour, the sheet that tears. */
  paper?: string
  /** Tagline colour. */
  taglineColor?: string
  /** Font stack for the word. */
  fontFamily?: string
  /** Height of the pinned stage. A definite length, never a percentage. */
  height?: string
  /** Extra scroll distance the tear plays over, on top of `height`. */
  scrollDistance?: string
  /** 0..1. Drive the tear yourself instead of from scroll (1 = fully torn). */
  progress?: number
  /** Show the "scroll" hint before the tear starts. */
  hint?: boolean
  /** Extra root class names. */
  className?: string
}

// #region tear
export type Pt = [number, number]

/** Seeded PRNG (mulberry32) */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const clamp01 = (x: number) => (x <= 0 ? 0 : x > 1 ? 1 : x)

export function smooth(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** How far through the pinned scroll we are: 0 at the top, 1 when the stage lets go. */
export function scrollProgress(top: number, height: number, viewport: number) {
  const range = height - viewport
  if (range <= 0) return top <= 0 ? 1 : 0
  return clamp01(-top / range)
}

/** One scroll value drives beats. */
export function stages(p: number) {
  return {
    crack: smooth(0.03, 0.2, p), // crack runs out
    open: smooth(0.18, 0.62, p), // sheet tears and parts
    rise: smooth(0.26, 0.74, p), // Luffy comes up from behind
    shake: smooth(0.16, 0.22, p) * (1 - smooth(0.26, 0.36, p)), // jolt of the rip
  }
}

/** The tear, left to right across the whole sheet */
export function tearLine(seed = 11, from = -800, to = 1800, step = 9, cx = 500, cy = 318, angle = -7): Pt[] {
  const r = rng(seed)
  const slope = Math.tan((angle * Math.PI) / 180)
  const out: Pt[] = []
  for (let x = from; x <= to; x += step) {
    const fibre = (r() - 0.5) * 5
    const tooth = r() < 0.09 ? (r() - 0.5) * 26 : 0
    const wander = Math.sin(x * 0.019 + seed) * 10 + Math.sin(x * 0.053 + seed * 2) * 4
    out.push([x, cy + (x - cx) * slope + wander + fibre + tooth])
  }
  return out
}

/** Where each half goes as the tear opens. */
export function pieceMotion(open: number) {
  return {
    top: { dx: -10 * open, dy: -82 * open, rot: -2.6 * open },
    bottom: { dx: 12 * open, dy: 78 * open, rot: 2.1 * open },
  }
}

/** Width of the white paper core exposed along a torn edge. */
export function fibreWidths(n: number, open: number, seed = 5) {
  const r = rng(seed)
  const k = Math.min(1, open * 4)
  return Array.from({ length: n }, (_, i) => k * (2.5 + 6 * (0.5 + 0.5 * Math.sin(i * 0.37 + seed)) * (0.6 + r() * 0.8)))
}
// #endregion

const VIEW_W = 1000
const CX = 500
const CY = 318
const FAR = 4000 
const FRAME = "36 44 928 468"

const d = (pts: Pt[], close = true) =>
  "M" + pts.map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + (close ? "Z" : "")

const CURLS: Record<"top" | "bottom", [number, number, number][]> = {
  top: [
    [300, 44, 30],
    [575, 30, 20],
    [790, 52, 34],
  ],
  bottom: [
    [205, 50, 32],
    [470, 34, 22],
    [690, 40, 28],
  ],
}

function Half({
  id,
  side,
  line,
  open,
  children,
}: {
  id: string
  side: "top" | "bottom"
  line: Pt[]
  open: number
  children: React.ReactNode
}) {
  const up = side === "top"
  const m = pieceMotion(open)[side]
  const shape = up
    ? [[line[0][0], -FAR] as Pt, [line[line.length - 1][0], -FAR] as Pt, ...[...line].reverse()]
    : [...line, [line[line.length - 1][0], FAR] as Pt, [line[0][0], FAR] as Pt]
  const widths = fibreWidths(line.length, open, up ? 5 : 8)
  const core = line.concat(line.map(([x, y], i) => [x, y + (up ? -widths[i] : widths[i])] as Pt).reverse())
  const curls = CURLS[side].map(([cx, hw, depth]) => {
    const pts = line.filter(([x]) => Math.abs(x - cx) <= hw)
    const back = pts.map(([x, y]) => {
      const s = Math.cos(((x - cx) / hw) * (Math.PI / 2))
      return [x + (up ? 6 : -6) * s * open, y + (up ? 1 : -1) * depth * s * s * Math.min(1, open * 2.5)] as Pt
    })
    return d(pts.concat(back.reverse()))
  })
  const transform =
    "translate(" + m.dx.toFixed(2) + " " + m.dy.toFixed(2) + ") rotate(" + m.rot.toFixed(3) + " " + CX + " " + CY + ")"
  const clip = id + "-" + side
  return (
    <g transform={transform}>
      {open > 0 ? (
        <path
          d={d(line, false)}
          fill="none"
          stroke="#000"
          strokeOpacity={0.55 * Math.min(1, open * 3)}
          strokeWidth={22}
          transform={"translate(0 " + (up ? 10 : -10) + ")"}
          filter={"url(#" + id + "-soft)"}
        />
      ) : null}
      <clipPath id={clip}>
        <path d={d(shape)} />
      </clipPath>
      <g clipPath={"url(#" + clip + ")"}>{children}</g>
      {open > 0 ? (
        <>
          <path d={d(core)} fill="#ffffff" />
          {curls.map((c, i) => (
            <path key={i} d={c} fill={"url(#" + id + "-curl-" + side + ")"} stroke="#fff" strokeWidth={1} />
          ))}
        </>
      ) : null}
    </g>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])
  return reduced
}

type Frame = { p: number }

export default function TigerTearReveal({
  word = "COURAGE",
  tagline = "HAVE NO FEAR",
  ink = "#cf2e3d",
  paper = "#f2f1ee",
  taglineColor = "#2a2a2a",
  fontFamily = '"Anton", Impact, "Bebas Neue", "Oswald", "Arial Narrow", "Arial Black", sans-serif',
  height = "100svh",
  scrollDistance = "160svh",
  progress,
  hint = true,
  className = "",
}: TigerTearRevealProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const stageRef = React.useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const id = "ttr" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const line = React.useMemo(() => tearLine(), [])
  const [f, setF] = React.useState<Frame>({ p: progress ?? 0 })

  const controlled = progress !== undefined
  const cfg = React.useRef({ progress, controlled, reduced })
  cfg.current = { progress, controlled, reduced }

  React.useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return
    let raf = 0
    let visible = true
    let p = cfg.current.progress ?? 0
    let last: Frame | null = null

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(root)

    function tick() {
      raf = 0
      if (!visible) return
      const c = cfg.current
      const target = c.controlled
        ? clamp01(c.progress ?? 0)
        : scrollProgress(root!.getBoundingClientRect().top, root!.offsetHeight, stage!.offsetHeight)
      p = c.reduced ? (target > 0.3 ? 1 : 0) : p + (target - p) * 0.14
      if (Math.abs(target - p) < 0.0005) p = target

      const next: Frame = { p }
      if (
        !last ||
        Math.abs(next.p - last.p) > 1e-4
      ) {
        last = next
        setF(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  const s = stages(f.p)
  const rise = (1 - s.rise) * 150
  const shake = reduced ? 0 : Math.sin(f.p * 900) * 6 * s.shake
  const crackReach = s.crack * 620
  const crack = line.filter(([x]) => Math.abs(x - CX) <= crackReach)
  
  // Center Luffy directly in the opening, rising up smoothly.
  const luffyTransform = "translate(" + (CX - 450) + " " + (CY - 250 + rise).toFixed(2) + ") scale(1)"

  const sheet = (
    <>
      <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill={paper} />
      {tagline ? (
        <text
          x={CX}
          y={150}
          textAnchor="middle"
          fill={taglineColor}
          style={{ font: '700 32px var(--font-playfair), "Helvetica Neue", Helvetica, Arial, sans-serif', letterSpacing: "0.42em" }}
        >
          {tagline}
        </text>
      ) : null}
      <text
        x={CX}
        y={404}
        textAnchor="middle"
        textLength={880}
        lengthAdjust="spacingAndGlyphs"
        fill={ink}
        style={{ fontFamily, fontSize: 250, fontWeight: 400, letterSpacing: 0 }}
      >
        {word}
      </text>
    </>
  )

  return (
    <section
      ref={rootRef}
      className={"relative w-full " + className}
      style={{ height: controlled ? height : "calc(" + height + " + " + scrollDistance + ")", background: paper, overflow: "clip" }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height }}
      >
        <svg
          viewBox={FRAME}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={(tagline ? tagline + ". " : "") + word + ", torn in two by Luffy looking through."}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", display: "block" }}
        >
          <defs>
            <linearGradient id={id + "-curl-top"} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d9d4cb" />
            </linearGradient>
            <linearGradient id={id + "-curl-bottom"} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d9d4cb" />
            </linearGradient>
            <filter id={id + "-soft"} x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          <g transform={"translate(" + shake.toFixed(2) + " " + (shake * 0.4).toFixed(2) + ")"}>
            {/* Dark background behind Luffy just in case to cover up FAR */}
            <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill="#700606" />
            
            {/* Behind the paper: Luffy image rising into the gap */}
            {s.open > 0 ? (
              <g transform={luffyTransform}>
                <image 
                  href="/images/luffy.png" 
                  width="900" 
                  height="500" 
                  preserveAspectRatio="xMidYMid slice" 
                />
              </g>
            ) : null}

            {/* the sheet: whole until it tears, then in two halves */}
            {s.open > 0 ? (
              <>
                <Half id={id} side="top" line={line} open={s.open}>
                  {sheet}
                </Half>
                <Half id={id} side="bottom" line={line} open={s.open}>
                  {sheet}
                </Half>
              </>
            ) : (
              sheet
            )}

            {/* the crack, running out from the middle before it gives way */}
            {s.crack > 0 && s.open < 0.15 && crack.length > 1 ? (
              <path d={d(crack, false)} fill="none" stroke="#1d0f07" strokeWidth={2.4} strokeLinejoin="bevel" opacity={1 - s.open / 0.15} />
            ) : null}
          </g>
        </svg>

        {hint && !controlled ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em]"
            style={{ color: taglineColor, opacity: Math.max(0, 0.7 - s.crack * 3) }}
          >
            scroll
            <span className="block h-6 w-px animate-pulse motion-reduce:animate-none" style={{ background: taglineColor }} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
