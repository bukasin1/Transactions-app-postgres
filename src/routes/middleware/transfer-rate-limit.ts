import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'transfer-funds',
  points: 1,
  duration: 10,
});

export default async function rateLimitTransferCreation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await rateLimiter.consume(req.ip);

    next();
  } catch (error) {
    const retryAfter = (Math.trunc(error.msBeforeNext / 1000) || 1).toString();
    res.set('Retry-After', retryAfter);
    res.status(429).json({
      message: 'Please wait a few seconds before attempting a new transfer',
    });
  }
}
