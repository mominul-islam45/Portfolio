'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface GalleryItem {
  image: string;
  alt?: string;
}

interface AccordionGalleryProps {
  items?: GalleryItem[];
  defaultIndex?: number;
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  grayscale?: boolean;
  accentColor?: string;
}

const defaultItems: GalleryItem[] = Array.from({ length: 5 }, (_, i) => ({
  image: `/Thumbnails/${i + 1}.webp`,
  alt: `Thumbnail ${i + 1}`,
}));

export default function AccordionGallery({
  items = defaultItems,
  defaultIndex = 2,
  duration = 0.27,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  height = 340,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  grayscale = true,
  accentColor = '#ffffff',
}: AccordionGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const isHorizontal = orientation === 'horizontal';
    const totalPanels = items.length;
    const containerSize = isHorizontal
      ? containerRef.current.clientWidth
      : containerRef.current.clientHeight;

    // Calculate panel widths
    const expandedSize = containerSize * expandRatio;
    const collapsedSize = (containerSize - expandedSize - (totalPanels - 1) * gap) / (totalPanels - 1);

    // Animate panels
    panelsRef.current.forEach((panel, index) => {
      const isActive = index === activeIndex;
      const size = isActive ? expandedSize : collapsedSize;

      gsap.to(panel, {
        [isHorizontal ? 'width' : 'height']: size,
        duration,
        ease,
        overwrite: 'auto',
      });

      // Grayscale effect
      if (grayscale) {
        gsap.to(panel, {
          filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
          duration,
          ease,
          overwrite: 'auto',
        });
      }

      // 3D tilt effect on collapsed panels
      if (!isActive && tilt > 0) {
        gsap.to(panel, {
          rotationY: index < activeIndex ? tilt : -tilt,
          duration,
          ease,
          overwrite: 'auto',
        });
      } else {
        gsap.to(panel, {
          rotationY: 0,
          duration,
          ease,
          overwrite: 'auto',
        });
      }

      // Parallax effect on images
      if (isActive && imageRefs.current[index] && parallax > 0) {
        gsap.to(imageRefs.current[index], {
          backgroundPosition: `50% 0%`,
          duration,
          ease,
          overwrite: 'auto',
        });
      }
    });
  }, [activeIndex, items.length, duration, ease, tilt, grayscale, parallax, expandRatio, gap, orientation]);

  const handlePanelInteraction = (index: number) => {
    if (trigger === 'click' || isMobile) {
      setActiveIndex(index);
    }
  };

  const handlePanelHover = (index: number) => {
    if (trigger === 'hover' && !isMobile) {
      setActiveIndex(index);
    }
  };

  const isHorizontal = orientation === 'horizontal';
  const dimension = isHorizontal ? height : 'auto';
  const containerStyle: React.CSSProperties = isHorizontal
    ? { height: dimension, display: 'flex', gap, perspective: '1000px' }
    : { display: 'flex', flexDirection: 'column', gap, perspective: '1000px' };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={containerStyle}
    >
      {items.map((item, index) => (
        <div
          key={`${item.image}-${index}`}
          ref={(el) => {
            if (el) panelsRef.current[index] = el;
          }}
          className="relative shrink-0 cursor-pointer overflow-hidden transition-all"
          style={{
            width: isHorizontal ? 'auto' : '100%',
            height: isHorizontal ? '100%' : 'auto',
            borderRadius: `${radius}px`,
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={() => handlePanelHover(index)}
          onClick={() => handlePanelInteraction(index)}
        >
          <div
            ref={(el) => {
              if (el) imageRefs.current[index] = el;
            }}
            className="relative w-full h-full"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: '50% 50%',
            }}
          >
            <Image
              src={item.image}
              alt={item.alt || `Gallery item ${index + 1}`}
              fill
              className="object-cover"
              quality={85}
              priority={index === activeIndex}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
