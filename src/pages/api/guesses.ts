import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { Guess, guessesTable } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';

type ResponseDto = Guess[];

export const retrieveGuesses = async (req: NextApiRequest) => {
  const testId = req.query.testId as string;
  const userId = req.query.userId as string;
  const library = req.query.library as string;

  const conditions = [];

  if (testId) {
    conditions.push(eq(guessesTable.testId, testId));
  }

  if (userId) {
    conditions.push(eq(guessesTable.userId, userId));
  }

  if (library) {
    conditions.push(eq(guessesTable.library, library));
  }

  const guesses = await db.query.guessesTable.findMany({
    where: and(...conditions),
  });

  return guesses;
};

const submitGuessesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDto>
) => {
  if (req.method !== 'GET') {
    res.status(405).json([]);

    return;
  }

  const guesses = await retrieveGuesses(req);

  res.status(200).json(guesses);
};

export default submitGuessesHandler;
