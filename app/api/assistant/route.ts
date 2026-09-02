import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

const requestSchema = z.object({ question: z.string().trim().min(1).max(1000) });

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'Enter a valid question.' }, { status: 400 });
  const { data: bills, error } = await supabase.from('electricity_bills').select('id, bill_date, units_kwh, total_payable, provider').eq('user_id', user.id).eq('verification_status', 'verified').order('bill_date', { ascending: false }).limit(2);
  if (error) return Response.json({ error: 'Unable to load verified bill evidence.' }, { status: 500 });
  if (!bills?.length) return Response.json({ answer: "I don't have enough verified bill data to answer that.", evidence: [], status: 'INSUFFICIENT_DATA' });
    if (!env.LLM_API_KEY) return Response.json({ answer: 'AI explanations are not configured yet. Your verified bill evidence is available in Reports.', evidence: bills, status: 'NOT_CONFIGURED' });
    const newest = bills[0];
    const previous = bills[1];
    const comparison = previous ? {
      unitsChange: newest.units_kwh !== null && previous.units_kwh !== null ? newest.units_kwh - previous.units_kwh : null,
      amountChange: newest.total_payable !== null && previous.total_payable !== null ? newest.total_payable - previous.total_payable : null
    } : null;
    const context = JSON.stringify({ evidence: bills, deterministicComparison: comparison });
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.LLM_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: env.LLM_MODEL || 'gpt-4o-mini', temperature: 0, messages: [
        { role: 'system', content: 'Answer only from the supplied verified bill evidence. Distinguish FACT, CALCULATION, and UNKNOWN. Never infer missing values or claim evidence that is not present. Cite bill IDs when making a factual statement.' },
        { role: 'user', content: `Question: ${parsed.data.question}\nVerified evidence: ${context}` }
      ] })
      });
    } catch {
      return Response.json({ error: 'AI service is unavailable.', evidence: bills, status: 'AI_FAILED' }, { status: 502 });
    }
    if (!response.ok) return Response.json({ error: 'AI service is unavailable.', evidence: bills, status: 'AI_FAILED' }, { status: 502 });
    const completion = await response.json() as { choices?: { message?: { content?: string } }[] };
    return Response.json({ answer: completion.choices?.[0]?.message?.content || 'AI returned no explanation.', evidence: bills, status: 'ANSWERED' });
}