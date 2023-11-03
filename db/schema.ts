import {
  bigint,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const guessesTable = pgTable('guesses', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  testId: text('testId').notNull(),
  trueAzimuth: smallint('trueAzimuth').notNull(),
  trueElevation: smallint('trueElevation').notNull(),
  guessedAzimuth: smallint('guessedAzimuth').notNull(),
  guessedElevation: smallint('guessedElevation').notNull(),
  library: text('library').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  duration: bigint('duration', { mode: 'number' }),
  versionSha: text('versionSha').notNull(),
  os: text('os'),
});

export type Guess = InferSelectModel<typeof guessesTable>;
export type NewGuess = InferInsertModel<typeof guessesTable>;

export const insertGuessSchema = createInsertSchema(guessesTable);
