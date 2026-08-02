import type { ExplainInput } from './types';

const blocked = /safe|no risk|looks fine|harmless/i;

export function filterSummary(summary: string, risks: ExplainInput['risks']): string {
  const clipped = summary.trim().slice(0, 240);
  const hasHigh = risks.some((risk) => risk.severity === 'high');
  if (hasHigh && blocked.test(clipped)) {
    return '';
  }
  return clipped;
}
