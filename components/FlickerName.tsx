"use client";

import { useEffect, useMemo, useState } from "react";

export default function FlickerName() {
  const NAME = "BENJAMIN BAI";
  const letters = useMemo(() => NAME.split("").map((ch) => ch), []);
  const [revealed, setRevealed] = useState<boolean[]>(() => letters.map((ch) => ch === " "));

  useEffect(() => {
    const indices = letters
      .map((ch, i) => ({ ch, i }))
      .filter((x) => x.ch !== " ")
      .map((x) => x.i);

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let ptr = 0;
    const interval = setInterval(() => {
      setRevealed((prev) => {
        if (ptr >= indices.length) return prev;
        const clone = prev.slice();
        clone[indices[ptr]] = true;
        ptr += 1;
        return clone;
      });
      if (ptr >= indices.length) {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [letters]);

  return (
    <h1 className="name" aria-label={NAME}>
      {letters.map((ch, i) => (
        <span key={i} className={"letter" + (revealed[i] ? " on" : "")}>{ch === " " ? "\u00A0" : ch}</span>
      ))}
    </h1>
  );
}


