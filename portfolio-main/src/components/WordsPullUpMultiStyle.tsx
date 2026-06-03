import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  delay?: number;
}

export default function WordsPullUpMultiStyle({
  segments,
  className = "",
  delay = 0,
}: WordsPullUpMultiStyleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true });

  // Flatten segments into individual words with their respective styles
  const allWords: { word: string; styleClass: string }[] = [];
  segments.forEach((seg) => {
    // Preserve spaces between words but split them up
    const words = seg.text.split(" ");
    words.forEach((w) => {
      allWords.push({
        word: w,
        styleClass: seg.className || "",
      });
    });
  });

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
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {allWords.map((item, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.22em] pb-[0.05em]">
          <motion.span
            variants={wordVariants}
            className={`inline-block ${item.styleClass}`}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
