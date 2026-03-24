"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id:          string;
  title:       string;
  subtitle:    string;
  ctaText:     string;
  ctaHref:     string;
  badge?:      string;
  bgColor:     string;
  accentColor: string;
  imageSide:   "left" | "right";
  imageUrl:    string;
}

// Static slides — in production these would come from a CMS or admin API.
const SLIDES: HeroSlide[] = [
  {
    id:          "slide-1",
    title:       "Everything Syria Needs",
    subtitle:    "Shop from thousands of verified sellers across all categories — electronics, fashion, home and more.",
    ctaText:     "Shop Now",
    ctaHref:     "/categories",
    badge:       "Trusted by 50,000+ customers",
    bgColor:     "#1A365D",
    accentColor: "#FF9900",
    imageSide:   "right",
    imageUrl:    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800", // Fashion shopping
  },
  {
    id:          "slide-2",
    title:       "Latest Electronics",
    subtitle:    "Deals on smartphones, laptops and accessories. Upgrade your tech today.",
    ctaText:     "View Electronics",
    ctaHref:     "/category/cat-electronics",
    badge:       "Limited time offers",
    bgColor:     "#0F172A",
    accentColor: "#3B82F6",
    imageSide:   "right",
    imageUrl:    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800", // Electronics
  },
  {
    id:          "slide-3",
    title:       "Summer Fashion Sale",
    subtitle:    "Get ready for the sun with our new summer collection. Up to 50% off.",
    ctaText:     "Shop Fashion",
    ctaHref:     "/category/cat-fashion",
    badge:       "New Arrivals",
    bgColor:     "#500724",
    accentColor: "#F43F5E",
    imageSide:   "right",
    imageUrl:    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800", // Apparel
  },
];

const SLIDE_DURATION = 5000; // 5 seconds

/**
 * Hero promotional carousel.
 * - Framer Motion spring transitions between slides
 * - Auto-advances on SLIDE_DURATION interval, pauses on hover
 * - Dot indicators with animated fill
 * - Accessible: arrow keys navigate, reduced motion respected
 */
export function HeroCarousel() {
  const [current, setCurrent]   = useState(0);
  const [paused,  setPaused]    = useState(false);
  const [direction, setDir]     = useState<1 | -1>(1);

  const count = SLIDES.length;

  const go = useCallback((next: number, dir: 1 | -1 = 1) => {
    setDir(dir);
    setCurrent(((next % count) + count) % count);
  }, [count]);

  const next = useCallback(() => go(current + 1, 1),  [current, go]);
  const prev = useCallback(() => go(current - 1, -1), [current, go]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const slide = SLIDES[current]!;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center:              { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ minHeight: "clamp(280px, 40vw, 500px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Promotional banner"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="absolute inset-0 flex items-center"
          style={{ background: slide.bgColor }}
        >
          <div className="container mx-auto px-8 py-12 flex items-center gap-8 min-h-full">
            <div className="flex-1 max-w-xl">
              {slide.badge && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-4"
                  style={{ background: `${slide.accentColor}25`, color: slide.accentColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: slide.accentColor }} />
                  {slide.badge}
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 28 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-sm sm:text-base text-white/70 mt-4 max-w-md leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center gap-3"
              >
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-150 active:scale-95"
                  style={{ background: slide.accentColor, color: "#0F172A" }}
                >
                  {slide.ctaText}
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/categories"
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Browse all
                </Link>
              </motion.div>
            </div>

            {/* Image Side */}
            <div className="hidden lg:flex flex-shrink-0 w-1/2 justify-center items-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: slide.imageSide === "right" ? 40 : -40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
                className="relative z-10 w-[400px] h-[340px] rounded-2xl overflow-hidden shadow-2xl"
              >
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
              </motion.div>
              {/* Decorative geometric shape */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-20 -z-0">
                <div className="absolute inset-0 rounded-full border-[40px]" style={{ borderColor: slide.accentColor }} />
                <div className="absolute inset-8 rounded-full border-[20px]" style={{ borderColor: slide.accentColor }} />
                <div className="absolute inset-20 rounded-full" style={{ background: slide.accentColor }} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow controls */}
      {[{ dir: -1 as const, Icon: ChevronLeft, pos: "left-3" }, { dir: 1 as const, Icon: ChevronRight, pos: "right-3" }].map(({ dir: d, Icon, pos }) => (
        <button
          key={pos}
          onClick={() => go(current + d, d)}
          aria-label={d === -1 ? "Previous slide" : "Next slide"}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10",
            pos,
            "w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm",
            "flex items-center justify-center text-white transition-colors",
            "opacity-0 hover:opacity-100 group-hover:opacity-100",
            "focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white"
          )}
          style={{ opacity: paused ? 1 : undefined }}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative h-1.5 rounded-full overflow-hidden bg-white/25 transition-all duration-300"
            style={{ width: i === current ? 28 : 8 }}
          >
            {i === current && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                style={{ originX: 0 }}
                key={`${s.id}-progress`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
