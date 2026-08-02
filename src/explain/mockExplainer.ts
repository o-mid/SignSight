import type { Explainer } from './port';

export const mockExplainer: Explainer = async (input) => {
  const labels = input.risks.map((risk) => risk.label);
  const parts: string[] = [`${input.decode.kind} ${input.method}`.trim()];
  if (input.risks.some((risk) => risk.code === 'infinite_approve')) {
    parts.push('Unlimited approval');
  }
  if (labels.length > 0) {
    parts.push(labels.join(', '));
  }
  return { summary: parts.join('. ') };
};
