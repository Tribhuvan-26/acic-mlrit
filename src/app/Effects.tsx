"use client";

import { useEffect } from "react";

/* Menu toggle, scroll reveals, counters, active nav link, back-to-top, program rail arrows. */
export default function Effects() {
  useEffect(() => {
    const nav = document.getElementById("nav")!;
    const mt = document.getElementById("mt")!;
    const toggle = () => mt.setAttribute("aria-expanded", String(nav.classList.toggle("open")));
    mt.addEventListener("click", toggle);
    const links = [...nav.querySelectorAll<HTMLAnchorElement>(".l")];
    const close = () => { nav.classList.remove("open"); mt.setAttribute("aria-expanded", "false"); };
    links.forEach((a) => a.addEventListener("click", close));

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];

    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const n = e.target.querySelector<HTMLElement>("[data-n]");
      if (n) {
        const t = Number(n.dataset.n);
        const s = n.dataset.s ? `<span>${n.dataset.s}</span>` : "";
        if (still) n.innerHTML = t + s;
        else {
          let i = 0;
          const k = window.setInterval(() => { n.innerHTML = ++i + s; if (i >= t) clearInterval(k); }, 110);
          timers.push(k);
        }
      }
      io.unobserve(e.target);
    }), { threshold: 0.15 });
    // numbers are server-rendered final values; reset to 0 only once JS is running so they can count up
    if (!still) document.querySelectorAll<HTMLElement>("[data-n]").forEach((n) => { n.innerHTML = "0"; });
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));

    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id],#makerspace,footer#contact").forEach((s) => spy.observe(s));

    const toTop = document.getElementById("top")!;
    const topIo = new IntersectionObserver(([e]) => toTop.classList.toggle("show", !e.isIntersecting));
    topIo.observe(document.getElementById("home")!);

    const rail = document.getElementById("rail")!;
    const arrows = [...document.querySelectorAll<HTMLButtonElement>(".arrows button")];
    const onArrow = (ev: Event) => {
      const d = Number((ev.currentTarget as HTMLElement).dataset.d);
      rail.scrollBy({ left: d * 380, behavior: still ? "auto" : "smooth" });
    };
    arrows.forEach((b) => b.addEventListener("click", onArrow));

    return () => {
      mt.removeEventListener("click", toggle);
      links.forEach((a) => a.removeEventListener("click", close));
      arrows.forEach((b) => b.removeEventListener("click", onArrow));
      [io, spy, topIo].forEach((o) => o.disconnect());
      timers.forEach(clearInterval);
    };
  }, []);

  return null;
}
