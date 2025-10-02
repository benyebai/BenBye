"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function FlickerText({ text, as: Tag = "h1" as const, className, speedMs = 120, triggerOut = false, outSpeedMs = 110 }: { text: string; as?: any; className?: string; speedMs?: number; triggerOut?: boolean; outSpeedMs?: number }) {
  const letters = useMemo(() => text.split("").map((ch) => ch), [text]);
  const [revealed, setRevealed] = useState<boolean[]>(() => letters.map((ch) => ch === " "));
  const [outFx, setOutFx] = useState<boolean[]>(() => letters.map(() => false));

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealed((prev) => {
        const candidates = prev
          .map((v, i) => (!v && letters[i] !== " " ? i : -1))
          .filter((i) => i !== -1);
        if (candidates.length === 0) {
          clearInterval(interval);
          return prev;
        }
        const idx = candidates[Math.floor(Math.random() * candidates.length)];
        const next = prev.slice();
        next[idx] = true;
        if (candidates.length === 1) {
          clearInterval(interval);
        }
        return next;
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [letters, speedMs]);

  useEffect(() => {
    if (!triggerOut) return;
    const interval = setInterval(() => {
      setRevealed((prev) => {
        const candidates = prev
          .map((v, i) => (v && letters[i] !== " " ? i : -1))
          .filter((i) => i !== -1);
        if (candidates.length === 0) {
          clearInterval(interval);
          return prev;
        }
        const idx = candidates[Math.floor(Math.random() * candidates.length)];
        setOutFx((prevFx) => {
          const fx = prevFx.slice();
          fx[idx] = true;
          window.setTimeout(() => {
            setOutFx((p) => {
              const c = p.slice();
              c[idx] = false;
              return c;
            });
          }, 420);
          return fx;
        });
        const next = prev.slice();
        next[idx] = false;
        return next;
      });
    }, outSpeedMs);
    return () => clearInterval(interval);
  }, [triggerOut, letters, outSpeedMs]);

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
                <span key={i} className={"letter" + (revealed[i] ? " on" : "") + (outFx[i] ? " off" : "")}>
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

function NameIntro({ onDone }: { onDone: () => void }) {
  const NAME = "BENJAMIN BAI";
  const letters = useMemo(() => NAME.split("").map((ch) => ch), []);
  const [revealed, setRevealed] = useState<boolean[]>(() => letters.map((ch) => ch === " "));
  const [outFx, setOutFx] = useState<boolean[]>(() => letters.map(() => false));
  const stage = useRef<"in" | "pause" | "out">("in");
  const doneRef = useRef(false);
  const pauseTimer = useRef<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [subFade, setSubFade] = useState(false);

  useEffect(() => {
    const tickMs = 110;
    const interval = setInterval(() => {
      if (stage.current === "in") {
        setRevealed((prev) => {
          const candidates = prev
            .map((v, i) => (!v && letters[i] !== " " ? i : -1))
            .filter((i) => i !== -1);
          if (candidates.length === 0) {
            stage.current = "pause";
            if (pauseTimer.current) {
              clearTimeout(pauseTimer.current);
            }
            pauseTimer.current = window.setTimeout(() => {
              setSubFade(true);
              stage.current = "out";
            }, 1000);
            return prev;
          }
          const idx = candidates[Math.floor(Math.random() * candidates.length)];
          const next = prev.slice();
          next[idx] = true;
          return next;
        });
      } else if (stage.current === "pause") {
        return;
      } else if (stage.current === "out") {
        setRevealed((prev) => {
          const candidates = prev
            .map((v, i) => (v && letters[i] !== " " ? i : -1))
            .filter((i) => i !== -1);
          if (candidates.length === 0) {
            if (!doneRef.current) {
              setCompleted(true);
            }
            return prev;
          }
          const idx = candidates[Math.floor(Math.random() * candidates.length)];
          setOutFx((prevFx) => {
            const fx = prevFx.slice();
            fx[idx] = true;
            window.setTimeout(() => {
              setOutFx((p) => {
                const c = p.slice();
                c[idx] = false;
                return c;
              });
            }, 420);
            return fx;
          });
          const next = prev.slice();
          next[idx] = false;
          return next;
        });
      }
    }, tickMs);

    return () => {
      clearInterval(interval);
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, [letters, onDone]);

  useEffect(() => {
    if (completed && !doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  }, [completed, onDone]);

  return (
    <div className="intro">
      <FlickerText text="Software engineer" as="div" className={"intro-subtitle"} speedMs={90} triggerOut={subFade} outSpeedMs={110} />
      <h1 className="name" aria-label={NAME}>
        {letters.map((ch, i) => (
          <span key={i} className={"letter" + (revealed[i] ? " on" : "") + (outFx[i] ? " off" : "")}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </h1>
      <FlickerText text="cs [at] uwaterloo" as="div" className={"intro-subtitle"} speedMs={90} triggerOut={subFade} outSpeedMs={110} />
    </div>
  );
}

type PageItem = { title: string; subtitle: string; inSpeedTitle?: number; inSpeedSubtitle?: number; href?: string; flickerNav?: boolean };

function PagedList({ fromBack = false }: { fromBack?: boolean }) {
  const router = useRouter();
  const pages: PageItem[][] = [
    [
      { title: "META", subtitle: "Built Promo code engine for Instagram Shop", inSpeedTitle: 100, inSpeedSubtitle: 30, href: "/work/meta" },
      { title: "SHOPIFY", subtitle: "Implemented dynamic product listing for products", inSpeedTitle: 100, inSpeedSubtitle: 35, href: "/work/shopify" },
      { title: "COVALENT AI", subtitle: "Fine-tuned an NLP pipeline for semantic email classification [Acquired for 20m]", inSpeedTitle: 100, inSpeedSubtitle: 25, href: "https://www.covalentmarket.com/", flickerNav: false }
    ],
    [
      { title: "IGNITE", subtitle: "Convert your codebases into hyper-specific onboarding modules via RAG and semantic similarity scoring", inSpeedTitle: 90, inSpeedSubtitle: 15, href: "https://tryignite.dev", flickerNav: false },
      { title: "CHESS", subtitle: "Pre AI era - Realtime multiplayer chess game with AI", inSpeedTitle: 90, inSpeedSubtitle: 30, href: "https://github.com/benyebai/ChessGame-Webapp", flickerNav: false },
      { title: "QUINIWINE", subtitle: "Built the main app for wine recommendation and analystics system (50k MMR)", inSpeedTitle: 90, inSpeedSubtitle: 30, href: "https://quiniwine.com/#/", flickerNav: false }
    ]
  ];

  const [pageIndex, setPageIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [triggerOut, setTriggerOut] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [inView, setInView] = useState(true);

  function nonSpaceCount(text: string): number {
    return text.replace(/\s+/g, "").length;
  }

  function subtitleOutSpeedFor(text: string): number {
    const len = nonSpaceCount(text) || 1;
    const ms = Math.round(800 / len);
    return Math.min(35, Math.max(10, ms));
  }

  function goTo(next: number) {
    if (transitioning || next === pageIndex || next < 0 || next >= pages.length) return;
    setTransitioning(true);
    setTriggerOut(true);
    const root = containerRef.current;
    if (root) root.classList.add("animating");
    const currentItems = pages[pageIndex];
    const titleOutSpeed = 35;
    const perItemDur = currentItems.map((it) => {
      const titleDur = nonSpaceCount(it.title) * titleOutSpeed;
      const subSpeed = subtitleOutSpeedFor(it.subtitle);
      const subDur = nonSpaceCount(it.subtitle) * subSpeed;
      return Math.max(titleDur, subDur);
    });
    const estimated = Math.max(...perItemDur) + 140;
    window.setTimeout(() => {
      setPageIndex(next);
      setPageKey((k) => k + 1);
      setTriggerOut(false);
      setTransitioning(false);
      const root2 = containerRef.current;
      if (root2) root2.classList.remove("animating");
    }, estimated);
  }

  function goNext() { goTo(pageIndex + 1); }
  function goPrev() { goTo(pageIndex - 1); }

  function navigateWithFlicker(href: string) {
    if (transitioning) return;
    setTransitioning(true);
    setTriggerOut(true);
    const root = containerRef.current;
    if (root) root.classList.add("animating");
    const currentItems = pages[pageIndex];
    const titleOutSpeed = 35;
    const perItemDur = currentItems.map((it) => {
      const titleDur = nonSpaceCount(it.title) * titleOutSpeed;
      const subSpeed = subtitleOutSpeedFor(it.subtitle);
      const subDur = nonSpaceCount(it.subtitle) * subSpeed;
      return Math.max(titleDur, subDur);
    });
    const estimated = Math.max(...perItemDur) + 140;
    window.setTimeout(() => {
      router.push(href);
      const root2 = containerRef.current;
      if (root2) root2.classList.remove("animating");
    }, estimated);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (transitioning) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [transitioning, pageIndex]);

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (transitioning) return;
      const now = Date.now();
      if (now - wheelLockRef.current < 200) return;
      const mag = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (mag > 20) { wheelLockRef.current = now; goNext(); }
      else if (mag < -20) { wheelLockRef.current = now; goPrev(); }
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel as any);
  }, [transitioning, pageIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      touchStartX.current = t.clientX;
      touchStartY.current = t.clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      if (transitioning) return;
      const sx = touchStartX.current, sy = touchStartY.current;
      touchStartX.current = null; touchStartY.current = null;
      if (sx == null || sy == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) goNext(); else goPrev();
      }
    }
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd as any);
    return () => {
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [transitioning, pageIndex]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.99);
      },
      { threshold: [0, 0.5, 0.99, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = pages[pageIndex];

  return (
    <div ref={containerRef} className={"stack" + (inView ? " inview" : "") }>
      <div className="list" ref={listRef}>
        {items.map((it, i) => (
          <div className="item" key={pageKey + "-item-" + i}>
            {it.href ? (
              it.href.startsWith('http') ? (
                <a href={it.href} style={{ textDecoration: "none" }} onClick={(e) => { if (it.flickerNav === false) return; e.preventDefault(); navigateWithFlicker(it.href!); }} target="_blank" rel="noopener noreferrer">
                  <FlickerText text={it.title} speedMs={it.inSpeedTitle ?? 100} triggerOut={triggerOut} outSpeedMs={35} />
                </a>
              ) : (
                <Link href={it.href} style={{ textDecoration: "none" }} onClick={(e) => { e.preventDefault(); navigateWithFlicker(it.href!); }}>
                  <FlickerText text={it.title} speedMs={it.inSpeedTitle ?? 100} triggerOut={triggerOut} outSpeedMs={35} />
                </Link>
              )
            ) : (
              <FlickerText text={it.title} speedMs={it.inSpeedTitle ?? 100} triggerOut={triggerOut} outSpeedMs={35} />
            )}
            <FlickerText text={it.subtitle} as="div" className="subtitle" speedMs={it.inSpeedSubtitle ?? 60} triggerOut={triggerOut} outSpeedMs={subtitleOutSpeedFor(it.subtitle)} />
          </div>
        ))}
      </div>
      <nav className="dots" aria-label="Pagination">
        {pages.map((_, i) => (
          <button
            key={"dot-" + i}
            className={"dot" + (i === pageIndex ? " active" : "")}
            aria-current={i === pageIndex ? "page" : undefined}
            onClick={() => goTo(i)}
            disabled={transitioning}
          />
        ))}
      </nav>
    </div>
  );
}

export default function HomePageClient() {
  const searchParams = useSearchParams();
  const [showList, setShowList] = useState<boolean>(!!searchParams?.has("home"));
  const delayRef = useRef<number | null>(null);

  useEffect(() => {
    return () => { if (delayRef.current) clearTimeout(delayRef.current); };
  }, []);

  useEffect(() => {
    if (searchParams?.has("home")) setShowList(true);
  }, [searchParams]);

  return (
    <main className="screen-center">
      {!showList ? (
        <NameIntro onDone={() => {
          if (delayRef.current) clearTimeout(delayRef.current);
          delayRef.current = window.setTimeout(() => setShowList(true), 600);
        }} />
      ) : (
        <PagedList />
      )}
    </main>
  );
}


