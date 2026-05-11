import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [];
    if (
      !origin ||
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.includes('*')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: process.env.CORS_METHODS
    ? process.env.CORS_METHODS.split(',')
    : ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: process.env.CORS_HEADERS
    ? process.env.CORS_HEADERS.split(',')
    : ['Content-Type', 'X-API-Key'],
  credentials: true,
  optionsSuccessStatus: 200
};

export const corsMiddleware = cors(corsOptions);
