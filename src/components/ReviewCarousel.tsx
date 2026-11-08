import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, type PanInfo, useMotionValue, useTransform } from 'motion/react';

export interface ReviewItem {
  id: number;
  name: string;
  location: string;
  flag: string;
  quote: string;
  image?: string;
}

export interface ReviewCarouselProps {
  items?: ReviewItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 18;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 260, damping: 28 };

const FiveStarRating = () => (
  <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        viewBox="0 0 24 24"
        className="h-4 w-4 text-amber-400"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

function ReviewSlide({
  item,
  index,
  itemWidth,
  trackItemOffset,
  x,
  transition
}: {
  item: ReviewItem;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: any;
  transition: any;
}) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  const initials = item.name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.article
      key={`${item.id}-${index}`}
      className="relative flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-full border-0 bg-zinc-100 px-9 py-6 pb-12 text-center shadow-[0_18px_48px_-28px_rgba(0,0,0,0.7)] dark:bg-[#120F17] sm:px-10 sm:py-7 sm:pb-14"
      style={{
        width: itemWidth,
        height: itemWidth,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      transition={transition}
    >
      <div className="mb-3 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-16 w-16 rounded-full border border-white/20 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-500 text-sm font-semibold text-white">
            {initials}
          </div>
        )}
      </div>

      <div className="mb-3 flex items-center justify-center gap-2 text-zinc-900 dark:text-white">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <span className="text-base leading-none" aria-label={`${item.location} flag`}>
          {item.flag}
        </span>
      </div>

      <div className="mb-3 flex items-center justify-center gap-1">
        <FiveStarRating />
      </div>

      <p className="w-full max-w-[16rem] text-sm leading-6 text-zinc-700 dark:text-zinc-200">“{item.quote}”</p>
    </motion.article>
  );
}

const DEFAULT_ITEMS: ReviewItem[] = [
  {
    id: 1,
    name: 'Joshua T.',
    location: 'USA',
    flag: '🇺🇸',
    quote: 'Great work!',
    image: '/Clients%20Headshot/Joshua%20T..webp'
  },
  {
    id: 2,
    name: 'Brittany S.',
    location: 'USA',
    flag: '🇺🇸',
    quote:
      'Excellent communicator and eager to please. He executed my requests and was willing to do as many rounds of revisions as I needed. I would hire again.',
    image: '/Clients%20Headshot/Brittany%20S..webp'
  },
  {
    id: 3,
    name: 'James N.',
    location: 'USA',
    flag: '🇺🇸',
    quote: 'Created exactly what I wanted. Easy to work with, thanks!'
  },
  {
    id: 4,
    name: 'Bernard P.',
    location: 'Australia',
    flag: '🇦🇺',
    quote:
      'Mominul consistently delivers studio-grade motion graphics and social media visuals right on deadline. His sense of pacing and brand aesthetics directly boosted our campaign engagement.',
    image: '/Clients%20Headshot/Bernard%20P..webp'
  }
];

export default function ReviewCarousel({
  items = DEFAULT_ITEMS,
  baseWidth = 360,
  autoplay = true,
  autoplayDelay = 3500,
  pauseOnHover = true,
  loop = true
}: ReviewCarouselProps) {
  const containerPadding = 16;
  const mobileWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, baseWidth) : baseWidth;
  const effectiveWidth = Math.min(baseWidth, Math.max(260, mobileWidth));
  const itemWidth = effectiveWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, itemsForRender.length, pauseOnHover]);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    return undefined;
  }, [pauseOnHover]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => setIsAnimating(true);

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-full border border-zinc-200 bg-zinc-100/80 p-4 dark:border-white/10 dark:bg-zinc-900/60"
      style={{ width: `${effectiveWidth}px`, height: `${effectiveWidth}px`, maxWidth: '100%' }}
    >
      <motion.div
        className="flex"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <ReviewSlide
            key={`${item.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2">
        {items.map((_, index) => (
          <motion.button
            type="button"
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index}
            className={`h-2.5 w-2.5 rounded-full border-0 p-0 transition-all duration-200 ${
              activeIndex === index ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-400/70 dark:bg-white/40'
            }`}
            animate={{ scale: activeIndex === index ? 1.3 : 1 }}
            onClick={() => setPosition(loop ? index + 1 : index)}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
