"use client";

import React from 'react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import ScrollText from '@/components/ui/ScrollText';
import { Cpu } from 'lucide-react';
import VideoMasonry from '@/components/VideoMasonry';
import { videoCategories, videoProjects } from '@/data/videos';

const softwareStack = [
  { name: "Adobe Premiere Pro", role: "Primary cutting, timeline orchestration, sound mixing", level: "Expert" },
  { name: "Adobe After Effects", role: "Tracking, expression scripting, complex compositing", level: "Advanced" },
  { name: "DaVinci Resolve", role: "Color correction, HDR grading, Fairlight audio polish", level: "Expert" },
  { name: "Audition & Soundly", role: "Diegetic sound design, Foley effects, noise cleanup", level: "Intermediate" }
];

export default function VideoEditingPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen selection:bg-zinc-100 dark:selection:bg-zinc-900 font-sans pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="space-y-4 mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-semibold block">
            <ScrollText as="span" text="Cinematic Productions" direction="up" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal text-zinc-900 dark:text-zinc-100">
            <ScrollText
              as="span"
              text="Video"
              className="font-mafinest uppercase tracking-[0.12em] mr-2"
              direction="up"
            />
            <ScrollText
              as="span"
              text="editing"
              className="font-serif italic lowercase tracking-normal font-light block sm:inline"
              direction="up"
            />
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light leading-relaxed text-center">
            Pacing, color harmony, and sonic architecture. Crafting high-retention narratives and sleek commercial sequences.
          </p>
        </div>

        {/* Showcase Masonries */}
        <div className="mb-28 space-y-20">
          {videoCategories.map((category) => (
            <section key={category} className="space-y-8">
              <h2 className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
                {category}
              </h2>
              <VideoMasonry
                videos={videoProjects.filter((video) => video.category === category)}
                columnsClassName={category === 'SaaS explainer' ? 'columns-1 gap-5 lg:columns-2' : undefined}
              />
            </section>
          ))}
        </div>

        {/* Software Stack & Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Editing Pipeline
            </h2>
            <h3 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100 font-mafinest uppercase tracking-[0.05em]">
              The Software Stack
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-light text-sm leading-relaxed">
              Equipped with elite editors, plugins, and color boards to transform raw sequences into high-retention stories.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 gap-4">
            {softwareStack.map((stack, index) => (
              <ScrollAnimation key={index} direction="left" delay={index * 0.08} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {stack.name}
                  </h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-light">
                    {stack.role}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded-full mt-2 sm:mt-0 text-zinc-500">
                  {stack.level}
                </span>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
