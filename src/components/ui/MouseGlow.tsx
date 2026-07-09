import React, { useEffect, useState } from "react";

export const MouseGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 overflow-hidden"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.08), rgba(59, 130, 246, 0.04) 40%, transparent 80%)`,
      }}
    />
  );
};
