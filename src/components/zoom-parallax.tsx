"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type RefObject } from "react";

interface ParallaxImage {
  src: string;
  alt: string;
}

interface ZoomParallaxProps {
  images: ParallaxImage[];
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

const imagePositions = [
  "relative h-[25dvh] w-[25vw]",
  "relative left-[27vw] top-[-28dvh] h-[24dvh] w-[33vw] sm:left-[5vw] sm:top-[-30dvh] sm:h-[30dvh] sm:w-[35vw]",
  "relative left-[-25vw] top-[-23dvh] h-[31dvh] w-[28vw] sm:left-[-25vw] sm:top-[-10vh] sm:h-[45dvh] sm:w-[20vw]",
  "relative left-[22vw] top-[5dvh] h-[23dvh] w-[28vw] sm:left-[27.5vw] sm:top-0 sm:h-[25dvh] sm:w-[25vw]",
  "relative left-[-27vw] top-[25dvh] h-[24dvh] w-[30vw] sm:left-[5vw] sm:top-[27.5dvh] sm:h-[25dvh] sm:w-[20vw]",
  "relative left-[25vw] top-[26dvh] h-[24dvh] w-[28vw] sm:left-[-22.5vw] sm:top-[27.5dvh] sm:h-[25dvh] sm:w-[30vw]",
];

export function ZoomParallax({
  images,
  scrollContainerRef,
}: ZoomParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const section = sectionRef.current;
    if (!root || !section) return;

    const updateProgress = () => {
      const rootBounds = root.getBoundingClientRect();
      const sectionBounds = section.getBoundingClientRect();
      const travel = sectionBounds.height - root.clientHeight;
      const distance = rootBounds.top - sectionBounds.top;
      scrollProgress.set(
        travel > 0 ? Math.max(0, Math.min(1, distance / travel)) : 0,
      );
    };

    updateProgress();
    root.addEventListener("scroll", updateProgress, { passive: true });
    root.addEventListener("lenis-scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    return () => {
      root.removeEventListener("scroll", updateProgress);
      root.removeEventListener("lenis-scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [scrollContainerRef, scrollProgress]);

  const scale4 = useTransform(scrollProgress, [0, 1], ["scale(1)", "scale(4)"]);
  const scale5 = useTransform(scrollProgress, [0, 1], ["scale(1)", "scale(5)"]);
  const scale6 = useTransform(scrollProgress, [0, 1], ["scale(1)", "scale(6)"]);
  const scale8 = useTransform(scrollProgress, [0, 1], ["scale(1)", "scale(8)"]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8];

  return (
    <section
      ref={sectionRef}
      aria-label="Photo memories"
      className={
        prefersReducedMotion
          ? "relative min-h-[100dvh]"
          : "relative h-[300dvh]"
      }
    >
      <div
        className={
          prefersReducedMotion
            ? "relative h-[100dvh] overflow-hidden bg-[#FFBCF3]"
            : "sticky top-0 h-[100dvh] overflow-hidden bg-[#FFBCF3]"
        }
      >
        {images.slice(0, 7).map(({ src, alt }, index) => (
          <motion.div
            key={src}
            style={{
              transform: prefersReducedMotion
                ? "none"
                : scales[index % scales.length],
              zIndex: index === 0 ? images.length : index,
            }}
            className="absolute top-0 flex h-full w-full items-center justify-center"
          >
            <div
              className={`relative overflow-hidden rounded-xl border-4 border-pink-50 shadow-xl sm:rounded-2xl ${imagePositions[index % imagePositions.length]}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 40vw, 35vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
