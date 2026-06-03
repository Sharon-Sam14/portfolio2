import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface CharacterRevealProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function CharacterReveal({ char, index, total, progress }: CharacterRevealProps) {
  const start = index / total;
  const end = Math.min(1, start + 0.1);

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{char === " " ? "\u00A0" : char}</span>
      <motion.span style={{ opacity }} className="absolute inset-0 select-none">
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedText({ text, className = "", style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  const totalChars = text.length;
  let charIndexCounter = 0;

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split("");
        
        const renderedWord = (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const currentIndex = charIndexCounter;
              charIndexCounter++;
              return (
                <CharacterReveal
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

        // Account for space
        charIndexCounter++;

        return (
          <React.Fragment key={wordIdx}>
            {renderedWord}
            {wordIdx < words.length - 1 && (
              <CharacterReveal
                char=" "
                index={charIndexCounter - 1}
                total={totalChars}
                progress={scrollYProgress}
              />
            )}
          </React.Fragment>
        );
      })}
    </p>
  );
}
