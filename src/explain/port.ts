import type { ExplainInput, ExplainOutput } from './types';

export type Explainer = (input: ExplainInput) => Promise<ExplainOutput>;
