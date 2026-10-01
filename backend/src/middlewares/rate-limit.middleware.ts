import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * Lightweight, zero-dependency in-memory rate limiter middleware.
 * Protects AI inference and database ingestion routes from abuse / quota exhaustion.
 */
export const createRateLimiter = (options: {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const maxRequests = options.maxRequests || 60;   // 60 requests per minute
  const message = options.message || 'Quá nhiều yêu cầu từ client. Vui lòng thử lại sau giây lát.';

  const ipRecords = new Map<string, RateLimitRecord>();

  // Cleanup expired IP records every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRecords.entries()) {
      if (now > record.resetTime) {
        ipRecords.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-client';

    const now = Date.now();
    let record = ipRecords.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipRecords.set(clientIp, record);
      return next();
    }

    record.count++;

    if (record.count > maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      res.status(429).json({
        status: 'error',
        statusCode: 429,
        message,
        retryAfterSeconds: retryAfterSec,
      });
      return;
    }

    next();
  };
};

export const chatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30, // 30 chat messages per minute per IP
  message: 'Bạn đang gửi câu hỏi quá nhanh. Vui lòng chờ vài giây trước khi gửi tiếp nhé!',
});

export const ingestRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 5,  // 5 ingestion calls per minute per IP
  message: 'Yêu cầu đồng bộ dữ liệu quá thường xuyên. Vui lòng thử lại sau 1 phút.',
});
