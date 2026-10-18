"use client";

import confetti from "canvas-confetti";
import type { CreateTypes as ConfettiInstance } from "canvas-confetti";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";

interface BirthdayCelebrationProps {
  scrollRootRef: RefObject<HTMLDivElement | null>;
}

export function BirthdayCelebration({
  scrollRootRef,
}: BirthdayCelebrationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = scrollRootRef.current;
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!root || !section || !canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const confettiInstance: ConfettiInstance = confetti.create(canvas, {
      resize: true,
      useWorker: false,
    });
    let titleTimer: number | undefined;
    let fireworksTimer: number | undefined;
    let cannonFrame: number | undefined;
    let hasStarted = false;
    const colors = ["#FF1BD5", "#82006A", "#FFFFFF", "#FFBCF3"];

    const shoot = (options: Parameters<typeof confetti>[0]) => {
      try {
        const burst = confettiInstance({
          ...options,
          colors,
          zIndex: 9999,
        });

        if (burst) {
          void burst.catch((error: unknown) => {
            console.error("Could not launch birthday confetti:", error);
          });
        }
      } catch (error) {
        console.error("Could not launch birthday confetti:", error);
      }
    };

    const checkSectionVisibility = () => {
      if (hasStarted) return;

      const rootBounds = root.getBoundingClientRect();
      const sectionBounds = section.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(rootBounds.bottom, sectionBounds.bottom) -
          Math.max(rootBounds.top, sectionBounds.top),
      );

      if (visibleHeight / sectionBounds.height < 0.95) return;

      hasStarted = true;
      root.removeEventListener("scroll", checkSectionVisibility);
      root.removeEventListener("lenis-scroll", checkSectionVisibility);

      shoot({
        particleCount: reduceMotion ? 35 : 100,
        spread: reduceMotion ? 65 : 100,
        startVelocity: reduceMotion ? 30 : 45,
        origin: { x: 0.5, y: 0.62 },
        ticks: 240,
      });

      const sideCannonDuration = reduceMotion ? 1000 : 3000;
      const fireworksDuration = reduceMotion ? 1500 : 5000;
      const sideCannonEnd = Date.now() + sideCannonDuration;
      const fireworksEnd = Date.now() + fireworksDuration;

      const fireSideCannons = () => {
        if (Date.now() >= sideCannonEnd) return;

        shoot({
          particleCount: reduceMotion ? 1 : 2,
          angle: 60,
          spread: 55,
          startVelocity: reduceMotion ? 35 : 60,
          origin: { x: 0, y: 0.5 },
        });
        shoot({
          particleCount: reduceMotion ? 1 : 2,
          angle: 120,
          spread: 55,
          startVelocity: reduceMotion ? 35 : 60,
          origin: { x: 1, y: 0.5 },
        });
        cannonFrame = window.requestAnimationFrame(fireSideCannons);
      };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;
      fireworksTimer = window.setInterval(() => {
        const timeLeft = fireworksEnd - Date.now();
        if (timeLeft <= 0) {
          if (fireworksTimer !== undefined) {
            window.clearInterval(fireworksTimer);
          }
          return;
        }

        const particleCount =
          (reduceMotion ? 16 : 50) * (timeLeft / fireworksDuration);
        shoot({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
        });
        shoot({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
        });
      }, reduceMotion ? 500 : 250);

      fireSideCannons();
      titleTimer = window.setTimeout(
        () => setIsVisible(true),
        reduceMotion ? 0 : 320,
      );
    };

    root.addEventListener("scroll", checkSectionVisibility, { passive: true });
    root.addEventListener("lenis-scroll", checkSectionVisibility);
    window.addEventListener("resize", checkSectionVisibility);
    checkSectionVisibility();

    return () => {
      root.removeEventListener("scroll", checkSectionVisibility);
      root.removeEventListener("lenis-scroll", checkSectionVisibility);
      window.removeEventListener("resize", checkSectionVisibility);
      if (titleTimer !== undefined) window.clearTimeout(titleTimer);
      if (fireworksTimer !== undefined) window.clearInterval(fireworksTimer);
      if (cannonFrame !== undefined) {
        window.cancelAnimationFrame(cannonFrame);
      }
      confettiInstance.reset();
    };
  }, [scrollRootRef]);

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Birthday celebration"
        className="flex min-h-[100dvh] items-center justify-center px-5 text-center"
      >
        {isVisible && (
          <motion.h1
            aria-live="polite"
            className="m-0 text-[clamp(4rem,12vw,9rem)] leading-[0.98] tracking-[-0.04em] text-[#82006A]"
            initial={{
              opacity: 0,
              transform: prefersReducedMotion
                ? "none"
                : "translateY(1.25rem)",
            }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={
              prefersReducedMotion
                ? { opacity: { duration: 0.2 } }
                : { type: "spring", duration: 0.5, bounce: 0.2 }
            }
          >
            happy birthday
          </motion.h1>
        )}
      </section>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] h-[100dvh] w-screen"
      />
    </>
  );
}
