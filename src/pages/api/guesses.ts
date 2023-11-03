import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { Guess, guessesTable } from '../../../db/schema';
import { and, eq, or } from 'drizzle-orm';

type ResponseDto = Guess[];

const getCondition = (condition: string | string[], column: any) => {
  if (Array.isArray(condition)) {
    let tempConditions = [];
    for (const item of condition) {
      tempConditions.push(eq(column, item));
    }

    return or(...tempConditions);
  }

  return eq(column, condition);
};

export const retrieveGuesses = async (req: NextApiRequest) => {
  const testId = req.query.testId as string;
  const userId = req.query.userId as string;
  const library = req.query.library as string;
  const trueAzimuth = req.query.trueAzimuth as string;
  const trueElevation = req.query.trueElevation as string;
  const versionSha = req.query.versionSha as string;

  const conditions = [];

  if (testId) {
    conditions.push(getCondition(testId, guessesTable.testId));
  }

  if (userId) {
    conditions.push(getCondition(userId, guessesTable.userId));
  }

  if (library) {
    conditions.push(getCondition(library, guessesTable.library));
  }

  if (trueAzimuth) {
    conditions.push(getCondition(trueAzimuth, guessesTable.trueAzimuth));
  }

  if (trueElevation) {
    conditions.push(getCondition(trueElevation, guessesTable.trueElevation));
  }

  if (versionSha) {
    conditions.push(getCondition(versionSha, guessesTable.versionSha));
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
