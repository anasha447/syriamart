import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | SyrianMart",
    default:  "Sign in | SyrianMart",
  },
  robots: { index: false, follow: false },
};

/**
 * Minimal auth layout — no navbar or footer.
 * Pages: /login, /register/customer, /register/seller, /forgot-password
 * Background: the neutral-50 page bg from globals.css.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background">
      {children}
    </div>
  );
}
