"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageTrail from '@/components/ImageTrail';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import ScrollText from '@/components/ui/ScrollText';
import VideoMasonry from '@/components/VideoMasonry';
import Smooth3DSlideshow from '@/components/Smooth3DSlideshow';
import AccordionGallery from '@/components/AccordionGallery';
import AutoScrollSlider from '@/components/AutoScrollSlider';
import ProfileCard from '@/components/ProfileCard';
import LogoLoop from '@/components/LogoLoop';
import ReviewCarousel from '@/components/ReviewCarousel';
import VenomButton from '@/components/ui/VenomButton';
import { videoProjects } from '@/data/videos';

const trailImages = [
  '/Statics%20%28reduced%29/Asan%20%282%29.webp',
  '/Statics%20%28reduced%29/Hoodie.webp',
  '/Statics%20%28reduced%29/Pannas%20%283%29.webp',
  '/Statics%20%28reduced%29/tasin%20elegance%20%281%29.webp',
  '/Statics%20%28reduced%29/Uttara%20bank%20%281%29.webp',
  '/Statics%20%28reduced%29/Uttara%20bank%20%284%29%20%281%29.webp',
  '/Statics%20%28reduced%29/Uttara%20bank%20%288%29%20%281%29.webp'
];

const graphicSlides = [
  { image: '/Statics%20%28reduced%29/Asan%20%281%29.webp', title: 'Asan' },
  { image: '/Statics%20%28reduced%29/tenbyte%20%283%29.webp', title: 'tenbyte' },
  {
     image: '/Statics%20%28reduced%29/janata%20insurance%20%282%29%20%281%29.webp', title: 'Marine Insurance' },
  { image: '/Statics%20%28reduced%29/Uttara%20bank%20%281%29.webp', title: 'Uttara Bank Travel' },
  { image: '/Statics%20%28reduced%29/Uttara%20bank%20%288%29%20%281%29.webp', title: 'Butterfly EMI' },
  { image: '/Statics%20%28reduced%29/Pannas%20%283%29.webp', title: 'Pannas Irani Cape' },
  { image: '/Statics%20%28reduced%29/Uttara%20bank%20%289%29%20%281%29.webp', title: 'Uttara Bank Branches' },
];

const thumbnailImages = Array.from({ length: 8 }, (_, index) => `/Thumbnails/${index + 1}.webp`);

const clientLogos = [
  { src: '/Clients logos/Asan.png', alt: 'Asan', href: 'https://asan.com', title: 'Asan' },
  { src: '/Clients logos/Iqbal_Dates.png', alt: 'Iqbal Dates', href: 'https://iqbaldates.com', title: 'Iqbal Dates' },
  { src: '/Clients logos/Janata_insurance.png', alt: 'Janata Insurance', href: 'https://janatainsurance.com', title: 'Janata Insurance' },
  { src: '/Clients logos/Mancha.png', alt: 'Mancha', href: 'https://mancha.com', title: 'Mancha' },
  { src: '/Clients logos/Mobile_Bazar.png', alt: 'Mobile Bazar', href: 'https://mobilebazarbd.com', title: 'Mobile Bazar' },
  { src: '/Clients logos/Pannas.png', alt: 'Pannas', href: 'https://pannas.com', title: 'Pannas' },
  { src: '/Clients logos/tenbyte.png', alt: 'Tenbyte', href: 'https://tenbyte.com', title: 'Tenbyte' },
  { src: '/Clients logos/Thikana-Logo.png', alt: 'Thikana', href: 'https://thikana.com', title: 'Thikana' },
  { src: '/Clients logos/Uttara_bank.png', alt: 'Uttara Bank', href: 'https://uttarabank-bd.com', title: 'Uttara Bank' },
  { src: '/Clients logos/Zoyeq.png', alt: 'Zoyeq', href: 'https://zoyeq.com', title: 'Zoyeq' },
];

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 500);
      setIsMobile(width < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen selection:bg-zinc-100 dark:selection:bg-zinc-900 scroll-smooth">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen w-full flex flex-col justify-center items-center border-b border-zinc-100 dark:border-zinc-900 overflow-hidden bg-white dark:bg-zinc-950"
      >
        {isDesktop && <ImageTrail items={trailImages} variant={2} />}

        <div className="absolute bottom-8 left-6 z-20 hidden pointer-events-auto min-[900px]:block xl:bottom-12 xl:left-12">
          <ProfileCard
            name="Mominul I. Kawser"
            title="Video & Motion Designer"
            avatarUrl="/My_image.png"
            handle="mominul i. kawser"
            status="Online"
            behindGlowEnabled={false}
            onContactClick={() => router.push('/about-me')}
          />
        </div>

        <div className="max-w-5xl w-full px-6 md:px-12 pt-28 lg:pt-0 mx-auto flex flex-col justify-center items-center space-y-6 text-center relative z-10 pointer-events-none">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-semibold pointer-events-auto">
            <ScrollText
              as="span"
              text="PORTFOLIO // 2026"
              direction="up"
            />
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-7xl font-normal leading-[1.15] text-zinc-900 dark:text-zinc-100 pointer-events-auto">
            <ScrollText
              as="span"
              text="Creative direction"
              className="font-mono uppercase tracking-[0.12em] sm:tracking-[0.18em] block "
              direction="up"
            />
            <ScrollText
              as="span"
              text="meets clean aesthetic."
              className="font-serif italic lowercase tracking-normal font-light block sm:inline"
              direction="up"
            />
          </h1>
          <ScrollText
            as="p"
            text="Elevating brands through high-retention motion graphics, commercial video production, and conversion-focused visual design."
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-light leading-relaxed pointer-events-auto"
            direction="up"
          />
          <div className="pointer-events-auto flex justify-center pt-5 min-[900px]:hidden">
            <ProfileCard
              name="Mominul I. Kawser"
              title="Video & Motion Designer"
              avatarUrl="/My_image.png"
              handle="mominul i. kawser"
              status="Online"
              behindGlowEnabled={false}
              enableMobileTilt={false}
              onContactClick={() => router.push('/about-me')}
            />
          </div>
        </div>
      </section>

      {/* Video Preview */}
      <section className="border-b border-zinc-100 px-6 py-24 dark:border-zinc-900 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                <ScrollText as="span" text="MOTION & VIDEO" direction="up" />
              </span>
              <h2 className="text-3xl font-normal text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                <ScrollText as="span" text="FEATURED" className="font-sans uppercase tracking-[0.12em] " direction="up" />
                <ScrollText as="span" text="reels & ads" className="font-serif italic lowercase tracking-normal font-light" direction="up" />
              </h2>
            </div>
          </div>
          <VideoMasonry videos={videoProjects.slice(0, 8)} />
          <ScrollAnimation direction="up" delay={0.15} className="mt-8 flex justify-center">
            <VenomButton href="/video-editing" />
          </ScrollAnimation>
        </div>
      </section>

      <section className="border-b border-zinc-100 px-6 py-10 dark:border-zinc-900 dark:bg-zinc-900/40 md:px-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 text-center sm:text-left">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              <ScrollText as="span" text="Trusted by" direction="up" />
            </span>
            <h2 className="text-3xl font-normal text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              <ScrollText as="span" text="Brands" className="font-sans uppercase tracking-[0.12em] " direction="up" />
              <ScrollText as="span" text="I’ve worked with" className="font-serif italic lowercase tracking-normal font-light" direction="up" />
            </h2>
          </div>
          <div className="rounded-4xl bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
            <LogoLoop
              logos={clientLogos}
              speed={80}
              direction="left"
              logoHeight={isMobile ? 40 : 56}
              gap={isMobile ? 24 : 60}
              pauseOnHover
              fadeOut
              scaleOnHover
              ariaLabel="Client logos"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Graphic design showcase */}
      <section className="border-b border-zinc-100 px-6 py-10 dark:border-zinc-900 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 space-y-4 text-center">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              <ScrollText as="span" text="BRAND VISUALS" direction="up" />
            </span>
            <h2 className="text-3xl font-normal text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              <ScrollText as="span" text="FEATURED" className="font-sans uppercase " direction="up" />
              <ScrollText as="span" text="campaign work" className="font-serif italic lowercase tracking-normal font-light" direction="up" />
            </h2>
          </div>
          <ScrollAnimation direction="up" delay={0.15} className="mb-8 flex justify-center">
            <VenomButton href="/graphic-design" />
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.15}>
            <Smooth3DSlideshow slides={graphicSlides} />
          </ScrollAnimation>
        </div>
      </section>

      {/* Thumbnail design showcase */}
      <section className="border-b border-zinc-100 px-6 py-16 dark:border-zinc-900 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div className="space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                <ScrollText as="span" text="HIGH-CTR ARTWORK" direction="up" />
              </span>
              <h2 className="text-3xl font-normal text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                <ScrollText as="span" text="VIDEO" className=" font-sans uppercase tracking-[0.12em]" direction="up" />
                <ScrollText as="span" text="thumbnails" className="font-serif font-light italic lowercase tracking-normal" direction="up" />
              </h2>
            </div>
            <ScrollAnimation direction="up" delay={0.15}>
              <VenomButton href="/graphic-design#thumbnail-work" />
            </ScrollAnimation>
          </div>
          <ScrollAnimation direction="up" delay={0.15}>
            <div className="xl:hidden">
              <AutoScrollSlider images={thumbnailImages} />
            </div>
            <div className="hidden xl:block">
              <AccordionGallery items={thumbnailImages.map((image, index) => ({ image, alt: `Thumbnail ${index + 1}` }))} />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="border-b border-zinc-100 px-6 py-16 dark:border-zinc-900 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              <ScrollText as="span" text="CLIENT FEEDBACK" direction="up" />
            </span>
            <h2 className="mt-4 text-3xl font-normal text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              <ScrollText as="span" text="REVIEWS" className="font-sans uppercase tracking-[0.12em] " direction="up" />
              <ScrollText as="span" text="from clients" className="font-serif italic lowercase tracking-normal font-light" direction="up" />
            </h2>
          </div>

          <div className="flex justify-center">
            <ReviewCarousel baseWidth={400} autoplay pauseOnHover loop />
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-8">
        <ScrollText
          as="span"
          text="COLLABORATION"
          className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-semibold block"
          direction="up"
        />
        <h2 className="text-3xl sm:text-4xl font-normal text-zinc-900 dark:text-zinc-100">
          <ScrollText
            as="span"
            text="Have a vision to build?"
            className="font-serif italic font-light block"
            direction="up"
          />
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
          Available for full-time creative roles, agency partnerships, and high-impact commercial projects.
        </p>
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="pt-4">
            <Link
              href="/about-me#contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-sm font-medium transition-colors duration-200"
            >
              Contact Me
            </Link>
          </div>
        </ScrollAnimation>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-400 dark:text-zinc-600 font-light">
        <ScrollText
          as="p"
          text="© 2026 First Project. All rights creative."
          direction="none"
        />
      </footer>
    </div>
  );
}
