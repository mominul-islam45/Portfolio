'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';

type MagneticItem = { src: string; alt: string };
type Transition = { duration?: number; ease?: string | [number, number, number, number] };
type MagneticCarouselProps = {
  images?: MagneticItem[];
  collapsedWidth?: number;
  hoverWidth?: number;
  collapsedHeight?: number;
  hoverHeight?: number;
  openSize?: number;
  gap?: number;
  influence?: number;
  blur?: number;
  transition?: Transition;
  style?: CSSProperties;
};

const thumbnailImages: MagneticItem[] = Array.from({ length: 8 }, (_, index) => ({
  src: `/Thumbnails/${index + 1}.webp`,
  alt: `Video thumbnail ${index + 1}`,
}));

function easing(value: Transition['ease']) {
  if (Array.isArray(value) && value.length === 4) return `cubic-bezier(${value.join(',')})`;
  if (value === 'linear' || value === 'easeIn' || value === 'easeOut' || value === 'easeInOut') {
    return value.replace('easeInOut', 'ease-in-out').replace('easeIn', 'ease-in').replace('easeOut', 'ease-out');
  }
  return 'ease-in-out';
}

export default function MagneticCarousel({
  images = thumbnailImages,
  collapsedWidth = 78,
  hoverWidth = 150,
  collapsedHeight = 260,
  hoverHeight = 320,
  openSize = 500,
  gap = 12,
  influence = 220,
  blur = 2,
  transition = { duration: 0.35, ease: 'easeInOut' },
  style,
}: MagneticCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<number[]>(images.map(() => 0));
  const currentRef = useRef<number[]>(images.map(() => 0));
  const frameRef = useRef(0);
  const [factors, setFactors] = useState<number[]>(() => images.map(() => 0));
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    targetRef.current = images.map(() => 0);
    currentRef.current = images.map(() => 0);
  }, [images]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const startAnimation = () => {
    if (frameRef.current) return;
    const step = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      let moving = false;
      current.forEach((value, index) => {
        const difference = (target[index] ?? 0) - value;
        if (Math.abs(difference) > 0.001) {
          current[index] += difference * 0.2;
          moving = true;
        } else current[index] = target[index] ?? 0;
      });
      setFactors([...current]);
      frameRef.current = moving ? requestAnimationFrame(step) : 0;
    };
    frameRef.current = requestAnimationFrame(step);
  };

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (openIndex !== null) return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const cursorX = event.clientX - bounds.left;
    const totalWidth = images.length * collapsedWidth + Math.max(0, images.length - 1) * gap;
    const startX = (bounds.width - totalWidth) / 2;
    targetRef.current = images.map((_, index) => {
      const center = startX + index * (collapsedWidth + gap) + collapsedWidth / 2;
      const normalized = Math.max(0, 1 - Math.abs(cursorX - center) / influence);
      return normalized * normalized * (3 - 2 * normalized);
    });
    startAnimation();
  };

  const resetMagnify = () => {
    if (openIndex === null) {
      targetRef.current = images.map(() => 0);
      startAnimation();
    }
  };

  const duration = Math.max(0.05, transition.duration ?? 0.35);
  const barTransition = `width ${duration}s ${easing(transition.ease)}, height ${duration}s ${easing(transition.ease)}, filter ${duration}s ${easing(transition.ease)}, opacity ${duration}s ${easing(transition.ease)}`;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Thumbnail design gallery"
      tabIndex={0}
      className="relative flex min-h-96 w-full items-center justify-center overflow-visible outline-none"
      style={{ gap, ...style }}
      onMouseMove={handleMove}
      onMouseLeave={resetMagnify}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && openIndex !== null) setOpenIndex(null);
      }}
    >
      {images.map((item, index) => {
        const factor = factors[index] ?? 0;
        const isOpen = openIndex === index;
        const isBlurred = openIndex !== null && !isOpen;
        const width = isOpen ? openSize : collapsedWidth + (hoverWidth - collapsedWidth) * factor;
        const height = isOpen ? openSize : collapsedHeight + (hoverHeight - collapsedHeight) * factor;
        return (
          <button
            key={item.src}
            type="button"
            aria-label={isOpen ? `Close ${item.alt}` : `Open ${item.alt}`}
            onClick={() => setOpenIndex(isOpen ? null : index)}
            className="relative shrink-0 overflow-hidden border-0 bg-zinc-200 p-0 dark:bg-zinc-800"
            style={{ width, height, cursor: 'pointer', transition: barTransition, zIndex: isOpen ? 3 : 2, filter: isBlurred ? `blur(${blur}px)` : 'none', opacity: isBlurred ? 0.55 : 1 }}
          >
            <Image src={item.src} alt={item.alt} fill sizes={`${openSize}px`} className="object-cover" draggable={false} />
          </button>
        );
      })}
      {openIndex !== null && (
        <button type="button" aria-label="Close enlarged thumbnail" onClick={() => setOpenIndex(null)} className="absolute inset-0 z-1 cursor-default border-0 bg-transparent" />
      )}
    </div>
  );
}