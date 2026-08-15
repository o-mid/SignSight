import { filterSummary } from './filterSummary';
import { httpExplainer } from './httpExplainer';
import { mockExplainer } from './mockExplainer';
import type { Explainer } from './port';
import type { ExplainInput, ExplainOutput } from './types';

function explainerFromEnv(): Explainer {
  const provider = process.env.EXPLAIN_PROVIDER ?? 'mock';
  return provider === 'http' ? httpExplainer : mockExplainer;
}

export async function explainRequest(
  input: ExplainInput,
  explainer: Explainer = explainerFromEnv(),
): Promise<ExplainOutput> {
  const raw = await explainer(input);
  const summary = filterSummary(raw.summary, input.risks);
  // Fail closed. Review buttons never read this string.
  if (summary === '') {
    return { summary: 'Could not explain' };
  }
  return { summary };
}
