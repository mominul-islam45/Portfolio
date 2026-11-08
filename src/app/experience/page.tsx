"use client";

import React from 'react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import ScrollText from '@/components/ui/ScrollText';
import { Briefcase, Calendar, MapPin, Award } from 'lucide-react';

const workExperiences = [
  {
    role: "VIDEO & MOTION DESIGNER",
    company: "Qzent",
    period: "Feb 2026 - Present",
    location: "Dhaka, Bangladesh",
    description: "Leading the creative team and overseeing digital campaign productions from initial concept to final execution. Directing high-retention promotional videos, SaaS explainers, and motion graphics using fast-turnaround AI and Vibe Editing workflows.",
    skills: ["Creative Direction", "Framer Motion", "After Effects", "Brand Architecture"]
  },
  {
    role: "VIDEO EDITOR & GRAPHIC DESIGNER",
    company: "Qzent",
    period: "Jun 2025 - Jan 2026",
    location: "Dhaka, Bangladesh",
    description: "Produced engaging commercial videos, motion graphics, and social media marketing creatives for leading local and international brands—including Uttara Bank PLC, Janata Insurance PLC, and Tenbyte.",
    skills: ["DaVinci Resolve", "Premiere Pro", "Sound Engineering", "Color Grading"]
  },
  {
    role: "FREELANCE GRAPHIC DESIGNER",
    company: "Global Marketplaces",
    period: "2023 - 2025",
    location: "Global",
    description: "Delivered high-converting marketing visuals, typographic posters, and brand identity assets across global freelance platforms for over 2 years—maintaining a 95% client satisfaction rate and consistent 5-star reviews.",
    skills: ["Figma", "Next.js", "Illustrator", "Tailwind CSS", "GSAP"]
  }
];

export default function ExperiencePage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen selection:bg-zinc-100 dark:selection:bg-zinc-900 font-sans pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="space-y-4 mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-semibold block">
            <ScrollText as="span" text="Professional Journey" direction="up" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal text-zinc-900 dark:text-zinc-100">
            <ScrollText
              as="span"
              text="My career"
              className="font-sans uppercase  "
              direction="up"
            />
            <ScrollText
              as="span"
              text="timeline"
              className="font-serif italic lowercase tracking-normal font-light block sm:inline"
              direction="up"
            />
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light leading-relaxed text-center">
            A chronological summary of my career—blending commercial video production, team leadership, and AI-accelerated creative workflows.
          </p>
        </div>

        {/* Timeline Content */}
        <div className="relative border-l border-zinc-100 dark:border-zinc-900 ml-4 md:ml-8 pl-8 md:pl-12 space-y-16">
          {workExperiences.map((exp, i) => (
            <ScrollAnimation key={i} direction="left" delay={i * 0.1} className="relative">
              {/* Timeline Marker Icon */}
              <span className="absolute -left-[45px] md:-left-[61px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 z-10">
                <Briefcase className="w-3.5 h-3.5" />
              </span>

              {/* Card Container */}
              <div className="group rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20 p-8 transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text font-normal text-zinc-900 dark:text-zinc-100 font-sans uppercase ">
                      {exp.role}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 font-sans italic text-sm font-light mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-1 md:mt-0">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 font-light text-sm leading-relaxed mb-6">
                  {exp.description}
                </p>

                
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Footnote or Skills Overview */}
        <ScrollAnimation direction="up" delay={0.4} className="mt-24">
          <div className="rounded-3xl border border-zinc-100 dark:border-zinc-900 p-8 flex flex-col md:flex-row items-center gap-8 justify-between bg-zinc-50/20">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                <Award className="w-4 h-4" /> IMPACT & STANDARDS
              </span>
              <p className="text-sm font-light text-zinc-500 dark:text-zinc-400 max-w-md">
                Proven track record of converting passive viewers into active followers with a 95% client satisfaction rate across commercial campaigns.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center w-52 h-11 px-6 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-colors"
            >
              Start a project
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
