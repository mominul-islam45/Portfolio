"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import Image from 'next/image';

type Slide = {
  image: string;
  title: string;
};

type Smooth3DSlideshowProps = {
  slides: Slide[];
  autoplay?: boolean;
  autoplayDirection?: 'leftToRight' | 'rightToLeft';
  delay?: number;
};

const PERSPECTIVE = 1600;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
const DEPTH = 240;
const TRANSITION = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

export default function Smooth3DSlideshow({
  slides,
  autoplay = true,
  autoplayDirection = 'rightToLeft',
  delay = 2.5,
}: Smooth3DSlideshowProps) {
  const [active, setActive] = useState(0);
  const lockRef = useRef(false);
  const slideCount = slides.length;

  const move = useCallback((direction: number) => {
    if (lockRef.current || slideCount < 2) return;

    lockRef.current = true;
    setActive((current) => (current + direction + slideCount) % slideCount);
    window.setTimeout(() => {
      lockRef.current = false;
    }, 600);
  }, [slideCount]);

  useEffect(() => {
    if (!autoplay || slideCount < 2) return;

    const direction = autoplayDirection === 'leftToRight' ? -1 : 1;
    const interval = window.setInterval(() => move(direction), Math.max(0.3, delay) * 1000);
    return () => window.clearInterval(interval);
  }, [autoplay, autoplayDirection, delay, move, slideCount]);

  const selectSlide = useCallback((index: number) => {
    if (autoplay || lockRef.current || slideCount < 2) return;
    if (index === active) {
      move(1);
      return;
    }

    lockRef.current = true;
    setActive(index);
    window.setTimeout(() => {
      lockRef.current = false;
    }, 600);
  }, [active, autoplay, move, slideCount]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
  };

  return (
    <div
      className="relative flex min-h-80 w-full items-center justify-center overflow-hidden outline-none sm:min-h-105"
      style={{ perspective: `${PERSPECTIVE}px` }}
      tabIndex={0}
      role="group"
      aria-label="Graphic design work gallery"
      onKeyDown={handleKeyDown}
    >
      <div className="relative aspect-square w-[min(64vw,400px)] sm:w-[min(54vw,500px)]" style={{ transformStyle: 'preserve-3d' }}>
        {slides.map((slide, index) => {
          let relative = index - active;
          if (relative > slideCount / 2) relative -= slideCount;
          if (relative < -slideCount / 2) relative += slideCount;

          const distance = Math.abs(relative);
          const isVisible = distance <= MAX_VISIBLE;
          const isActive = relative === 0;
          const scale = Math.max(0.4, 1 - distance * SCALE_STEP);
          const cardStyle: CSSProperties = {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '100%',
            height: '100%',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            transform: `translate(-50%, -50%) translateX(${relative * 240}px) translateZ(${-distance * DEPTH}px) rotateY(${-relative * 12}deg) rotateZ(${relative * 8}deg) scale(${scale})`,
            transition: TRANSITION,
            opacity: isVisible ? 1 : 0,
            cursor: isActive ? 'default' : 'pointer',
            pointerEvents: isVisible ? 'auto' : 'none',
            zIndex: isActive ? 10 : 5 - distance,
          };

          return (
            <button
              key={slide.image}
              type="button"
              style={cardStyle}
              onClick={() => selectSlide(index)}
              aria-label={`View ${slide.title}`}
              aria-hidden={!isVisible}
              className="group border border-zinc-200 bg-zinc-950 text-left shadow-2xs dark:border-zinc-800"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(max-width: 640px) 78vw, 68vw"
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-500"
                style={{ opacity: isActive ? 0 : 0.58 }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
