import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL + '?sslmode=require',
  },
  strict: true,
  verbose: true,
} satisfies Config;
