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
        const lines = text.split("\n");
        let gKey = 0;
        let idx = 0;
        const renderTokens = (line: string) => {
          const tokens = line.split(/(\s+)/);
          return tokens.map((tok, tIndex) => {
            if (/^\s+$/.test(tok)) {
              idx += tok.length;
              return <span key={"sp-" + gKey + "-" + tIndex}>{tok}</span>;
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
              <span key={"w-" + gKey + "-" + tIndex} className="word">
                {wordSpans}
              </span>
            );
          });
        };
        const out: React.ReactNode[] = [];
        lines.forEach((line, li) => {
          out.push(<span key={"ln-" + li}>{renderTokens(line)}</span>);
          if (li < lines.length - 1) out.push(<br key={"br-" + li} />);
          gKey += 1;
        });
        return out;
      })()}
    </Tag>
  );
}

export default function ShopifyPage() {
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
      { text: "SHOPIFY", speed: 35 },
      { text: "Product Growth", speed: 20 },
      { text: "Implemented dynamic product listing for products", speed: 12 },
      { text: "Worked across services to ensure fast data fetch and smooth pagination", speed: 12 },
      { text: "Back", speed: 20 }
    ];
    const durations = parts.map(p => nonSpaceCount(p.text) * p.speed);
    const estimated = Math.max(...durations) + 60;
    router.prefetch("/?home");
    window.setTimeout(() => { router.push("/?home"); document.querySelector('.stack')?.classList.remove('animating'); }, estimated);
  }

  return (
    <main className="screen-center">
      <div className="brand-header" aria-hidden="true">
        <div className="brand-top-left"><span className="brand-b">B</span><span className="brand-en">EN</span></div>
        <div className="brand-vertical">AI</div>
      </div>
      <div className="stack" style={{ gap: 16 }}>
        <div className="intro" style={{ gap: 6 }}>
          <FlickerText text="SHOPIFY" triggerOut={out} outSpeedMs={35} />
          <FlickerText text="Product Growth" as="div" className="intro-subtitle" speedMs={80} triggerOut={out} outSpeedMs={20} />
        </div>
        <div className="container" style={{ maxWidth: 720, textAlign: "left", paddingTop: 8 }}>
          <FlickerText text={"Implemented dynamic product details page for sellers when first visiting the listing page"} as="div" className="subtitle" speedMs={10} triggerOut={out} outSpeedMs={12} />
          <FlickerText text={"Also improved AI generation across shopify, decreasing token usage and adding layers of content moderation"} as="div" className="subtitle" speedMs={10} triggerOut={out} outSpeedMs={12} />
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


