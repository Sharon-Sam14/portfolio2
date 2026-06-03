import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      // Distance from mouse to element center
      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;

      // Check if mouse is within padding of the element boundary
      const distance = Math.hypot(distanceX, distanceY);
      const isNear = distance < (Math.max(rect.width, rect.height) / 2 + padding);

      if (isNear) {
        setTransition(activeTransition);
        setPosition({
          x: distanceX / strength,
          y: distanceY / strength,
        });
      } else {
        setTransition(inactiveTransition);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: transition,
        willChange: 'transform',
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}
