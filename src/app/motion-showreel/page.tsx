"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Grid,
  Code2,
  Sparkles,
  Layers,
  SkipBack,
  SkipForward,
  Maximize2,
  Copy,
  Check,
  Repeat,
  Sliders,
  Zap,
  Film,
  Eye
} from 'lucide-react';

// ============================================================================
// REMOTION-COMPATIBLE MATH & PHYSICS ENGINE (interpolate, spring, Easing)
// ============================================================================

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const Easing = {
  linear: (t: number) => t,
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
};

type InterpolateOptions = {
  extrapolateLeft?: 'clamp' | 'extend' | 'identity';
  extrapolateRight?: 'clamp' | 'extend' | 'identity';
  easing?: (progress: number) => number;
};

/**
 * Remotion-equivalent interpolate() function
 */
function interpolate(frame: number, inputRange: number[], outputRange: number[], options: InterpolateOptions = {}) {
  const {
    extrapolateLeft = 'clamp',
    extrapolateRight = 'clamp',
    easing = Easing.linear,
  } = options;

  // Find segment for multi-point ranges
  let i = 0;
  for (let idx = 0; idx < inputRange.length - 1; idx++) {
    if (frame >= inputRange[idx] && frame <= inputRange[idx + 1]) {
      i = idx;
      break;
    }
    if (frame > inputRange[idx + 1]) {
      i = idx;
    }
  }

  const inMin = inputRange[i];
  const inMax = inputRange[i + 1];
  const outMin = outputRange[i];
  const outMax = outputRange[i + 1];

  if (inMax === inMin) return outMin;

  let progress = (frame - inMin) / (inMax - inMin);

  if (progress < 0 && extrapolateLeft === 'clamp') progress = 0;
  if (progress > 1 && extrapolateRight === 'clamp') progress = 1;

  const eased = easing(clamp(progress, 0, 1));
  return outMin + eased * (outMax - outMin);
}

/**
 * Analytical damped harmonic oscillator matching Remotion's spring()
 */
function spring({
  frame,
  fps = 60,
  config = {},
  from = 0,
  to = 1,
  delay = 0,
}: {
  frame: number;
  fps?: number;
  config?: { damping?: number; mass?: number; stiffness?: number };
  from?: number;
  to?: number;
  delay?: number;
}) {
  const f = frame - delay;
  if (f <= 0) return from;

  const { damping = 12, mass = 1, stiffness = 140 } = config;
  const t = f / fps;

  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  let envelope;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    envelope =
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t));
  } else {
    envelope = 1 - (1 + w0 * t) * Math.exp(-w0 * t);
  }

  return from + envelope * (to - from);
}

// ============================================================================
// SYNTHESIZED WEB AUDIO SOUND ENGINE (Futuristic Motion Design SFX)
// ============================================================================

class MotionAudioEngine {
  ctx: AudioContext | null = null;
  lastScene = -1;
  lastBeatFrame = -1;

  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSubDrop(freq = 110, duration = 0.65) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + duration);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playWhoosh(pitch = 600, duration = 0.25) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered noise burst + sine sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch * 0.4, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.8, now + duration * 0.6);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.3, now + duration);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.14, now + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playStab(freqs = [220, 330, 440, 660], duration = 0.35) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  playClick(freq = 1400) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  triggerForFrame(frame: number) {
    if (!this.ctx) return;
    const f = Math.floor(frame);

    // Scene transitions
    let sceneIdx = 0;
    if (f >= 510) sceneIdx = 4;
    else if (f >= 390) sceneIdx = 3;
    else if (f >= 240) sceneIdx = 2;
    else if (f >= 120) sceneIdx = 1;

    if (sceneIdx !== this.lastScene) {
      this.lastScene = sceneIdx;
      if (sceneIdx === 0) {
        this.playSubDrop(130, 0.7);
        this.playStab([196, 293.66, 392, 587.33], 0.45);
      } else if (sceneIdx === 1) {
        this.playWhoosh(720, 0.28);
        this.playSubDrop(140, 0.4);
      } else if (sceneIdx === 2) {
        this.playStab([261.63, 329.63, 392, 523.25], 0.65);
        this.playWhoosh(450, 0.4);
      } else if (sceneIdx === 3) {
        this.playSubDrop(160, 0.5);
        this.playWhoosh(900, 0.22);
      } else if (sceneIdx === 4) {
        this.playSubDrop(120, 0.9);
        this.playStab([220, 277.18, 329.63, 440, 659.25], 0.9);
      }
    }

    // Specific kinetic hits inside scenes
    const hitFrames = [30, 60, 90, 145, 175, 205, 390, 420, 450, 480, 525];
    if (hitFrames.includes(f) && this.lastBeatFrame !== f) {
      this.lastBeatFrame = f;
      if (f >= 390 && f <= 480) {
        this.playSubDrop(180, 0.25);
        this.playClick(1800);
      } else {
        this.playClick(1200 + (f % 5) * 180);
      }
    }
  }
}

const audioEngine = new MotionAudioEngine();

// ============================================================================
// SCENE METADATA DEFINITION
// ============================================================================

const SCENES = [
  {
    id: 1,
    name: '01 // THE SPARK',
    subtitle: '3D Kinetic Grid & Neon Morph',
    startFrame: 0,
    endFrame: 120,
    color: '#00f5d4',
    accent: 'from-cyan-400 to-emerald-400',
  },
  {
    id: 2,
    name: '02 // KINETIC TYPE',
    subtitle: 'Spring Physics & Bento Telemetry',
    startFrame: 120,
    endFrame: 240,
    color: '#ccff00',
    accent: 'from-lime-400 to-yellow-300',
  },
  {
    id: 3,
    name: '03 // LIQUID & 3D PRISM',
    subtitle: 'Isometric Orbitals & Gooey Morph',
    startFrame: 240,
    endFrame: 390,
    color: '#a855f7',
    accent: 'from-purple-500 to-pink-500',
  },
  {
    id: 4,
    name: '04 // HYPER RHYTHM',
    subtitle: 'Fast-Cut Glitch & Shockwaves',
    startFrame: 390,
    endFrame: 510,
    color: '#ff2a85',
    accent: 'from-rose-500 to-orange-500',
  },
  {
    id: 5,
    name: '05 // SUPERNOVA FINALE',
    subtitle: 'Grand Reveal & Exponential Settle',
    startFrame: 510,
    endFrame: 600,
    color: '#38bdf8',
    accent: 'from-sky-400 to-indigo-400',
  },
];

// ============================================================================
// SCENE 1 (0 - 120): "THE SPARK" — 3D Kinetic Tunnel & Geometric Morph
// ============================================================================

const Scene1Spark = ({ frame, fps }: { frame: number; fps: number }) => {
  // 4-stage shape morph every 25 frames: Circle -> Square -> Star -> Prism
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.9 },
  });

  const rotation = interpolate(frame, [0, 120], [0, 270], {
    easing: Easing.easeInOutCubic,
  });

  const tunnelZ = (frame * 12) % 200;
  const flashOpacity = interpolate(frame, [0, 12, 85, 92, 105, 115, 120], [0.9, 0, 0, 0.7, 0, 0, 1]);

  // Chromatic aberration offset during rapid transitions
  const chromaShift =
    frame > 82 && frame < 96
      ? Math.sin(frame * 1.7) * 14
      : interpolate(frame, [0, 20], [16, 0]);

  // Morphing border-radius & polygon clip
  const stage = Math.min(3, Math.floor(frame / 28));
  const stageNames = ['SPHERE // 01', 'HYPERCUBE // 02', 'NOVA STAR // 03', 'APEX PRISM // 04'];

  const textWords = ['PRECISION', 'IN', 'EVERY', 'FRAME'];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, #0b132b 0%, #05070f 75%, #020308 100%)',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* 3D Perspective Grid Tunnel */}
      <div
        style={{
          position: 'absolute',
          inset: '-25%',
          perspective: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const zPos = ((idx * 140 + tunnelZ * 3.5) % 840) - 420;
          const opacity = interpolate(zPos, [-420, 0, 380, 420], [0.05, 0.35, 0.65, 0]);
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: '1200px',
                height: '680px',
                border: '2px solid rgba(0, 245, 212, 0.38)',
                borderRadius: '28px',
                boxShadow: '0 0 40px rgba(0, 245, 212, 0.15), inset 0 0 40px rgba(0, 245, 212, 0.1)',
                transform: `translateZ(${zPos}px) rotateZ(${frame * 0.18 * (idx % 2 === 0 ? 1 : -1)}deg)`,
                opacity,
              }}
            />
          );
        })}
      </div>

      {/* Radial Laser Rays */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}
      >
        <defs>
          <linearGradient id="sparkRay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f5d4" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#7b2cbf" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16 + frame * 0.45;
          const rad = (angle * Math.PI) / 180;
          const r1 = 180 + Math.sin(frame * 0.1 + i) * 40;
          const r2 = 950;
          return (
            <line
              key={i}
              x1={960 + Math.cos(rad) * r1}
              y1={540 + Math.sin(rad) * r1}
              x2={960 + Math.cos(rad) * r2}
              y2={540 + Math.sin(rad) * r2}
              stroke="url(#sparkRay)"
              strokeWidth={i % 2 === 0 ? '3' : '1.2'}
              strokeDasharray="24 16"
              strokeDashoffset={-frame * 8}
            />
          );
        })}
      </svg>

      {/* Center Geometric Morph Core */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer Pulsing Halo Ring */}
        <div
          style={{
            position: 'absolute',
            width: '540px',
            height: '540px',
            borderRadius: '50%',
            border: '2px dashed rgba(0, 245, 212, 0.45)',
            transform: `scale(${enterScale * (1 + Math.sin(frame * 0.08) * 0.05)}) rotate(${-frame * 1.4}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            border: '1px solid rgba(168, 85, 247, 0.5)',
            transform: `scale(${enterScale}) rotate(${frame * 2.1}deg)`,
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#00f5d4',
              boxShadow: '0 0 24px #00f5d4',
              position: 'absolute',
              top: '-9px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* Morphing SVG Vector Core */}
        <svg
          width="360"
          height="360"
          viewBox="-180 -180 360 360"
          style={{
            transform: `scale(${enterScale}) rotate(${rotation}deg)`,
            filter: 'drop-shadow(0 0 35px rgba(0, 245, 212, 0.65))',
          }}
        >
          {stage === 0 && (
            <g>
              <circle
                r="110"
                fill="rgba(0, 245, 212, 0.12)"
                stroke="#00f5d4"
                strokeWidth="8"
              />
              <circle
                r="68"
                fill="none"
                stroke="#ccff00"
                strokeWidth="4"
                strokeDasharray="24 12"
              />
            </g>
          )}
          {stage === 1 && (
            <g>
              <rect
                x="-95"
                y="-95"
                width="190"
                height="190"
                rx="24"
                fill="rgba(204, 255, 0, 0.14)"
                stroke="#ccff00"
                strokeWidth="8"
              />
              <rect
                x="-55"
                y="-55"
                width="110"
                height="110"
                rx="12"
                fill="none"
                stroke="#00f5d4"
                strokeWidth="4"
                transform={`rotate(45)`}
              />
            </g>
          )}
          {stage === 2 && (
            <polygon
              points="0,-130 35,-40 130,-35 52,25 80,120 0,68 -80,120 -52,25 -130,-35 -35,-40"
              fill="rgba(255, 42, 133, 0.2)"
              stroke="#ff2a85"
              strokeWidth="8"
              strokeLinejoin="round"
            />
          )}
          {stage === 3 && (
            <g>
              <polygon
                points="0,-135 125,85 -125,85"
                fill="rgba(0, 245, 212, 0.2)"
                stroke="#00f5d4"
                strokeWidth="9"
                strokeLinejoin="round"
              />
              <polygon
                points="0,135 125,-85 -125,-85"
                fill="none"
                stroke="#a855f7"
                strokeWidth="5"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Staggered Kinetic Typography Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 96px',
          pointerEvents: 'none',
        }}
      >
        {/* Top Telemetry Bar */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '20px',
            letterSpacing: '0.24em',
            color: '#00f5d4',
            opacity: interpolate(frame, [0, 20], [0, 1]),
          }}
        >
          <span>REMOTION ENGINE // 60.0 FPS</span>
          <span
            style={{
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'rgba(0, 245, 212, 0.14)',
              border: '1px solid rgba(0, 245, 212, 0.5)',
            }}
          >
            {stageNames[stage]}
          </span>
          <span>1920 × 1080 // 16:9</span>
        </div>

        {/* Center-Bottom Kinetic Headline */}
        <div
          style={{
            display: 'flex',
            gap: '26px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 'auto',
            marginBottom: '20px',
          }}
        >
          {textWords.map((word, idx) => {
            const wordSpring = spring({
              frame,
              fps,
              delay: 10 + idx * 8,
              config: { damping: 11, stiffness: 170 },
            });
            const yOffset = interpolate(wordSpring, [0, 1], [110, 0]);
            return (
              <div
                key={word}
                style={{
                  position: 'relative',
                  transform: `translateY(${yOffset}px) scale(${0.85 + wordSpring * 0.15})`,
                  opacity: clamp(wordSpring, 0, 1),
                }}
              >
                {/* Chromatic Aberration Cyan Ghost */}
                {Math.abs(chromaShift) > 0.5 && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      color: '#00f5d4',
                      transform: `translate(${-chromaShift}px, 0)`,
                      mixBlendMode: 'screen',
                      fontSize: '92px',
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {word}
                  </span>
                )}
                {/* Chromatic Aberration Pink Ghost */}
                {Math.abs(chromaShift) > 0.5 && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      color: '#ff2a85',
                      transform: `translate(${chromaShift}px, 0)`,
                      mixBlendMode: 'screen',
                      fontSize: '92px',
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {word}
                  </span>
                )}
                <span
                  style={{
                    position: 'relative',
                    fontSize: '92px',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: idx === 0 || idx === 3 ? '#00f5d4' : '#ffffff',
                    textShadow: '0 12px 35px rgba(0,0,0,0.75)',
                  }}
                >
                  {word}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transition Flash Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// ============================================================================
// SCENE 2 (120 - 240): "KINETIC TYPOGRAPHY & BENTO TELEMETRY"
// ============================================================================

const Scene2KineticType = ({ frame, fps }: { frame: number; fps: number }) => {
  const localFrame = frame - 120; // 0 to 120

  // High-contrast palette invert between Acid Lime, Deep Black, and Electric Violet
  const colorPhase = Math.floor(localFrame / 32) % 3;
  const palettes = [
    { bg: '#ccff00', fg: '#06080e', cardBg: '#0c101d', cardFg: '#ffffff', accent: '#7b2cbf' },
    { bg: '#070912', fg: '#ffffff', cardBg: '#131829', cardFg: '#ccff00', accent: '#00f5d4' },
    { bg: '#5b21b6', fg: '#ccff00', cardBg: '#090b14', cardFg: '#ffffff', accent: '#ff2a85' },
  ];
  const theme = palettes[colorPhase];

  const card1Spring = spring({
    frame: localFrame,
    fps,
    delay: 6,
    config: { damping: 12, stiffness: 150 },
  });
  const card2Spring = spring({
    frame: localFrame,
    fps,
    delay: 16,
    config: { damping: 12, stiffness: 150 },
  });
  const card3Spring = spring({
    frame: localFrame,
    fps,
    delay: 26,
    config: { damping: 12, stiffness: 150 },
  });

  // Animated spring curve points for Bento Card 1
  const curvePoints = useMemo(() => {
    const pts = [];
    for (let x = 0; x <= 100; x += 2) {
      const val = spring({
        frame: x * 0.9,
        fps: 60,
        config: { damping: 9, stiffness: 170 },
      });
      const px = (x / 100) * 520;
      const py = 180 - val * 120;
      pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const playheadX = interpolate(localFrame % 60, [0, 59], [0, 520]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.bg,
        color: theme.fg,
        padding: '64px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Background Scrolling Kinetic Marquee */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '-20%',
          width: '150%',
          transform: 'translateY(-50%) rotate(-4deg)',
          fontSize: '230px',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          whiteSpace: 'nowrap',
          opacity: 0.08,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        SPRING() • INTERPOLATE() • SEQUENCE() • 60FPS
      </div>

      {/* Top Row: Giant Split Kinetic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
        <div>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '999px',
              background: theme.cardBg,
              color: '#ccff00',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              marginBottom: '18px',
            }}
          >
            SCENE 02 // DECLARATIVE PHYSICS
          </div>
          <h1
            style={{
              fontSize: '112px',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.045em',
              margin: 0,
              transform: `translateX(${interpolate(card1Spring, [0, 1], [-120, 0])}px)`,
            }}
          >
            PROGRAMMATIC
            <br />
            <span
              style={{
                WebkitTextStroke: `3px ${theme.fg}`,
                color: 'transparent',
              }}
            >
              KINETIC ENGINE
            </span>
          </h1>
        </div>

        {/* Frame Counter Badge */}
        <div
          style={{
            background: theme.cardBg,
            color: '#ffffff',
            padding: '28px 36px',
            borderRadius: '28px',
            textAlign: 'right',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            transform: `scale(${card1Spring})`,
          }}
        >
          <div style={{ fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>
            ACTIVE FRAME
          </div>
          <div
            style={{
              fontSize: '74px',
              fontWeight: 900,
              fontFamily: 'JetBrains Mono, monospace',
              lineHeight: 1,
              color: '#ccff00',
            }}
          >
            #{String(Math.floor(frame)).padStart(3, '0')}
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Bento Motion Telemetry Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr 1fr',
          gap: '28px',
          height: '430px',
          zIndex: 2,
        }}
      >
        {/* Card 1: Spring Oscillator Graph */}
        <div
          style={{
            background: theme.cardBg,
            color: '#ffffff',
            borderRadius: '32px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transform: `translateY(${interpolate(card1Spring, [0, 1], [140, 0])}px)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', color: '#00f5d4' }}>
              spring(&#123; damping: 9, stiffness: 170 &#125;)
            </span>
            <span
              style={{
                background: 'rgba(0, 245, 212, 0.15)',
                color: '#00f5d4',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              LIVE CURVE
            </span>
          </div>

          <svg viewBox="0 0 520 220" style={{ width: '100%', height: '210px', overflow: 'visible' }}>
            <line x1="0" y1="60" x2="520" y2="60" stroke="rgba(255,255,255,0.15)" strokeDasharray="8 8" />
            <line x1="0" y1="180" x2="520" y2="180" stroke="rgba(255,255,255,0.15)" />
            <polyline
              fill="none"
              stroke="#00f5d4"
              strokeWidth="6"
              strokeLinecap="round"
              points={curvePoints}
            />
            <line
              x1={playheadX}
              y1="10"
              x2={playheadX}
              y2="200"
              stroke="#ff2a85"
              strokeWidth="3"
            />
            <circle cx={playheadX} cy="60" r="10" fill="#ff2a85" />
          </svg>

          <div style={{ fontSize: '28px', fontWeight: 800 }}>Zero-Keyframe Harmonic Physics</div>
        </div>

        {/* Card 2: Elastic Bouncing Pill Stack */}
        <div
          style={{
            background: theme.cardBg,
            color: '#ffffff',
            borderRadius: '32px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transform: `translateY(${interpolate(card2Spring, [0, 1], [160, 0])}px)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', color: '#ccff00' }}>
            STAGGERED SEQUENCES
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: 'auto 0' }}>
            {['DESIGN', 'ANIMATE', 'RENDER MP4'].map((label, idx) => {
              const barProgress = spring({
                frame: (localFrame + idx * 12) % 60,
                fps,
                config: { damping: 10, stiffness: 160 },
              });
              const colors = ['#ccff00', '#00f5d4', '#ff2a85'];
              return (
                <div
                  key={label}
                  style={{
                    height: '58px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.07)',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 20px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${clamp(barProgress * 100, 15, 100)}%`,
                      background: colors[idx],
                      borderRadius: '16px',
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      fontWeight: 900,
                      fontSize: '22px',
                      color: '#06080e',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '28px', fontWeight: 800 }}>Multi-Layer Timing</div>
        </div>

        {/* Card 3: Radial Velocity Gauge */}
        <div
          style={{
            background: theme.cardBg,
            color: '#ffffff',
            borderRadius: '32px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: `translateY(${interpolate(card3Spring, [0, 1], [180, 0])}px)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', color: '#ff2a85' }}>
              VELOCITY VECTOR
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px' }}>100%</span>
          </div>

          <div style={{ position: 'relative', width: '210px', height: '210px' }}>
            <svg viewBox="0 0 200 200" style={{ transform: `rotate(${localFrame * 4}deg)` }}>
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="18"
              />
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#ff2a85"
                strokeWidth="18"
                strokeDasharray="360 520"
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '42px',
                fontWeight: 900,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {(1.0 + Math.sin(localFrame * 0.15) * 0.8).toFixed(1)}G
            </div>
          </div>

          <div style={{ fontSize: '28px', fontWeight: 800, width: '100%' }}>Sub-Pixel Precision</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3 (240 - 390): "3D ISOMETRIC & LIQUID MORPH"
// ============================================================================

const Scene3LiquidPrism = ({ frame, fps }: { frame: number; fps: number }) => {
  const localFrame = frame - 240; // 0 to 150
  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Orbiting liquid blobs using SVG Gooey Filter
  const blobs = [
    { r: 88, speed: 0.055, dist: 155, color: '#a855f7', offset: 0 },
    { r: 72, speed: -0.07, dist: 185, color: '#00f5d4', offset: 2.1 },
    { r: 64, speed: 0.085, dist: 140, color: '#ff2a85', offset: 4.2 },
    { r: 58, speed: -0.05, dist: 205, color: '#ccff00', offset: 1.0 },
  ];

  const splineProgress = interpolate(localFrame, [0, 120], [0, 1], {
    easing: Easing.easeInOutCubic,
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 45%, #1e1035 0%, #090514 70%, #040208 100%)',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Animated Isometric Floor Grid */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }}
      >
        <defs>
          <linearGradient id="isoSpline" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5d4" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ff2a85" />
          </linearGradient>
        </defs>

        {/* Dynamic Real-time Spline Wave */}
        <path
          d={`M 80 780 C 480 ${520 + Math.sin(localFrame * 0.08) * 180}, 860 ${
            920 - Math.cos(localFrame * 0.07) * 190
          }, 1280 ${540 + Math.sin(localFrame * 0.09) * 140} S 1680 380, 1840 620`}
          fill="none"
          stroke="url(#isoSpline)"
          strokeWidth="8"
          strokeDasharray="2200"
          strokeDashoffset={2200 * (1 - splineProgress)}
          strokeLinecap="round"
        />
        <path
          d={`M 80 340 C 520 ${680 - Math.sin(localFrame * 0.06) * 150}, 980 ${
            240 + Math.cos(localFrame * 0.08) * 160
          }, 1440 ${660 - Math.sin(localFrame * 0.07) * 140} S 1720 500, 1840 320`}
          fill="none"
          stroke="rgba(0, 245, 212, 0.45)"
          strokeWidth="4"
          strokeDasharray="16 14"
          strokeDashoffset={-localFrame * 6}
        />
      </svg>

      {/* Center Gooey Liquid Metaballs + 3D Isometric Prism */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG Gooey Filter Metaballs */}
        <svg
          width="900"
          height="900"
          viewBox="-450 -450 900 900"
          style={{ position: 'absolute', transform: `scale(${enterSpring})` }}
        >
          <defs>
            <filter id="remotionGooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>

          <g filter="url(#remotionGooey)">
            {/* Central Core Blob */}
            <circle
              cx="0"
              cy="0"
              r={118 + Math.sin(localFrame * 0.1) * 16}
              fill="#a855f7"
            />
            {/* Orbiting Liquid Droplets */}
            {blobs.map((b, i) => {
              const angle = localFrame * b.speed + b.offset;
              const radiusMod = Math.sin(localFrame * 0.07 + i * 1.4) * b.dist;
              const cx = Math.cos(angle) * radiusMod;
              const cy = Math.sin(angle * 1.3) * radiusMod;
              return <circle key={i} cx={cx} cy={cy} r={b.r} fill={b.color} />;
            })}
          </g>
        </svg>

        {/* Rotating 3D Isometric Wireframe Rings */}
        <div
          style={{
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            border: '3px solid rgba(0, 245, 212, 0.7)',
            transform: `rotateX(65deg) rotateY(${localFrame * 1.8}deg) rotateZ(${localFrame * 1.2}deg)`,
            boxShadow: '0 0 40px rgba(0, 245, 212, 0.35)',
            position: 'absolute',
          }}
        />
        <div
          style={{
            width: '620px',
            height: '620px',
            borderRadius: '50%',
            border: '2px dashed rgba(204, 255, 0, 0.65)',
            transform: `rotateX(55deg) rotateY(${-localFrame * 1.5}deg) rotateZ(${-localFrame * 0.9}deg)`,
            position: 'absolute',
          }}
        />
      </div>

      {/* Floating Glassmorphic HUD Telemetry Panels */}
      <div
        style={{
          position: 'absolute',
          inset: '64px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                color: '#00f5d4',
                fontSize: '20px',
                letterSpacing: '0.2em',
                marginBottom: '10px',
              }}
            >
              SCENE 03 // PROCEDURAL SHADERS & SVG FILTERS
            </div>
            <h2
              style={{
                fontSize: '82px',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                margin: 0,
                lineHeight: 0.95,
              }}
            >
              LIQUID MORPH
              <br />
              <span style={{ color: '#c084fc' }}>&amp; 3D ORBITALS</span>
            </h2>
          </div>

          {/* Right HUD Telemetry Box */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(168, 85, 247, 0.45)',
              borderRadius: '24px',
              padding: '24px 32px',
              fontFamily: 'JetBrains Mono, monospace',
              width: '380px',
            }}
          >
            <div style={{ color: '#c084fc', fontSize: '16px', marginBottom: '12px' }}>
              {'// GOOEY MATRIX KERNEL'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>STD_DEVIATION:</span>
              <span style={{ color: '#00f5d4' }}>24.0px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>ORBIT_PITCH:</span>
              <span style={{ color: '#ccff00' }}>{(localFrame * 1.8).toFixed(1)}°</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
              <span style={{ color: '#94a3b8' }}>SPLINE_DRAW:</span>
              <span style={{ color: '#ff2a85' }}>{Math.round(splineProgress * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            {['SVG FEGAUSSIANBLUR', '3D MATRIX TRANSFORMS', 'BEZIER SPLINES'].map((tag, i) => (
              <span
                key={tag}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: i === 0 ? '#00f5d4' : i === 1 ? '#ccff00' : '#ff2a85',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '22px',
              color: '#cbd5e1',
            }}
          >
            TIME // {(frame / 60).toFixed(2)}s
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4 (390 - 510): "HYPER-SPEED SHOWCASE" — Fast-Cut Slam Sequence
// ============================================================================

const Scene4HyperSpeed = ({ frame, fps }: { frame: number; fps: number }) => {
  const localFrame = frame - 390; // 0 to 120
  // 4 rapid sub-cuts of 30 frames (0.5s each)
  const cutIndex = Math.min(3, Math.floor(localFrame / 30));
  const subFrame = localFrame % 30;

  const cuts = [
    { word: 'DESIGN.', sub: 'PIXEL-PERFECT VECTOR ARCHITECTURE', bg: '#ff2a85', fg: '#ffffff', accent: '#ccff00' },
    { word: 'CODE.', sub: 'REACT + TYPESCRIPT DECLARATIVE TIMELINES', bg: '#050811', fg: '#00f5d4', accent: '#ff2a85' },
    { word: 'MOTION.', sub: '60FPS HARMONIC SPRING DYNAMICS', bg: '#ccff00', fg: '#06080f', accent: '#7b2cbf' },
    { word: 'MAGIC.', sub: 'INFINITE PROGRAMMATIC VIDEO SCALE', bg: '#6d28d9', fg: '#ffffff', accent: '#00f5d4' },
  ];

  const active = cuts[cutIndex];

  const slamScale = spring({
    frame: subFrame,
    fps,
    config: { damping: 9, stiffness: 240, mass: 0.7 },
    from: 2.3,
    to: 1,
  });

  // Camera shake on impact (first 8 frames of each cut)
  const shakeIntensity = subFrame < 8 ? (8 - subFrame) * 3.5 : 0;
  const shakeX = Math.sin(frame * 2.8) * shakeIntensity;
  const shakeY = Math.cos(frame * 3.4) * shakeIntensity;

  // Shockwave ring expansion
  const ringScale = interpolate(subFrame, [0, 28], [0.2, 3.2], {
    easing: Easing.easeOutExpo,
  });
  const ringOpacity = interpolate(subFrame, [0, 22, 29], [0.85, 0.25, 0]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: active.bg,
        color: active.fg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Expanding Radial Shockwave */}
      <div
        style={{
          position: 'absolute',
          width: '680px',
          height: '680px',
          borderRadius: '50%',
          border: `8px solid ${active.accent}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Glitch Slice Bars */}
      {subFrame < 6 &&
        [0, 1, 2, 3].map((bar) => (
          <div
            key={bar}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${18 + bar * 22}%`,
              height: '28px',
              background: active.accent,
              opacity: 0.65,
              transform: `translateX(${(bar % 2 === 0 ? 1 : -1) * 120}px)`,
            }}
          />
        ))}

      {/* Step Counter Pill */}
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '24px',
          fontWeight: 800,
          letterSpacing: '0.28em',
          padding: '10px 28px',
          borderRadius: '999px',
          border: `2px solid ${active.fg}`,
          marginBottom: '24px',
        }}
      >
        BEAT 0{cutIndex + 1} / 04
      </div>

      {/* Giant Slam Word */}
      <div
        style={{
          fontSize: '260px',
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: '-0.06em',
          transform: `scale(${slamScale})`,
          textAlign: 'center',
        }}
      >
        {active.word}
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: '36px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          padding: '12px 32px',
          background: active.fg,
          color: active.bg,
          borderRadius: '12px',
        }}
      >
        {active.sub}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 5 (510 - 600): "THE FINALE" — Supernova Reveal & Exponential Settle
// ============================================================================

const Scene5Finale = ({ frame, fps }: { frame: number; fps: number }) => {
  const localFrame = frame - 510; // 0 to 90

  const badgeSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 130, mass: 1 },
  });

  const particles = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => {
      const angle = (i / 36) * Math.PI * 2;
      const speed = 180 + (i % 5) * 95;
      const size = 6 + (i % 4) * 5;
      const colors = ['#00f5d4', '#ccff00', '#ff2a85', '#a855f7', '#38bdf8'];
      return { angle, speed, size, color: colors[i % colors.length] };
    });
  }, []);

  const burstProgress = interpolate(localFrame, [0, 75], [0, 1], {
    easing: Easing.easeOutExpo,
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, #111827 0%, #05070e 65%, #020306 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Supernova Particle Burst */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {particles.map((p, idx) => {
          const dist = burstProgress * p.speed * 2.2;
          const x = Math.cos(p.angle + localFrame * 0.005) * dist;
          const y = Math.sin(p.angle + localFrame * 0.005) * dist;
          const opacity = interpolate(localFrame, [0, 15, 75, 90], [0, 1, 0.8, 0.2]);
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: idx % 2 === 0 ? '50%' : '4px',
                background: p.color,
                boxShadow: `0 0 20px ${p.color}`,
                transform: `translate(${x}px, ${y}px) rotate(${localFrame * 4}deg)`,
                opacity,
              }}
            />
          );
        })}
      </div>

      {/* Glowing Center Badge */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          transform: `scale(${0.7 + badgeSpring * 0.3})`,
          opacity: clamp(badgeSpring, 0, 1),
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 32px',
            borderRadius: '999px',
            background: 'rgba(0, 245, 212, 0.12)',
            border: '2px solid rgba(0, 245, 212, 0.5)',
            color: '#00f5d4',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            marginBottom: '32px',
          }}
        >
          <span>★</span> MOTION STUDIO // 2026 <span>★</span>
        </div>

        <h1
          style={{
            fontSize: '142px',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.92,
            margin: 0,
            background: 'linear-gradient(135deg, #ffffff 0%, #00f5d4 50%, #ccff00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          INCREDIBLE
          <br />
          MOTION.
        </h1>

        <p
          style={{
            marginTop: '28px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '24px',
            color: '#94a3b8',
            letterSpacing: '0.18em',
          }}
        >
          BUILT WITH HTML • CSS • JS • REMOTION ARCHITECTURE
        </p>

        {/* Specs Footer Pills */}
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {['1920×1080 HD', '60 FPS LOCKED', '600 FRAMES', '10.00 SECONDS'].map((spec) => (
            <div
              key={spec}
              style={{
                padding: '12px 26px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '18px',
                color: '#e2e8f0',
              }}
            >
              {spec}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CLEAN REMOTION CLI EXPORT CODE GENERATOR
// ============================================================================

const REMOTION_EXPORT_CODE = `// Remotion 4.x Production Composition (1920x1080 @ 60fps, 10 Seconds / 600 Frames)
// Run with: npx remotion studio
import React from 'react';
import {
  Composition,
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="IncredibleMotionShowreel"
      component={MasterShowreel}
      durationInFrames={600}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};

export const MasterShowreel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#05070f' }}>
      {/* SCENE 1: 0s - 2s (Frames 0 - 120) */}
      <Sequence from={0} durationInFrames={120} name="01_TheSpark">
        <Scene1Spark frame={frame} fps={fps} />
      </Sequence>

      {/* SCENE 2: 2s - 4s (Frames 120 - 240) */}
      <Sequence from={120} durationInFrames={120} name="02_KineticTypography">
        <Scene2KineticType frame={frame} fps={fps} />
      </Sequence>

      {/* SCENE 3: 4s - 6.5s (Frames 240 - 390) */}
      <Sequence from={240} durationInFrames={150} name="03_LiquidPrism3D">
        <Scene3LiquidPrism frame={frame} fps={fps} />
      </Sequence>

      {/* SCENE 4: 6.5s - 8.5s (Frames 390 - 510) */}
      <Sequence from={390} durationInFrames={120} name="04_HyperSpeedRhythm">
        <Scene4HyperSpeed frame={frame} fps={fps} />
      </Sequence>

      {/* SCENE 5: 8.5s - 10s (Frames 510 - 600) */}
      <Sequence from={510} durationInFrames={90} name="05_SupernovaFinale">
        <Scene5Finale frame={frame} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};`;

// ============================================================================
// MAIN STUDIO APPLICATION
// ============================================================================

export default function App() {
  const FPS = 60;
  const DURATION_IN_FRAMES = 600; // 10.00 seconds

  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSafeGrid, setShowSafeGrid] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState(0.5);

  // Compute responsive 16:9 scale factor so the 1920x1080 composition fits crisply
  useEffect(() => {
    const updateScale = () => {
      if (!stageWrapperRef.current) return;
      const rect = stageWrapperRef.current.getBoundingClientRect();
      const pad = 24;
      const availW = Math.max(280, rect.width - pad);
      const availH = Math.max(160, rect.height - pad);
      const scaleW = availW / 1920;
      const scaleH = availH / 1080;
      setStageScale(Math.min(scaleW, scaleH));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // 60 FPS RequestAnimationFrame Timeline Loop
  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaMs = now - lastTime;
      lastTime = now;
      const frameDelta = (deltaMs / 1000) * FPS * speed;

      setFrame((prev) => {
        const next = prev + frameDelta;
        if (next >= DURATION_IN_FRAMES - 1) {
          if (loop) {
            return next % DURATION_IN_FRAMES;
          } else {
            setIsPlaying(false);
            return DURATION_IN_FRAMES - 1;
          }
        }
        return next;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, loop, speed]);

  // Trigger procedural Web Audio cues on frame changes
  useEffect(() => {
    if (isPlaying && !isMuted) {
      audioEngine.triggerForFrame(frame);
    }
  }, [frame, isPlaying, isMuted]);

  const togglePlay = useCallback(() => {
    audioEngine.init();
    setIsPlaying((prev) => {
      if (!prev && frame >= DURATION_IN_FRAMES - 1) {
        setFrame(0);
      }
      return !prev;
    });
  }, [frame]);

  // Keyboard shortcuts (Space to Play/Pause, Left/Right arrows to step frames)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        setIsPlaying(false);
        setFrame((f) => Math.min(DURATION_IN_FRAMES - 1, Math.floor(f) + 1));
      } else if (e.code === 'ArrowLeft') {
        setIsPlaying(false);
        setFrame((f) => Math.max(0, Math.floor(f) - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [togglePlay]);

  const currentScene = useMemo(() => {
    return (
      SCENES.find((s) => frame >= s.startFrame && frame < s.endFrame) ||
      SCENES[SCENES.length - 1]
    );
  }, [frame]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(REMOTION_EXPORT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedSeconds = (frame / FPS).toFixed(2).padStart(5, '0');
  const displayFrame = String(Math.floor(frame)).padStart(3, '0');

  return (
    <div className="min-h-screen w-full bg-[#070910] text-slate-100 flex flex-col select-none overflow-hidden font-sans">
      {/* TOP STUDIO HEADER BAR */}
      <header className="h-14 px-4 lg:px-6 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-lime-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-sm md:text-base text-white">
                REMOTION STUDIO
              </span>
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                16:9 • 1080p60
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Composition: &lt;IncredibleMotionShowreel /&gt; • 600 Frames (10.00s)
            </p>
          </div>
        </div>

        {/* Active Scene Indicator Pill */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: currentScene.color }}
          />
          <span className="text-xs font-mono font-bold text-white">{currentScene.name}</span>
          <span className="text-xs text-slate-400">— {currentScene.subtitle}</span>
        </div>

        {/* Right Studio Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSafeGrid((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition ${
              showSafeGrid
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 16:9 Broadcast Safe Guides"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guides</span>
          </button>

          <button
            onClick={() => {
              audioEngine.init();
              setIsMuted((m) => !m);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition ${
              !isMuted
                ? 'bg-lime-400/15 text-lime-300 border-lime-400/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Synthesized Motion SFX"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'SFX On'}</span>
          </button>

          <button
            onClick={() => setShowCodeModal(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 transition shadow-md shadow-cyan-500/10"
          >
            <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Remotion Code</span>
          </button>
        </div>
      </header>

      {/* CENTER WORKSPACE: 16:9 STAGE + SCENE INSPECTOR */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* 16:9 LETTERBOXED STAGE VIEWPORT */}
        <div
          ref={stageWrapperRef}
          onClick={togglePlay}
          className="flex-1 relative flex items-center justify-center bg-[#04060b] overflow-hidden cursor-pointer"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Scaled 1920x1080 Master Composition Container */}
          <div
            style={{
              width: `${1920 * stageScale}px`,
              height: `${1080 * stageScale}px`,
              position: 'relative',
              boxShadow: '0 30px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#05070f',
            }}
          >
            <div
              style={{
                width: '1920px',
                height: '1080px',
                transform: `scale(${stageScale})`,
                transformOrigin: 'top left',
                position: 'relative',
              }}
            >
              {/* Render Active Remotion Sequence */}
              {frame < 120 && <Scene1Spark frame={frame} fps={FPS} />}
              {frame >= 120 && frame < 240 && <Scene2KineticType frame={frame} fps={FPS} />}
              {frame >= 240 && frame < 390 && <Scene3LiquidPrism frame={frame} fps={FPS} />}
              {frame >= 390 && frame < 510 && <Scene4HyperSpeed frame={frame} fps={FPS} />}
              {frame >= 510 && <Scene5Finale frame={frame} fps={FPS} />}

              {/* Optional Broadcast Title-Safe & Action-Safe Overlay */}
              {showSafeGrid && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 50,
                  }}
                >
                  {/* 90% Action Safe */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '54px 96px',
                      border: '2px dashed rgba(0, 245, 212, 0.45)',
                    }}
                  />
                  {/* 80% Title Safe */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '108px 192px',
                      border: '2px solid rgba(204, 255, 0, 0.35)',
                    }}
                  />
                  {/* Center Crosshair */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Floating Pause Badge when paused */}
          {!isPlaying && (
            <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-slate-700/80 text-xs font-mono text-slate-300 flex items-center gap-2 backdrop-blur-md">
              <Pause className="w-3.5 h-3.5 text-cyan-400" />
              <span>PAUSED — Click Stage or Press Space</span>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: SCENE JUMP & LIVE TELEMETRY */}
        <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-[#0b0f19] p-3.5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Sequence Stack (5)
              </span>
              <span className="text-xs font-mono text-slate-500">10.0s Total</span>
            </div>

            {/* Scene Sequence Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-1 gap-2">
              {SCENES.map((s) => {
                const isActive = frame >= s.startFrame && frame < s.endFrame;
                const progress = isActive
                  ? ((frame - s.startFrame) / (s.endFrame - s.startFrame)) * 100
                  : frame >= s.endFrame
                  ? 100
                  : 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      audioEngine.init();
                      setFrame(s.startFrame);
                    }}
                    className={`text-left p-2.5 rounded-xl border transition relative overflow-hidden ${
                      isActive
                        ? 'bg-slate-900 border-slate-600 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="absolute bottom-0 left-0 h-0.5 transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: s.color,
                      }}
                    />
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-xs font-mono font-bold truncate"
                        style={{ color: isActive ? s.color : '#e2e8f0' }}
                      >
                        {s.name}
                      </span>
                      <span className="text-xs font-mono text-slate-500 shrink-0">
                        {s.startFrame}-{s.endFrame}f
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 hidden lg:block">
                      {s.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Composition Telemetry Card */}
          <div className="hidden lg:block mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs space-y-1.5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              useCurrentFrame() Hook
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frame:</span>
              <span className="text-cyan-300 font-bold">{displayFrame} / 600</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timecode:</span>
              <span className="text-lime-300 font-bold">{formattedSeconds}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Aspect:</span>
              <span className="text-white">16:9 (1920×1080)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Viewport Scale:</span>
              <span className="text-purple-300">{Math.round(stageScale * 100)}%</span>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM REMOTION TIMELINE CONTROLLER */}
      <footer className="bg-[#0b0f19] border-t border-slate-800/90 px-4 lg:px-6 py-3 shrink-0 z-20">
        {/* Scene Track Bar + Interactive Scrubber */}
        <div className="relative mb-3">
          {/* Colored Scene Segments Bar */}
          <div className="h-3 w-full rounded-lg bg-slate-900 overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
            {SCENES.map((s) => {
              const widthPct = ((s.endFrame - s.startFrame) / DURATION_IN_FRAMES) * 100;
              return (
                <div
                  key={s.id}
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: s.color,
                    opacity: frame >= s.startFrame && frame < s.endFrame ? 0.9 : 0.28,
                  }}
                  className="h-full first:rounded-l last:rounded-r transition-opacity"
                />
              );
            })}
          </div>

          {/* Range Input Scrubber Overlay */}
          <input
            type="range"
            min={0}
            max={DURATION_IN_FRAMES - 1}
            step={1}
            value={Math.floor(frame)}
            onChange={(e) => {
              setIsPlaying(false);
              setFrame(Number(e.target.value));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Frame Scrubber"
          />

          {/* Playhead Indicator */}
          <div
            style={{
              left: `${(frame / (DURATION_IN_FRAMES - 1)) * 100}%`,
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-5 rounded bg-white shadow-lg shadow-cyan-500/50 border-2 border-slate-950 pointer-events-none"
          />
        </div>

        {/* Transport Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Play/Pause, Step, Restart */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 transition shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setFrame((f) => Math.max(0, Math.floor(f) - 1));
              }}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Previous Frame (Left Arrow)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setFrame((f) => Math.min(DURATION_IN_FRAMES - 1, Math.floor(f) + 1));
              }}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Next Frame (Right Arrow)"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                audioEngine.init();
                setFrame(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Restart from Frame 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Digital Timecode Readout */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm">
            <span className="text-cyan-400 font-bold">FRAME {displayFrame}</span>
            <span className="text-slate-600">|</span>
            <span className="text-lime-400 font-bold">{formattedSeconds}s / 10.00s</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">60 FPS</span>
          </div>

          {/* Right: Speed Selector & Loop Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                    speed === spd
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setLoop((l) => !l)}
              className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition ${
                loop
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle Loop"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Loop</span>
            </button>
          </div>
        </div>
      </footer>

      {/* REMOTION CODE INSPECTOR MODAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Remotion &lt;Composition /&gt; Architecture (1920×1080 @ 60fps)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-400 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
            <pre className="p-5 text-xs font-mono text-cyan-200 bg-slate-950 overflow-auto flex-1 leading-relaxed select-all">
              {REMOTION_EXPORT_CODE}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}