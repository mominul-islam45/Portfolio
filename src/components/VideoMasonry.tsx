'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import type { VideoProject } from '@/data/videos';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';

type VideoMasonryProps = {
  videos: VideoProject[];
  columnsClassName?: string;
};

const aspectClasses = {
  video: 'aspect-video',
  portrait: 'aspect-[4/5]',
  wide: 'aspect-[16/8]',
};

function embedUrl(video: VideoProject, preview = false) {
  const params = new URLSearchParams({
    autoplay: '1',
    controls: preview ? '0' : '1',
    loop: '1',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    mute: preview ? '1' : '0',
    iv_load_policy: '3',
    fs: preview ? '0' : '1',
    disablekb: preview ? '1' : '0',
    cc_load_policy: '0',
    showinfo: '0',
    playlist: video.id,
  });

  return `https://www.youtube-nocookie.com/embed/${video.id}?${params.toString()}`;
}

function thumbnailUrl(video: VideoProject) {
  return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
}

function AutoplayPreview({ video, active }: { video: VideoProject; active: boolean }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '100px', threshold: 0.1 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={previewRef} className={`relative ${aspectClasses[video.aspectRatio]} overflow-hidden bg-zinc-900`}>
      <Image
        src={thumbnailUrl(video)}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {isInView && !active && (
        <iframe
          src={embedUrl(video, true)}
          title={`${video.title} autoplay preview`}
          allow="autoplay; encrypted-media; picture-in-picture"
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.01] object-cover"
        />
      )}
      {!isInView && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
          </span>
        </span>
      )}
    </div>
  );
}

export default function VideoMasonry({ videos, columnsClassName = 'columns-1 gap-5 sm:columns-2 xl:columns-3' }: VideoMasonryProps) {
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  useEffect(() => {
    if (!activeVideo) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveVideo(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeVideo]);

  return (
    <>
      <div className={columnsClassName}>
        {videos.map((video, index) => (
          <ScrollAnimation
            as="button"
            type="button"
            key={video.id}
            aria-label={`Play ${video.title}`}
            delay={index * 0.06}
            onClick={() => setActiveVideo(video)}
            onMouseMove={(event: MouseEvent<HTMLButtonElement>) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty('--spotlight-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
              event.currentTarget.style.setProperty('--spotlight-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
            }}
            className="group relative mb-5 block w-full break-inside-avoid cursor-pointer overflow-hidden rounded-[1.25rem] border border-zinc-200 bg-zinc-950 text-left shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:cursor-zoom-in hover:shadow-2xl active:cursor-grabbing dark:border-zinc-800"
            style={{
              backgroundImage: 'radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(255,255,255,.24), transparent 34%)',
            }}
          >
            <AutoplayPreview video={video} active={activeVideo?.id === video.id} />
          </ScrollAnimation>
        ))}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-2000 flex items-center justify-center bg-zinc-950/65 p-4 backdrop-blur-md sm:p-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveVideo(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.88, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 18, scale: 0.92, rotateX: 6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative w-full max-w-5xl transform-3d overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl dark:bg-zinc-900/45"
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/60 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
              <div className={`relative ${aspectClasses[activeVideo.aspectRatio]} max-h-[85vh] overflow-hidden rounded-[1.1rem] bg-black`}>
                <iframe
                  key={activeVideo.id}
                  src={embedUrl(activeVideo)}
                  title={activeVideo.title}
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
