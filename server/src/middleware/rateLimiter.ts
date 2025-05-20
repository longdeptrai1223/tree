import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Rate limiter cho API chung
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate_limit:',
  }),
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
  message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho đăng nhập
export const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'login_limit:',
  }),
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 lần đăng nhập thất bại mỗi IP trong 1 giờ
  message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 1 giờ',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho claim thưởng
export const claimLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'claim_limit:',
  }),
  windowMs: 24 * 60 * 60 * 1000, // 24 giờ
  max: 1, // Giới hạn 1 lần claim mỗi người dùng trong 24 giờ
  message: 'Bạn đã claim thưởng trong 24 giờ qua',
  standardHeaders: true,
  legacyHeaders: false,
}); 