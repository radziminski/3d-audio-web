import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import {
  NewQualityGuess,
  qualityGuessesTable,
  insertQualityGuessSchema,
} from '../../../db/schema';
import { ZodError, z } from 'zod';
import { eq } from 'drizzle-orm';

type RequestPayload = NewQualityGuess[];

export const createGuessesSchema = z.array(insertQualityGuessSchema);

class ValidationError extends Error {}

class AlreadyExists extends Error {}

const validateGuesses = async (guesses: RequestPayload) => {
  const testId = guesses.reduce<string | undefined>((acc, guess) => {
    if (acc && acc !== guess.testId) {
      throw new Error('Test id mismatch in guesses');
    }

    return guess.testId;
  }, undefined);

  if (!testId) {
    throw new ValidationError('No testId');
  }

  const result = await db.query.qualityGuessesTable.findFirst({
    where: eq(qualityGuessesTable.testId, testId),
  });

  if (result) {
    throw new AlreadyExists('Test already submitted');
  }
};

type ResponseDto = {
  message: string;
};

const submitQualityGuessesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDto>
) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed',
    });

    return;
  }

  let exists = false;

  try {
    createGuessesSchema.parse(req.body);

    await validateGuesses(req.body as RequestPayload);
  } catch (e) {
    if (!(e instanceof AlreadyExists)) {
      if (e instanceof ValidationError) {
        res.status(400).json({ message: e.message });
      }

      res.status(400).json(e as ZodError);

      return;
    }

    exists = true;
  }

  const guesses = req.body as RequestPayload;

  if (exists) {
    await db
      .delete(qualityGuessesTable)
      .where(eq(qualityGuessesTable.testId, guesses[0].testId));
  }

  await db.insert(qualityGuessesTable).values(guesses);

  const data: ResponseDto = {
    message: 'Guesses submit successfully ✅',
  };

  res.status(200).json(data);
};

export default submitQualityGuessesHandler;
