"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const activeTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(activeTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-8 right-24 md:right-[104px] min-[900px]:top-6 min-[900px]:right-6 z-[1005] flex items-center justify-center w-12 h-12 md:w-12 md:h-12 min-[900px]:w-11 min-[900px]:h-11 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-800 dark:text-zinc-200 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer pointer-events-auto"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-300 scale-100" />
      )}
    </button>
  );
}
