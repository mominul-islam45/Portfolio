"use client";

import React, { useState } from 'react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import ScrollText from '@/components/ui/ScrollText';
import { Heart, Compass, User, RefreshCw, Mail, Globe, ArrowRight } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const pillars = [
  {
    icon: Compass,
    title: "Minimalism First",
    description: "I believe interfaces and assets should have air and light. Stripping away unnecessary clutter enables focus on what matters."
  },
  {
    icon: Heart,
    title: "Artistic Pacing",
    description: "Whether editing a 60-second commercial or compiling a design system, rhythm and timing dictate the overall user experience."
  },
  {
    icon: RefreshCw,
    title: "Modular Code",
    description: "Building clean systems. Designing custom templates that are reusable, fast-loading, and easily maintainable."
  }
];

export default function AboutMePage() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormState({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen selection:bg-zinc-100 dark:selection:bg-zinc-900 font-sans pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="space-y-4 mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-semibold block">
            <ScrollText as="span" text="My Background" direction="up" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal text-zinc-900 dark:text-zinc-100">
            <ScrollText
              as="span"
              text="About"
              className="font-mafinest uppercase tracking-[0.12em] mr-2"
              direction="up"
            />
            <ScrollText
              as="span"
              text="me"
              className="font-serif italic lowercase tracking-normal font-light block sm:inline"
              direction="up"
            />
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light leading-relaxed text-center">
            A creative developer and editor based at the intersection of design, cinematography, and web engineering.
          </p>
        </div>

        {/* Core Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-28">
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Who I Am
            </h2>
            <h3 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100 font-mafinest uppercase tracking-[0.05em] leading-snug">
              Creating digital spaces with weight and feel.
            </h3>
          </div>

          <div className="md:col-span-8 text-zinc-500 dark:text-zinc-400 space-y-6 font-light leading-relaxed text-sm">
            <ScrollText
              as="p"
              text="I am a multi-disciplinary visual artist. My work focuses on constructing digital artifacts that feel tangible. By mixing minimal layout systems with customized transitions, I build memories rather than just pixels."
              direction="left"
            />
            <ScrollText
              as="p"
              text="My editing background lets me look at layout layouts through a lens of cinematography, prioritizing pacing, contrast, and focus. Whether assembling a DaVinci Resolve grading board or structuring a Next.js directory, my goal remains the same: delivering exceptional fidelity."
              direction="left"
            />
          </div>
        </div>

        {/* Pillars / Values Section */}
        <div className="space-y-12 mb-32">
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            Core Creative Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollAnimation key={idx} direction="up" delay={idx * 0.1} className="w-full">
                  <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors duration-300 space-y-6">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>

        {/* Contact Section Integrated inside About page */}
        <div id="contact" className="space-y-12 border-t border-zinc-100 dark:border-zinc-900 pt-20">
          <div className="space-y-4 mb-12 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-semibold block">
              <ScrollText as="span" text="Get in touch" direction="up" />
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-zinc-900 dark:text-zinc-100">
              <ScrollText
                as="span"
                text="Let's construct"
                className="font-mafinest uppercase tracking-[0.12em] mr-2"
                direction="up"
              />
              <ScrollText
                as="span"
                text="something beautiful"
                className="font-serif italic lowercase tracking-normal font-light"
                direction="up"
              />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Form Side */}
            <div className="lg:col-span-7">
              <ScrollAnimation direction="up" delay={0.1}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 focus:border-zinc-800 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 outline-none text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="Enter email address"
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 focus:border-zinc-800 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 outline-none text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="How can I help you?"
                      className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 focus:border-zinc-800 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 outline-none text-sm transition-all duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitted}
                    className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submitted ? "Message Sent!" : "Send Message"} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </form>
              </ScrollAnimation>
            </div>

            {/* Details & Socials Side */}
            <div className="lg:col-span-5 space-y-12">
              
              {/* Contact details */}
              <ScrollAnimation direction="left" delay={0.2} className="space-y-6">
                <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                  Information
                </h3>
                
                <div className="space-y-4">
                  <a 
                    href="mailto:hello@firstproject.com" 
                    className="flex items-center gap-4 group text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-900 group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Direct Email</span>
                      <p className="text-sm font-medium">hello@firstproject.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-900">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Timezone</span>
                      <p className="text-sm font-medium">Dhaka, Bangladesh (GMT+6)</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Social channels */}
              <ScrollAnimation direction="left" delay={0.3} className="space-y-6">
                <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                  Social Channels
                </h3>

                <div className="flex gap-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub Profile"
                    className="w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:scale-110 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <GithubIcon className="w-4.5 h-4.5" />
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn Profile"
                    className="w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:scale-110 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <LinkedinIcon className="w-4.5 h-4.5" />
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram Profile"
                    className="w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:scale-110 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <InstagramIcon className="w-4.5 h-4.5" />
                  </a>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
