'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealStaggerProps {
  children: ReactNode;
  className?: string;
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
}

// Container component that manages the reveal animation
export function RevealStagger({ children, className = '' }: RevealStaggerProps) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !inView) {
            setInView(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [inView]);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.14,
      },
    },
  };

  // If reduced motion is preferred, show everything immediately
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Item component for individual cards
export function RevealItem({ children, className = '' }: RevealItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: 'blur(6px)',
    },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1], // Apple-style cubic-bezier easing
      },
    },
  };

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
