"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
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
  "relative h-[25dvh] w-[55vw] sm:h-[25dvh] sm:w-[25vw]",
  "relative left-[3vw] top-[-25dvh] h-[30dvh] w-[55vw] sm:left-[5vw] sm:top-[-30dvh] sm:w-[35vw]",
  "relative left-[-20vw] top-[-10dvh] h-[40dvh] w-[38vw] sm:left-[-25vw] sm:h-[45dvh] sm:w-[20vw]",
  "relative left-[18vw] h-[25dvh] w-[40vw] sm:left-[27.5vw] sm:w-[25vw]",
  "relative left-[4vw] top-[24dvh] h-[25dvh] w-[34vw] sm:left-[5vw] sm:top-[27.5dvh] sm:w-[20vw]",
  "relative left-[-18vw] top-[23dvh] h-[25dvh] w-[48vw] sm:left-[-22.5vw] sm:top-[27.5dvh] sm:w-[30vw]",
];

export function ZoomParallax({
  images,
  scrollContainerRef,
}: ZoomParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useEffect(
    () =>
      scrollYProgress.on("change", (progress) => {
        sectionRef.current?.setAttribute("data-progress", progress.toFixed(3));
      }),
    [scrollYProgress],
  );

  const scale4 = useTransform(scrollYProgress, [0, 1], ["scale(1)", "scale(4)"]);
  const scale5 = useTransform(scrollYProgress, [0, 1], ["scale(1)", "scale(5)"]);
  const scale6 = useTransform(scrollYProgress, [0, 1], ["scale(1)", "scale(6)"]);
  const scale8 = useTransform(scrollYProgress, [0, 1], ["scale(1)", "scale(8)"]);
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
            }}
            className="absolute top-0 flex h-full w-full items-center justify-center"
          >
            <div
              className={`relative overflow-hidden rounded-xl border-4 border-white shadow-xl sm:rounded-2xl ${imagePositions[index % imagePositions.length]}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 55vw, 35vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
