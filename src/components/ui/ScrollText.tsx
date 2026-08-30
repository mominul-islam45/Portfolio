// @ts-nocheck

'use client';

import { cn } from '@/lib/utils';
import { type HTMLMotionProps, motion } from 'framer-motion';
import type React from 'react';
import type { JSX } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const generateVariants = (direction: Direction): { hidden: any; visible: any } => {
  if (direction === 'none') {
    return {
      hidden: {
        filter: 'blur(8px)',
        opacity: 0,
      },
      visible: {
        filter: 'blur(0px)',
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        },
      },
    };
  }

  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const value = direction === 'right' || direction === 'down' ? 40 : -40;

  return {
    hidden: {
      filter: 'blur(8px)',
      opacity: 0,
      [`translate${axis}`]: value,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      [`translate${axis}`]: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };
};

const defaultViewport = { once: true, amount: 0.2, margin: '0px 0px -100px 0px' };

export default function ScrollText({
  as = 'p',
  text,
  className = '',
  viewport = defaultViewport,
  variants,
  direction = 'down',
  letterAnime = false,
  lineAnime = false,
}: {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  viewport?: {
    amount?: number;
    margin?: string;
    once?: boolean;
  };
  variants?: {
    hidden?: any;
    visible?: any;
  };
  direction?: Direction;
  letterAnime?: boolean;
  lineAnime?: boolean;
}) {
  const baseVariants = variants || generateVariants(direction);
  const modifiedVariants = {
    hidden: baseVariants.hidden,
    visible: {
      ...baseVariants.visible,
    },
  };

  const MotionComponent = motion[as as keyof typeof motion] as React.ComponentType<
    HTMLMotionProps<any>
  >;

  return (
    <MotionComponent
      whileInView='visible'
      initial='hidden'
      variants={containerVariants}
      viewport={viewport}
      className={cn(className)}
    >
      {lineAnime ? (
        <motion.span className="inline-block" variants={modifiedVariants}>
          {text}
        </motion.span>
      ) : (
        <>
          {text.split(' ').map((word: string, index: number) => (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block"
              variants={letterAnime === false ? modifiedVariants : {}}
            >
              {letterAnime ? (
                <>
                  {word.split('').map((letter: string, letterIndex: number) => (
                    <motion.span
                      key={letterIndex}
                      className="inline-block"
                      variants={modifiedVariants}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  &nbsp;
                </>
              ) : (
                <>{word}&nbsp;</>
              )}
            </motion.span>
          ))}
        </>
      )}
    </MotionComponent>
  );
}
