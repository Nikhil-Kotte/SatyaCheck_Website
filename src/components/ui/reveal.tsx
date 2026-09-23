import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px the element rises from. */
  y?: number;
  as?: "div" | "li" | "section" | "p";
};

/** Fades, un-blurs and lifts its content the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

type WordRevealProps = {
  /** Text to reveal. Wrap words in *asterisks* to set them in the serif accent. */
  text: string;
  className?: string;
  accentClassName?: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  delay?: number;
};

/**
 * Headline that rises in word by word, each word sliding up out of its own
 * mask. Screen readers get the plain sentence.
 */
export function WordReveal({ text, className, accentClassName, as = "h2", id, delay = 0 }: WordRevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const plain = text.replace(/\*/g, "");

  // Split into [word, isAccent] pairs, keeping *accent runs* together.
  const words: { w: string; accent: boolean }[] = [];
  text.split(/(\*[^*]+\*)/g).forEach((chunk) => {
    if (!chunk) return;
    const accent = chunk.startsWith("*") && chunk.endsWith("*");
    chunk
      .replace(/\*/g, "")
      .split(" ")
      .filter(Boolean)
      .forEach((w) => words.push({ w, accent }));
  });

  // The heading itself is observed: the words start outside their masks,
  // so they could never report being in view on their own.
  const word = {
    hidden: { y: "105%", rotate: 4 },
    show: (i: number) => ({ y: "0%", rotate: 0, transition: { duration: 0.85, delay: delay + i * 0.045, ease: EASE } }),
  };

  return (
    <Tag
      id={id}
      className={className}
      aria-label={plain}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {words.map(({ w, accent }, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              custom={i}
              variants={word}
              className={cn(
                "inline-block",
                accent && cn("font-serif font-normal italic tracking-[-0.02em] text-brand", accentClassName)
              )}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
