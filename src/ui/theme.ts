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
} as const;

export const type = {
  title: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 34,
    color: color.ink,
  },
  headline: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: color.ink,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: color.ink,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
    color: color.ink,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: color.inkMuted,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: color.inkMuted,
  },
};

export const radius = 10;
export const hit = 44;
