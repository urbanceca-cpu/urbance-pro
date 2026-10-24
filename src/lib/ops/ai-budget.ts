// Verified against OpenAI's GPT-4.1 mini standard pricing on 23 October 2026.
// Deliberately reserve much more than the bounded maximum request charge.
// This allowance applies only to Vision/Shadow, not Instant Quote usage.
export const AI_BUDGET = {
  monthlyCadCents:500,reservationCadCents:25,maxPromptBytes:30000,
  maxInputTokensBound:50000,maxOutputTokens:1400,
  inputUsdPerMillion:0.40,outputUsdPerMillion:1.60,
  cadPerUsdBuffer:2,pricingReviewUntil:'2026-11-23T00:00:00Z',
} as const;
export function worstCaseCadCents(){return Math.ceil((AI_BUDGET.maxInputTokensBound*AI_BUDGET.inputUsdPerMillion+AI_BUDGET.maxOutputTokens*AI_BUDGET.outputUsdPerMillion)/1000000*AI_BUDGET.cadPerUsdBuffer*100);}
export function aiPricingCurrent(now=Date.now()){return now<Date.parse(AI_BUDGET.pricingReviewUntil)&&worstCaseCadCents()<=AI_BUDGET.reservationCadCents;}
