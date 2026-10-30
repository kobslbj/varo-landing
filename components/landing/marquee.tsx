/**
 * A tilted brand ticker between sections: the name's four words and the
 * line, on a black band. Decorative, so it's hidden from assistive tech.
 */
const WORDS = [
  "Made to Overcome",
  "Venture",
  "Attempt",
  "Resilience",
  "Overcome",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {WORDS.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-6 font-display text-[34px] uppercase leading-none tracking-[-0.03em] sm:px-8 sm:text-[52px]">
            {word}
          </span>
          {/* A little hold as the separator */}
          <span className="block size-4 rotate-12 rounded-[40%_55%_45%_50%] bg-lime sm:size-5" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div aria-hidden className="relative py-10 sm:py-14">
      <div className="marquee -mx-[5vw] -rotate-2 overflow-hidden bg-night py-4 text-day sm:py-5">
        <div className="marquee__track">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
