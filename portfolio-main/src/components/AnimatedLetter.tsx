import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedLetterProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function AnimatedLetter({ char, index, total, progress }: AnimatedLetterProps) {
  const charProgress = index / total;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);
  const safeEnd = end > start ? end : start + 0.001;

  const opacity = useTransform(progress, [start, safeEnd], [0.2, 1]);

  return <motion.span style={{ opacity }} className="relative">{char}</motion.span>;
}

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className = "" }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  const totalChars = text.length;

  let charIndexCounter = 0;

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split("");
        
        const renderedWord = (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const currentIndex = charIndexCounter;
              charIndexCounter++;
              return (
                <AnimatedLetter
                  key={charIdx}
                  char={char}
                  index={currentIndex}
                  total={totalChars}
                  progress={scrollYProgress}
                />
              );
            })}
          </span>
        );

        // Advance character counter for space
        charIndexCounter++;

        return (
          <React.Fragment key={wordIdx}>
            {renderedWord}
            {wordIdx < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </p>
  );
}
