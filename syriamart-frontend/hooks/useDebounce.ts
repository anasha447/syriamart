"use client";

import { useState, useEffect } from "react";

/**
 * Delays updating the returned value until `delay` ms have passed
 * without the input value changing. Used by the search bar to avoid
 * firing a query on every keystroke.
 *
 * @param value  The value to debounce (typically a search string)
 * @param delay  Wait time in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timer if value changes before delay has passed
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
