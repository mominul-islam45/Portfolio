'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import VenomButton from '@/components/ui/VenomButton';

type GraphicMasonryProps = {
  images: string[];
  desktopColumnsClassName?: string;
};

export default function GraphicMasonry({ images, desktopColumnsClassName = 'md:columns-3 xl:columns-4' }: GraphicMasonryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  useEffect(() => {
    if (!activeImage) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeImage]);

  const renderGallery = (galleryImages: string[], className: string) => (
    <div className={className}>
      {galleryImages.map((image, index) => (
        <ScrollAnimation key={image} as="button" type="button" delay={index * 0.03} onClick={() => setActiveImage(image)} className="group relative mb-5 block w-full break-inside-avoid cursor-zoom-in overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 text-left shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <Image
            src={image}
            alt={`Graphic design work ${index + 1}`}
            width={768}
            height={1024}
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="block h-auto w-full transition-transform duration-700 group-hover:scale-110"
          />
          <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </ScrollAnimation>
      ))}
    </div>
  );

  return (
    <>
      {renderGallery(showAllMobile ? images : images.slice(0, 20), 'columns-2 gap-5 md:hidden')}
      {!showAllMobile && images.length > 20 && (
        <ScrollAnimation direction="up" delay={0.15} className="mt-8 flex justify-center md:hidden">
          <VenomButton label="View more" onClick={() => setShowAllMobile(true)} />
        </ScrollAnimation>
      )}
      {renderGallery(images, `hidden gap-5 ${desktopColumnsClassName} md:block`)}

      <AnimatePresence>
        {activeImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Graphic design preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-2000 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-md sm:p-8"
            onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) setActiveImage(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.88, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 18, scale: 0.92, rotateX: 6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative max-h-[92vh] max-w-5xl overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                aria-label="Close image"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/70 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
              <Image
                src={activeImage}
                alt="Selected graphic design work"
                width={1200}
                height={1600}
                sizes="90vw"
                className="max-h-[88vh] w-auto max-w-full rounded-xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
