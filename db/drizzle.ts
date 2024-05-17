/** 
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

// Connect to Vercel Postgres
export const db = drizzle(sql, { schema });
*/

/**
 * After the survey was completed on 7.05.2024, the Vercel free-tier limits were exceeded (on 15.05.2024)
 * and the connections to the database were limited until the end of the month.
 *
 * To keep the preview of the application running, I've switched the database a different provider (since
 * the survey were already finished, it did not have any impact on its progress or results).
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';

const queryClient = postgres(process.env.TEMP_POSTGRES_URL as string);
export const db = drizzle(queryClient, { schema });
