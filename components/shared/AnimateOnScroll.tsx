'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wraps children with a fade-up animation triggered when scrolled into view.
 * Respects prefers-reduced-motion automatically (motion library handles this).
 */
export function AnimateOnScroll({
  children,
  className,
  delay = 0,
}: AnimateOnScrollProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}
