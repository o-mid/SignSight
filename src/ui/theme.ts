export const color = {
  bg: '#F3F3F0',
  surface: '#FFFFFF',
  ink: '#141414',
  inkMuted: '#5C5C5C',
  inkFaint: '#6B6B6B',
  line: '#E2E2DC',
  danger: '#8B1E2D',
  dangerBg: '#F7E6E8',
  warning: '#8A4B08',
  warningBg: '#F6EEDC',
  onPrimary: '#FFFFFF',
} as const;

export const space = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 40,
} as const;

export const type = {
  display: {
    fontSize: 34,
    fontWeight: '600' as const,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: color.ink,
  },
  title: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: color.ink,
  },
  headline: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: color.ink,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: color.ink,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: color.ink,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 21,
    color: color.inkMuted,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: color.inkMuted,
  },
};

export const radius = 16;
export const radiusSm = 12;
export const radiusLg = 24;
export const hit = 44;

export const motion = {
  fast: 160,
  base: 260,
  slow: 400,
} as const;

export const lift = {
  shadowColor: color.ink,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.07,
  shadowRadius: 20,
  elevation: 4,
} as const;
