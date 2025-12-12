export const SURGE_PRICING = {
  THRESHOLD: 3,
  WINDOW: 5 * 60 * 1000,
  INCREASE: 0.1,
  RESET_WINDOW: 10 * 60 * 1000,
};

export const PRICE_RANGE = {
  MIN: 2000,
  MAX: 3000,
};

export const WALLET = {
  DEFAULT_BALANCE: 50000,
  MIN_BALANCE: 0,
};

export const FLIGHT = {
  TOTAL_SEATS: 180,
  MIN_SEATS: 0,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export const JWT_CONFIG = {
  EXPIRY: (process.env.JWT_EXPIRE || '7d') as string,
  SECRET: (process.env.JWT_SECRET || 'your-secret-key') as string,
} as const;
