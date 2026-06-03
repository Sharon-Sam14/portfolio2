import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  delay?: number;
}

export default function WordsPullUp({
  text,
  className = "",
  showAsterisk = false,
  delay = 0,
}: WordsPullUpProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: [0.16, 1, 0.3, 1] as const,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.span
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, index) => {
        const isLastWord = index === words.length - 1;
        return (
          <span key={index} className="inline-block overflow-hidden mr-[0.22em] pb-[0.05em] relative">
            <motion.span
              variants={wordVariants}
              className="inline-block relative"
            >
              {word}
              {isLastWord && showAsterisk && (
                <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none">
                  *
                </span>
              )}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
