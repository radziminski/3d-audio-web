import {
  bigint,
  boolean,
  json,
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
  isBypassed: boolean('isBypassed').default(false),
  guessedIsBypassed: boolean('guessedIsBypassed').default(false),
  type: text('guessType').default('normal'), // or bypassed or left-only or right-only
  library: text('library').notNull(),
  lastSample: text('lastSample'),
  usedSamples: json('usedSamples').$type<string[]>(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  duration: bigint('duration', { mode: 'number' }),
  versionSha: text('versionSha').notNull(),
  os: text('os'),
});

export type Guess = InferSelectModel<typeof guessesTable>;
export type NewGuess = InferInsertModel<typeof guessesTable>;

export const insertGuessSchema = createInsertSchema(guessesTable);

export const qualityGuessesTable = pgTable('quality', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  testId: text('testId').notNull(),
  library: text('library').notNull(),
  soundQuality: smallint('soundQuality').notNull(),
  soundSpatialQuality: smallint('soundSpatialQuality').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  duration: bigint('duration', { mode: 'number' }),
  versionSha: text('versionSha').notNull(),
  os: text('os'),
});

export type QualityGuess = InferSelectModel<typeof qualityGuessesTable>;
export type NewQualityGuess = InferInsertModel<typeof qualityGuessesTable>;

export const insertQualityGuessSchema = createInsertSchema(qualityGuessesTable);
