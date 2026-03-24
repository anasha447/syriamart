import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely — resolves conflicts via tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Syrian Pound currency. */
export function formatCurrency(
  amount: number,
  locale = "ar-SY",
  currency = "SYP"
): string {
  return new Intl.NumberFormat(locale, {
    style:    "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a number as USD for fallback. */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style:    "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format a date for display. Support shorthands for common styles. */
export function formatDate(
  date: string | Date | number,
  options?: "short" | "long" | "relative" | Intl.DateTimeFormatOptions
): string {
  if (options === "relative") {
    return formatRelativeTime(date instanceof Date ? date : new Date(date));
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let finalOptions: Intl.DateTimeFormatOptions;

  if (typeof options === "string") {
    if (options === "short") {
      finalOptions = { month: "short", day: "numeric" };
    } else if (options === "long") {
      finalOptions = {
        year:    "numeric",
        month:   "long",
        day:     "numeric",
        weekday: "long",
      };
    } else {
      finalOptions = defaultOptions;
    }
  } else {
    finalOptions = { ...defaultOptions, ...options };
  }

  try {
    return new Intl.DateTimeFormat("en-US", finalOptions).format(new Date(date));
  } catch (err) {
    console.error("formatDate error:", err);
    return String(date);
  }
}

/** Format a date as relative time (e.g. "2 hours ago"). */
export function formatRelativeTime(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (seconds < 60)    return rtf.format(-seconds, "second");
  if (seconds < 3600)  return rtf.format(-Math.floor(seconds / 60), "minute");
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), "hour");
  return rtf.format(-Math.floor(seconds / 86400), "day");
}

/** Truncate a string with ellipsis. */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 1)}…`;
}

/** Generate initials from a full name. */
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
