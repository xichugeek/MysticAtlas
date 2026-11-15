import express from 'express';
import helmet from 'helmet';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import {
  ALGORITHM_VERSION,
  calculate,
  DATA_VERSION,
  getHexagram,
  HEXAGRAMS,
} from '../engines/iching';
import { AIError, AIService, configFromEnv } from './ai';

const values = z.array(z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)])).length(6);
const castSchema = z.object({ values }).strict();
const interpretSchema = z
  .object({
    values,
    theme: z.string().trim().max(300).default(''),
    lang: z.enum(['zh', 'en']).default('zh'),
  })
  .strict();

export function createApp(
  ai = new AIService(configFromEnv()),
  options: { production?: boolean; origin?: string; trustProxy?: boolean } = {},
) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', options.trustProxy ? 1 : false);
  app.use(
    helmet({
      contentSecurityPolicy: options.production
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'"],
              imgSrc: ["'self'", 'data:'],
              fontSrc: ["'self'"],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              upgradeInsecureRequests: null,
            },
          }
        : false,
    }),
  );
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use('/api', (req, res, next) => {
    if (req.method === 'POST' && req.get('origin')) {
      const origin = options.origin || `${req.protocol}://${req.get('host')}`;
      if (req.get('origin') !== origin) {
        res.status(403).json({ status: 'error', code: 'ORIGIN_REJECTED' });
        return;
      }
    }
    next();
  });
  app.use(express.json({ limit: '8kb', strict: true }));
  const buckets = new Map<string, { count: number; reset: number }>();
  app.use('/api', (req, res, next) => {
    if (req.path === '/health') {
      next();
      return;
    }
    const now = Date.now();
    for (const [key, b] of buckets) if (b.reset <= now) buckets.delete(key);
    const aiRequest = req.path === '/interpret' && req.method === 'POST';
    const key = createHash('sha256')
      .update(`${req.ip}|${aiRequest ? 'ai' : 'api'}`)
      .digest('hex');
    const limit = aiRequest ? ai.config.ratePerHour : 180;
    const window = aiRequest ? 3600000 : 60000;
    if (!buckets.has(key) && buckets.size >= 10000) {
      res.status(503).json({ code: 'SERVER_BUSY' });
      return;
    }
    const b = buckets.get(key) || { count: 0, reset: now + window };
    b.count++;
    buckets.set(key, b);
    if (b.count > limit) {
      res.set('Retry-After', String(Math.ceil((b.reset - now) / 1000)));
      res.status(429).json({ status: 'limited', code: 'RATE_LIMITED' });
      return;
    }
    next();
  });
  app.get('/api/health', (_req, res) =>
    res.json({
      status: 'ok',
      version: '1.0.0',
      algorithmVersion: ALGORITHM_VERSION,
      dataVersion: DATA_VERSION,
      ai: ai.available ? 'enabled' : 'disabled',
    }),
  );
  app.get('/api/hexagrams', (_req, res) =>
    res.json({ version: DATA_VERSION, hexagrams: HEXAGRAMS }),
  );
  app.get('/api/hexagrams/:id', (req, res) => {
    if (!/^(?:[1-9]|[1-5][0-9]|6[0-4])$/.test(req.params.id)) {
      res.status(404).json({ code: 'NOT_FOUND' });
      return;
    }
    res.json({ version: DATA_VERSION, hexagram: getHexagram(Number(req.params.id)) });
  });
  app.post('/api/calculate', (req, res) => {
    const parsed = castSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: 'error', code: 'INVALID_VALUES' });
      return;
    }
    res.json(calculate(parsed.data.values));
  });
  app.post('/api/interpret', async (req, res) => {
    const parsed = interpretSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: 'error', code: 'INVALID_INPUT' });
      return;
    }
    const result = calculate(parsed.data.values);
    try {
      res.json({
        status: 'success',
        chart: result,
        interpretation: await ai.interpret(result, parsed.data.theme, parsed.data.lang),
      });
    } catch (error) {
      const failure = error instanceof AIError ? error : new AIError('AI_UNAVAILABLE', 502);
      res.status(failure.status).json({
        status: failure.code === 'AI_DISABLED' ? 'disabled' : 'unavailable',
        code: failure.code,
        chart: result,
      });
    }
  });
  app.use('/api', (_req, res) => res.status(404).json({ code: 'NOT_FOUND' }));
  const errors: express.ErrorRequestHandler = (err, _req, res, _next) => {
    const status = err?.type === 'entity.too.large' ? 413 : 400;
    res
      .status(status)
      .json({ status: 'error', code: status === 413 ? 'BODY_TOO_LARGE' : 'INVALID_REQUEST' });
  };
  app.use(errors);
  return app;
}
