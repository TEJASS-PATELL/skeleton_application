import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 5,          
  duration: 30,       
});

//* this code limit login attempts to 5 in 30 seconds for better security and sapam prevention
export const strictLimiter = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ message: "Too many login attempts. Try again later!" });
  }
};
