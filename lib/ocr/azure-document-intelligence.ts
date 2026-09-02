import { env } from '@/lib/env';

type AzureAnalysis = {
  status: string;
  analyzeResult?: { content?: string };
  error?: { message?: string };
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function analyzeWithAzureDocumentIntelligence(bytes: Uint8Array, mimeType: string): Promise<string> {
  if (!env.OCR_API_KEY || !env.OCR_ENDPOINT) throw new Error('OCR_NOT_CONFIGURED');
  const endpoint = env.OCR_ENDPOINT.replace(/\/$/, '');
  const model = env.OCR_MODEL_ID || 'prebuilt-layout';
  const response = await fetch(`${endpoint}/documentintelligence/documentModels/${model}:analyze?api-version=2024-11-30`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': env.OCR_API_KEY, 'Content-Type': mimeType },
    body: Buffer.from(bytes)
  });
  if (!response.ok) throw new Error(`OCR_REQUEST_FAILED_${response.status}`);
  const operation = response.headers.get('operation-location');
  if (!operation) throw new Error('OCR_OPERATION_MISSING');

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await wait(1000);
    const result = await fetch(operation, { headers: { 'Ocp-Apim-Subscription-Key': env.OCR_API_KEY } });
    if (!result.ok) throw new Error(`OCR_RESULT_FAILED_${result.status}`);
    const analysis = await result.json() as AzureAnalysis;
    if (analysis.status === 'succeeded') return analysis.analyzeResult?.content ?? '';
    if (analysis.status === 'failed') throw new Error(analysis.error?.message || 'OCR_ANALYSIS_FAILED');
  }
  throw new Error('OCR_TIMEOUT');
}
