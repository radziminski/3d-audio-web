import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { NewGuess, guessesTable, insertGuessSchema } from '../../../db/schema';
import { ZodError, z } from 'zod';
import { eq } from 'drizzle-orm';

type RequestPayload = NewGuess[];

export const createGuessesSchema = z.array(insertGuessSchema);

class ValidationError extends Error {}

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

  const result = await db.query.guessesTable.findFirst({
    where: eq(guessesTable.testId, testId),
  });

  if (result) {
    throw new ValidationError('Test already submitted');
  }
};

type ResponseDto = {
  message: string;
};

const submitGuessesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseDto>
) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed',
    });

    return;
  }

  try {
    createGuessesSchema.parse(req.body);

    await validateGuesses(req.body as RequestPayload);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json({ message: e.message });
    }

    res.status(400).json(e as ZodError);

    return;
  }

  const guesses = req.body as RequestPayload;

  await db.insert(guessesTable).values(guesses);

  const data: ResponseDto = {
    message: 'Guesses submit successfully ✅',
  };

  res.status(200).json(data);
};

export default submitGuessesHandler;
