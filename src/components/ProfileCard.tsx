'use client';

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';

type ProfileCardProps = {
  avatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  className?: string;
  aspectRatio?: number | string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  behindGlowEnabled?: boolean;
  showUserInfo?: boolean;
  onContactClick?: () => void;
};

export default function ProfileCard({
  avatarUrl = '/My_image.png',
  name = 'Mominul I. Kawser',
  title = 'Video & Motion Designer',
  handle = 'mominul i. kawser',
  status = 'Online',
  className = '',
  aspectRatio = 0.82,
  enableTilt = true,
  enableMobileTilt = false,
  showUserInfo = true,
  onContactClick,
}: ProfileCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!enableTilt || (event.pointerType === 'touch' && !enableMobileTilt)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -12;
    setRotation({ x: y, y: x });
  };

  const resetRotation = () => setRotation({ x: 0, y: 0 });
  const cardStyle = {
    '--card-rotate-x': `${rotation.x}deg`,
    '--card-rotate-y': `${rotation.y}deg`,
  } as CSSProperties;

  return (
    <ScrollAnimation direction="up" delay={0.15} className={`relative w-[min(65vw,240px)] ${className}`.trim()}>
      <article
        ref={cardRef}
        className="group relative h-auto overflow-hidden rounded-[30px] border border-white/20 bg-[#211b20] shadow-2xl transition-transform duration-500 ease-out"
        style={{ ...cardStyle, aspectRatio, transform: 'perspective(900px) rotateX(var(--card-rotate-x)) rotateY(var(--card-rotate-y))' }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetRotation}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_15%,rgba(255,214,179,0.5),transparent_28%),linear-gradient(145deg,#542d3b,#17151d_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25),transparent_35%,rgba(255,255,255,0.08))] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          src={avatarUrl}
          alt={`${name} portrait`}
          className="absolute inset-x-0 bottom-0 z-1 h-full w-full object-contain object-bottom mix-blend-normal transition-transform duration-500 group-hover:scale-[1.02]"
          loading="eager"
        />
        <div className="absolute inset-x-5 top-5 z-2 text-center text-white drop-shadow-lg">
          <h2 className="text-xl font-semibold tracking-tight">{name}</h2>
          <p className="mt-1 text-xs text-white/75">{title}</p>
        </div>
        {showUserInfo && (
          <div className="absolute inset-x-5 bottom-5 z-2 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/25 p-2 text-white backdrop-blur-xl">
            <div className="min-w-0">
              {/* <p className="truncate text-[11px] font-medium text-white/90">@{handle}</p> */}
              <p className="mt-1 pl-2 truncate text-[12px] text-white/65">{status}</p>
            </div>
            <button
              type="button"
              onClick={onContactClick}
              className="shrink-0 rounded-lg border border-white/25 px-2 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-white/15"
            >
              Contact
            </button>
          </div>
        )}
      </article>
    </ScrollAnimation>
  );
}