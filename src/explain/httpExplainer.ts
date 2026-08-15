import type { Explainer } from './port';
import type { ExplainOutput } from './types';

function summaryFromBody(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null || !('summary' in body)) {
    return undefined;
  }
  const { summary } = body as { summary: unknown };
  return typeof summary === 'string' ? summary : undefined;
}

export const httpExplainer: Explainer = async (input) => {
  const url = process.env.EXPLAIN_API_URL ?? '';
  const key = process.env.EXPLAIN_API_KEY ?? '';
  if (url === '' || key === '') {
    return { summary: '' };
  }

  const controller = new AbortController();
  // 2.5s then we give up. A hung explainer shouldn't block the review sheet.
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    const parsed: unknown = await response.json();
    const summary = summaryFromBody(parsed);
    if (summary === undefined) {
      return { summary: '' };
    }
    return { summary };
  } catch {
    return { summary: '' } satisfies ExplainOutput;
  } finally {
    clearTimeout(timer);
  }
};
