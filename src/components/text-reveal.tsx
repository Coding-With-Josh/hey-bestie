"use client";

import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { BirthdayCelebration } from "@/components/birthday-celebration";
import { ZoomParallax } from "@/components/zoom-parallax";

gsap.registerPlugin(ScrollTrigger);

const birthdayPhotos = [
  {
    src: "/image-1.jpeg",
    alt: "A photo of my best friend wearing a blue hoodie",
  },
  {
    src: "/image-2.jpeg",
    alt: "A photo of my best friend in a white birthday dress",
  },
  {
    src: "/image-3.jpeg",
    alt: "A photo of my best friend wearing a red dress",
  },
  {
    src: "/image-4.png",
    alt: "A close-up photo of my best friend smiling",
  },
  {
    src: "/image-5.png",
    alt: "A selfie of my best friend in a car",
  },
  {
    src: "/image-6.jpeg",
    alt: "A black-and-white photo of my best friend in a car",
  },
];

interface TextRevealProps {
  text: string;
}

export function TextReveal({ text }: TextRevealProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const noteStageRef = useRef<HTMLElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    const noteStage = noteStageRef.current;

    if (!container || !content || !noteStage) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lenis = reduceMotion
      ? null
      : new Lenis({
          wrapper: container,
          content,
          duration: 1.15,
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.1,
          lerp: 0.09,
        });

    const updateLenis = (time: number) => lenis?.raf(time * 1000);
    const updateScrollTriggers = () => {
      ScrollTrigger.update();
      container.dispatchEvent(new Event("lenis-scroll"));
    };
    if (lenis) {
      lenis.on("scroll", updateScrollTriggers);
      gsap.ticker.add(updateLenis);
    }

    const context = gsap.context(() => {
      const wordElements = gsap.utils.toArray<HTMLElement>(
        "[data-word]",
        noteStage,
      );

      gsap.set(wordElements, { opacity: reduceMotion ? 1 : 0.3 });

      if (!reduceMotion) {
        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: noteStage,
            scroller: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });

        wordElements.forEach((word, index) => {
          reveal.to(
            word,
            { opacity: 1, duration: 1, ease: "none" },
            index * 1.2,
          );
        });
      }
    }, container);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
      if (lenis) {
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
      }
    };
  }, [text]);

  return (
    <div className="relative h-[100dvh] w-full">
      <div
        ref={scrollContainerRef}
        aria-label="Scroll to read the birthday note"
        className="relative h-full w-full overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        tabIndex={0}
      >
        <div ref={contentRef}>
          <section
            ref={noteStageRef}
            aria-label="A birthday note"
            className="flex min-h-[200dvh] items-start justify-center px-5 pb-[38dvh] pt-[45dvh]"
          >
            <p
              aria-label={text}
              className="max-w-[14ch] text-[clamp(4rem,8vw,7.5rem)] leading-[1.08] tracking-[-0.045em] text-[#82006A]"
            >
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  aria-hidden="true"
                  data-word
                  className="mr-[0.42ch] inline-block whitespace-pre opacity-30"
                >
                  {word}
                </span>
              ))}
            </p>
          </section>

          <BirthdayCelebration scrollRootRef={scrollContainerRef} />
          <ZoomParallax
            images={birthdayPhotos}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </div>
    </div>
  );
}
