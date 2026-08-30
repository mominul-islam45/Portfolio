"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import PillNav from './PillNav';
import BubbleMenu from './BubbleMenu';

const navItems = [
  { label: 'Portfolio', href: '/', ariaLabel: 'Portfolio', rotation: -6, hoverStyles: { bgColor: '#111', textColor: '#fff' } },
  { label: 'Experience', href: '/experience', ariaLabel: 'Experience', rotation: 6, hoverStyles: { bgColor: '#111', textColor: '#fff' } },
  { label: 'Video Editing', href: '/video-editing', ariaLabel: 'Video Editing', rotation: -8, hoverStyles: { bgColor: '#111', textColor: '#fff' } },
  { label: 'Graphic Design', href: '/graphic-design', ariaLabel: 'Graphic Design', rotation: 8, hoverStyles: { bgColor: '#111', textColor: '#fff' } },
  { label: 'About me', href: '/about-me', ariaLabel: 'About me', rotation: -6, hoverStyles: { bgColor: '#111', textColor: '#fff' } }
];

const logoSvgUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23111111'/><text x='50' y='68' font-family='system-ui, sans-serif' font-weight='bold' font-size='55' fill='%23ffffff' text-anchor='middle'>M</text></svg>";

const logoReactNode = (
  <span className="text-2xl font-black text-black leading-none select-none">
    M
  </span>
);

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation (>= 900px) */}
      <div className="hidden min-[900px]:flex justify-center w-full fixed top-6 left-0 right-0 z-1000 pointer-events-none font-sans">
        <div className="absolute inset-x-0 -top-6 h-28 bg-linear-to-b from-white/70 via-white/5 to-transparent dark:from-black/70 dark:via-black/5 backdrop-blur-md mask-[linear-gradient(to_bottom,black_0%,black_48%,transparent_100%)]" aria-hidden="true" />
        <div className="relative z-10 pointer-events-auto">
          <PillNav
            logo={logoSvgUrl}
            logoAlt="Logo"
            items={navItems}
            activeHref={pathname || "/"}
            baseColor="#111"
            pillColor="#f4f4f5"
            hoveredPillTextColor="#fff"
            pillTextColor="#111"
            initialLoadAnimation={true}
          />
        </div>
      </div>

      {/* Mobile Navigation (< 900px) */}
      <div className="block min-[900px]:hidden font-sans">
        <BubbleMenu
          logo={logoReactNode}
          menuBg="#fff"
          menuContentColor="#111"
          useFixedPosition={true}
          items={navItems}
        />
      </div>
    </>
  );
}

