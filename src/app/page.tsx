"use client";

import { useState } from "react";
import { TextReveal } from "@/components/text-reveal";

const birthdayNote =
  "[coughs] hi. okay so, um... i ran out of ideas, and i realized i won’t be able to meet you in-person to wish you a happy birthday, so i decided to put my skills to good use. 😝";

export default function Home() {
  const [showNote, setShowNote] = useState(false);

  return (
    <main className="relative max-w-screen h-screen overflow-hidden bg-[#FFBCF3] text-[#82006A]">
      <section
        aria-label="Birthday greeting"
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          showNote ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-7 text-center">
          <h1 className="m-0 text-[clamp(4.25rem,9vw,8rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-[#400040]">
            hey, bestie!
          </h1>

          <button
            className="start-button tracking-[0.12em]"
            onClick={() => setShowNote(true)}
            type="button"
          >
            <span>start</span>
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 14 15">
              <path
                d="M3 2.5 11 7.5 3 12.5V2.5Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </section>

      {showNote && (
        <section aria-label="A birthday note" className="absolute inset-0 opacity-100">
          <TextReveal text={birthdayNote} />
        </section>
      )}
    </main>
  );
}
