"use client";

import React from 'react';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import ScrollText from '@/components/ui/ScrollText';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen flex flex-col justify-center items-center px-6 selection:bg-zinc-100 dark:selection:bg-zinc-900 font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Large 404 Text */}
        <ScrollAnimation direction="up" delay={0.1}>
          <span className="text-[120px] sm:text-[160px] font-normal leading-none tracking-tighter text-zinc-200 dark:text-zinc-900 font-sans select-none block">
            404
          </span>
        </ScrollAnimation>

        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-normal text-zinc-900 dark:text-zinc-100">
            <ScrollText
              as="span"
              text="Lost in the"
              className="font-sans uppercase tracking-[0.12em] block sm:inline mr-2"
              direction="up"
            />
            <ScrollText
              as="span"
              text="digital archive."
              className="font-serif italic lowercase tracking-normal font-light block sm:inline"
              direction="up"
            />
          </h1>
          <ScrollText
            as="p"
            text="The page you are looking for has either been moved, deleted, or never existed in this creative space."
            className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-sm mx-auto"
            direction="up"
          />
        </div>

        <ScrollAnimation direction="up" delay={0.3}>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:text-zinc-300 transition-colors duration-200 gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Portfolio
            </Link>
          </div>
        </ScrollAnimation>

      </div>
    </div>
  );
}
