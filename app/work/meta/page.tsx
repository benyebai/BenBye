"use client";

import Link from "next/link";
import { useMemo, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

function FlickerText({ text, as: Tag = "h1" as const, className, speedMs = 100, triggerOut = false, outSpeedMs = 35 }: { text: string; as?: any; className?: string; speedMs?: number; triggerOut?: boolean; outSpeedMs?: number }) {
  const letters = useMemo(() => text.split("").map((ch) => ch), [text]);
  const [revealed, setRevealed] = useState<boolean[]>(() => letters.map((ch) => ch === " "));
  useEffect(() => {
    const interval = setInterval(() => {
      setRevealed((prev) => {
        const candidates = prev.map((v, i) => (!v && letters[i] !== " " ? i : -1)).filter((i) => i !== -1);
        if (candidates.length === 0) { clearInterval(interval); return prev; }
        const idx = candidates[Math.floor(Math.random() * candidates.length)];
        const next = prev.slice(); next[idx] = true; return next;
      });
    }, speedMs);
    return () => clearInterval(interval);
  }, [letters, speedMs]);
  // optional flicker-out
  useEffect(() => {
    if (!triggerOut) return;
    const interval = setInterval(() => {
      setRevealed((prev) => {
        const candidates = prev.map((v, i) => (v && letters[i] !== " " ? i : -1)).filter((i) => i !== -1);
        if (candidates.length === 0) { clearInterval(interval); return prev; }
        const idx = candidates[Math.floor(Math.random() * candidates.length)];
        const next = prev.slice(); next[idx] = false; return next;
      });
    }, outSpeedMs);
    return () => clearInterval(interval);
  }, [triggerOut, outSpeedMs, letters]);

  return (
    <Tag className={className ?? "name"} aria-label={text}>
      {(() => {
        const tokens = text.split(/(\s+)/);
        let idx = 0;
        return tokens.map((tok, tIndex) => {
          if (/^\s+$/.test(tok)) {
            idx += tok.length;
            return <span key={"sp-" + tIndex}>{tok}</span>;
          }
          const wordSpans = tok.split("").map((ch) => {
            const i = idx;
            idx += 1;
            return (
              <span key={i} className={"letter" + (revealed[i] ? " on" : "")}>
                {ch}
              </span>
            );
          });
          return (
            <span key={"w-" + tIndex} className="word">
              {wordSpans}
            </span>
          );
        });
      })()}
    </Tag>
  );
}

export default function MetaPage() {
  const [out, setOut] = useState(false);
  const router = useRouter();
  const lockingRef = useRef(false);

  function nonSpaceCount(text: string): number { return text.replace(/\s+/g, "").length; }

  function handleBack(e: React.MouseEvent) {
    e.preventDefault();
    if (lockingRef.current) return;
    lockingRef.current = true;
    setOut(true);
    const root = document.querySelector('.stack');
    root?.classList.add('animating');
    const parts = [
      { text: "META", speed: 35 },
      { text: "Instagram Shop — Promotions", speed: 20 },
      { text: "Lead a team of 5 senior engineers to refine promo code engine powering Instagram Shop's Third Party Sellers.", speed: 12 },
      { text: "Designed a high-performance deduplication system with constant-time lookups, enabling real time detection for validation and bulk upload", speed: 12 },
      { text: "Revamped backend data model to scale unique code claiming, implementing seller-level isolation, async processing, and concurrency-safe logic to eliminate race conditions.", speed: 12 }
    ];
    const durations = parts.map(p => nonSpaceCount(p.text) * p.speed);
    const estimated = Math.max(...durations) + 60; // tighter buffer
    // prefetch destination for instant nav on click
    router.prefetch("/?home");
    window.setTimeout(() => {
      router.push("/?home");
      const root2 = document.querySelector('.stack');
      root2?.classList.remove('animating');
    }, estimated);
  }
  return (
    <main className="screen-center">
      <div className="brand-header" aria-hidden="true">
        <div className="brand-top-left"><span className="brand-b">B</span><span className="brand-en">EN</span></div>
        <div className="brand-vertical">AI</div>
      </div>
      <div className="stack" style={{ gap: 16 }}>
        <div className="intro" style={{ gap: 6 }}>
          <FlickerText text="META" triggerOut={out} />
          <FlickerText text="Instagram Shop — Promotions" as="div" className="intro-subtitle" speedMs={80} triggerOut={out} outSpeedMs={10} />
        </div>
        <div className="container" style={{ maxWidth: 720, textAlign: "left", paddingTop: 8 }}>
          <FlickerText text={"Lead a team of 5 senior engineers to refine promo code engine powering Instagram Shop's Third Party Sellers."} as="div" className="subtitle" speedMs={10} triggerOut={out} outSpeedMs={5} />
          <FlickerText text={"Designed a high-performance deduplication system with constant-time lookups, enabling real time detection for validation and bulk upload"} as="div" className="subtitle" speedMs={10} triggerOut={out} outSpeedMs={5} />
          <FlickerText text={"Revamped backend data model to scale unique code claiming, implementing seller-level isolation, async processing, and concurrency-safe logic to eliminate race conditions."} as="div" className="subtitle" speedMs={10} triggerOut={out} outSpeedMs={5} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", paddingTop: 12 }}>
          <Link href="/?home" style={{ textDecoration: "none" }} onClick={handleBack}>
            <FlickerText text="Back" as="span" className="subtitle back-underline" speedMs={60} triggerOut={out} outSpeedMs={20} />
          </Link>
        </div>
      </div>
      <nav className="footer-links" aria-label="Social links">
        <a href="https://x.com/benbye" target="_blank" rel="noopener noreferrer">X</a>
        <a href="https://www.linkedin.com/in/benjamin-bai-709090210/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:benjamin.bai@uwaterloo.ca">Email</a>
        <a href="https://github.com/benyebai" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
    </main>
  );
}


