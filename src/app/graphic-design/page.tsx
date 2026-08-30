"use client";

import React from 'react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import ScrollText from '@/components/ui/ScrollText';
import GraphicMasonry from '@/components/GraphicMasonry';
import { Palette } from 'lucide-react';

const graphicImages = [
  'Asan (1).webp', 'Asan (2).webp', 'Asan (4).webp', 'Cat house.webp', 'Hoodie.webp',
  'iqbal dates (1).webp', 'iqbal dates (2).webp', 'iqbal dates (3).webp',
  'janata insurance (1) (1).webp', 'janata insurance (1).webp', 'janata insurance (2) (1).webp', 'janata insurance (4).webp',
  'lucky shop (1).webp', 'lucky shop (4).webp', 'lucky shop (5).webp', 'Mancha.webp',
  'nazifa mart (1).webp', 'Pannas (3).webp', 'Pannas (4).webp', 'Pannas (5).webp', 'Pannas (7).webp',
  'Physiotherapy.webp', 'qzent (1).webp', 'samoz.webp', 'super food house.webp',
  'tasin elegance (1).webp', 'tasin elegance (2).webp', 'tenbyte (2).webp', 'thikana valley.webp',
  'Uttara bank (1) (1).webp', 'Uttara bank (1).webp', 'Uttara bank (10).webp', 'Uttara bank (12).webp',
  'Uttara bank (13).webp', 'Uttara bank (14).webp', 'Uttara bank (2) (1).webp', 'Uttara bank (2).webp',
  'Uttara bank (3).webp', 'Uttara bank (4) (1).webp', 'Uttara bank (5) (1).webp', 'Uttara bank (5).webp',
  'Uttara bank (8) (1).webp', 'Uttara bank (8).webp', 'Uttara bank (9) (1).webp', 'Uttara bank (9).webp',
].map((filename) => `/Statics%20%28reduced%29/${filename.replaceAll(' ', '%20').replaceAll('(', '%28').replaceAll(')', '%29')}`);

const thumbnailImages = Array.from({ length: 8 }, (_, index) => `/Thumbnails/${index + 1}.webp`);

export default function GraphicDesignPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen selection:bg-zinc-100 dark:selection:bg-zinc-900 font-sans pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="space-y-4 mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-semibold block">
            <ScrollText as="span" text="Visual Artworks" direction="up" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal text-zinc-900 dark:text-zinc-100">
            <ScrollText
              as="span"
              text="Graphic"
              className="font-mafinest uppercase tracking-[0.12em] mr-2"
              direction="up"
            />
            <ScrollText
              as="span"
              text="design"
              className="font-serif italic lowercase tracking-normal font-light block sm:inline"
              direction="up"
            />
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light leading-relaxed text-center">
            Branding architectures, editorial grids, print layouts, and bespoke vector art. Harmonizing layout grids and typography systems.
          </p>
        </div>

        {/* Gallery Masonry */}
        <div className="mb-24 space-y-8">
          <h2 className="border-b border-zinc-100 pb-3 text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
            Selected graphic work
          </h2>
          <GraphicMasonry images={graphicImages} />
        </div>

        <div id="thumbnail-work" className="mb-24 scroll-mt-28 space-y-8">
          <h2 className="border-b border-zinc-100 pb-3 text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
            Thumbnail work
          </h2>
          <GraphicMasonry images={thumbnailImages} desktopColumnsClassName="md:columns-2 xl:columns-3" />
        </div>

        {/* Studio Philosophy or CTA */}
        <ScrollAnimation direction="up" delay={0.3} className="mt-20">
          <div className="rounded-3xl border border-zinc-100 dark:border-zinc-900 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between bg-zinc-50/20">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                <Palette className="w-4 h-4" /> Editorial & Brand Philosophies
              </span>
              <h3 className="text-xl font-mafinest uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Visual space, weights, and high-fidelity output.
              </h3>
              <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                I believe layouts should breathe. Every element needs weight, direction, and a clear relationship to surrounding typography.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-colors shrink-0"
            >
              Start designing
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
