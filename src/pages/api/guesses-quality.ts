import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { QualityGuess, qualityGuessesTable } from '../../../db/schema';
import { and, eq, or } from 'drizzle-orm';

type ResponseDto = QualityGuess[];

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

export const retrieveQualityGuesses = async (req: NextApiRequest) => {
  const testId = req.query.testId as string;
  const userId = req.query.userId as string;
  const library = req.query.library as string;
  const versionSha = req.query.versionSha as string;

  const conditions = [];

  if (testId) {
    conditions.push(getCondition(testId, qualityGuessesTable.testId));
  }

  if (userId) {
    conditions.push(getCondition(userId, qualityGuessesTable.userId));
  }

  if (library) {
    conditions.push(getCondition(library, qualityGuessesTable.library));
  }

  if (versionSha) {
    conditions.push(getCondition(versionSha, qualityGuessesTable.versionSha));
  }

  const guesses = await db.query.qualityGuessesTable.findMany({
    where: and(...conditions),
  });

  return guesses;
};

const retrieveQualityGuessesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDto>
) => {
  if (req.method !== 'GET') {
    res.status(405).json([]);

    return;
  }

  const guesses = await retrieveQualityGuesses(req);

  res.status(200).json(guesses);
};

export default retrieveQualityGuessesHandler;
