import { z } from 'zod';
const short = z.string().trim().min(1).max(600);
export const aiForecastSchema = z
  .object({
    conclusion: z
      .object({
        verdict: short,
        answer: short,
        reasons: z.array(short).min(1).max(3),
        turningPoint: short,
        nextStep: short,
      })
      .strict(),
    trend: short,
    scenarios: z
      .array(
        z
          .object({
            kind: z.enum(['opening', 'continuity', 'friction']),
            condition: short,
            outlook: short,
            observe: short,
            reviseIf: short,
          })
          .strict(),
      )
      .length(3),
    recommendations: z
      .array(z.object({ action: short, observe: short, reconsiderIf: short }).strict())
      .min(2)
      .max(4),
  })
  .strict();
export type AIForecast = z.infer<typeof aiForecastSchema>;
