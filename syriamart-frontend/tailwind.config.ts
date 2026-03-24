import type { Config } from 'tailwindcss';

/**
 * SyrianMart Design System — Tailwind Configuration
 *
 * Grid philosophy: 4pt base (1 Tailwind unit = 4px). Use even multiples
 * of 2 (8px steps) for all major layout spacing to enforce the 8pt grid.
 * Odd spacings (p-1, p-3) are reserved for micro-gaps and icon padding only.
 *
 * All brand colors are CSS variable references so globals.css is the single
 * source of truth. Changing a color only requires touching globals.css.
 */
const config: Config = {
  darkMode: ['class'],

  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',   // 16px
        sm:      '1.5rem', // 24px
        lg:      '2rem',   // 32px
        xl:      '2.5rem', // 40px
        '2xl':   '3rem',   // 48px
      },
      screens: { '2xl': '1400px' },
    },

    extend: {
      colors: {
        // ── Shadcn/ui semantic slots ──────────────────────────────────────
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',

        // ── SyrianMart brand palette ──────────────────────────────────────
        brand: {
          midnight: 'hsl(var(--brand-midnight))', // #1A365D — The Anchor of Trust
          navy:     'hsl(var(--brand-navy))',     // #0F172A — Slate Navy
          sapphire: 'hsl(var(--brand-sapphire))', // #1E3A5F — Deep Sapphire
          blue: {
            700: 'hsl(var(--brand-blue-700))', // #1D4ED8
            500: 'hsl(var(--brand-blue-500))', // #3B82F6 — Sky Trust
            100: 'hsl(var(--brand-blue-100))', // #DBEAFE — Mist Blue
            50:  'hsl(var(--brand-blue-50))',  // #EFF6FF — Ghost Blue
          },
          amber: {
            DEFAULT: 'hsl(var(--brand-amber))',      // #FF9900 — Conversion Engine
            hover:   'hsl(var(--brand-amber-hover))', // #E68A00
            50:      'hsl(var(--brand-amber-50))',    // #FFF7E6
          },
          green: {
            DEFAULT: 'hsl(var(--brand-green))',  // #16A34A — Growth Green
            50:      'hsl(var(--brand-green-50))', // #F0FDF4
          },
        },

        // ── Neutral scale ──────────────────────────────────────────────────
        neutral: {
          900: 'hsl(var(--neutral-900))', // #111827 Rich Carbon
          700: 'hsl(var(--neutral-700))', // #374151 Graphite
          500: 'hsl(var(--neutral-500))', // #6B7280 Mid Gray
          300: 'hsl(var(--neutral-300))', // #D1D5DB Border Gray
          100: 'hsl(var(--neutral-100))', // #F3F4F6 Light Surface
          50:  'hsl(var(--neutral-50))',  // #F9FAFB White Smoke
        },

        // ── Semantic colors ────────────────────────────────────────────────
        error:   { DEFAULT: 'hsl(var(--error))',   bg: 'hsl(var(--error-bg))' },
        warning: { DEFAULT: 'hsl(var(--warning))', bg: 'hsl(var(--warning-bg))' },
        info:    { DEFAULT: 'hsl(var(--info))' },
        success: { DEFAULT: 'hsl(var(--success))', bg: 'hsl(var(--success-bg))' },

        // ── Shadcn sidebar tokens ─────────────────────────────────────────
        sidebar: {
          DEFAULT:              'hsl(var(--sidebar-background))',
          foreground:           'hsl(var(--sidebar-foreground))',
          primary:              'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent:               'hsl(var(--sidebar-accent))',
          'accent-foreground':  'hsl(var(--sidebar-accent-foreground))',
          border:               'hsl(var(--sidebar-border))',
          ring:                 'hsl(var(--sidebar-ring))',
        },

        // ── Recharts chart tokens ─────────────────────────────────────────
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },

      // ── Semantic spacing aliases ────────────────────────────────────────
      spacing: {
        'header':      '4rem',    // 64px  — customer navbar height
        'header-sm':   '3.5rem',  // 56px  — seller / driver top bar
        'sidebar':     '16rem',   // 256px — seller sidebar expanded
        'sidebar-sm':  '3.5rem',  // 56px  — seller sidebar collapsed
        'bottom-nav':  '4.5rem',  // 72px  — driver bottom navigation
        'touch':       '2.75rem', // 44px  — iOS minimum touch target
        'touch-lg':    '3rem',    // 48px  — comfortable touch target
        'qr-min':      '16rem',   // 256px — minimum QR code display size
        'qr-display':  '20rem',   // 320px — full QR display (seller pack screen)
      },

      // ── Typography ─────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-geist)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      // Line-heights are all grid-aligned (multiples of 4px)
      fontSize: {
        xs:    ['0.75rem',  { lineHeight: '1rem' }],      // 12/16
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],   // 14/20
        base:  ['1rem',     { lineHeight: '1.5rem' }],    // 16/24
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],   // 18/28
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],   // 20/28
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],      // 24/32
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30/36
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],    // 36/40
        '5xl': ['3rem',     { lineHeight: '3.5rem' }],    // 48/56
        '6xl': ['3.75rem',  { lineHeight: '4rem' }],      // 60/64
      },

      // ── Border Radius ──────────────────────────────────────────────────
      borderRadius: {
        none:    '0',
        sm:      'calc(var(--radius) - 4px)', // 4px
        md:      'calc(var(--radius) - 2px)', // 6px
        DEFAULT: 'var(--radius)',              // 8px (configured in CSS)
        lg:      'var(--radius)',              // 8px
        xl:      'calc(var(--radius) + 4px)', // 12px
        '2xl':   'calc(var(--radius) + 8px)', // 16px
        '3xl':   'calc(var(--radius) + 16px)',// 24px
        full:    '9999px',
      },

      // ── Box Shadows ────────────────────────────────────────────────────
      boxShadow: {
        'sm':         '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-md':    '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        'card-lg':    '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'navbar':     '0 1px 0 0 hsl(var(--border))',
        'bottom-nav': '0 -1px 0 0 hsl(var(--border))',
        // QR code needs a clean white border regardless of theme
        'qr':         '0 0 0 12px #ffffff',
      },

      // ── Keyframes ──────────────────────────────────────────────────────
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'slide-out-to-right': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(100%)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        // QR scanner corner brackets pulse
        'scan-pulse': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.03)' },
        },
        // Success animation after successful scan
        'scan-success': {
          '0%':   { transform: 'scale(0.7)', opacity: '0' },
          '60%':  { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        // Loading skeleton shimmer
        'shimmer': {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        // Earnings counter reveal
        'count-reveal': {
          from: { opacity: '0', transform: 'translateY(6px) scale(0.95)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // Cart item add bounce
        'cart-bounce': {
          '0%':   { transform: 'scale(1)' },
          '30%':  { transform: 'scale(1.25)' },
          '50%':  { transform: 'scale(0.95)' },
          '70%':  { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      animation: {
        'accordion-down':    'accordion-down 0.2s ease-out',
        'accordion-up':      'accordion-up 0.2s ease-out',
        'fade-in':           'fade-in 0.15s ease-out',
        'fade-up':           'fade-up 0.2s ease-out',
        'fade-down':         'fade-down 0.2s ease-out',
        'slide-in-right':    'slide-in-from-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-right':   'slide-out-to-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-bottom':   'slide-in-from-bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scan-pulse':        'scan-pulse 2s ease-in-out infinite',
        'scan-success':      'scan-success 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer':           'shimmer 1.8s linear infinite',
        'count-reveal':      'count-reveal 0.3s ease-out',
        'cart-bounce':       'cart-bounce 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },

      // ── Breakpoints ────────────────────────────────────────────────────
      screens: {
        xs:    '475px',
        sm:    '640px',
        md:    '768px',
        lg:    '1024px',
        xl:    '1280px',
        '2xl': '1536px',
      },

      // ── Z-index Scale ──────────────────────────────────────────────────
      zIndex: {
        behind:   '-1',
        base:     '0',
        raised:   '10',
        dropdown: '30',
        sidebar:  '40',
        navbar:   '50',
        modal:    '60',
        toast:    '70',
        scanner:  '80', // QR scanner view sits above everything
        max:      '9999',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;
