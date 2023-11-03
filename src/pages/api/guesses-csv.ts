import { NextApiRequest, NextApiResponse } from 'next';
import { retrieveGuesses } from './guesses';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const submitGuessesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    res.status(405).json([]);

    return;
  }

  const guesses = await retrieveGuesses(req);

  const path = '/tmp/data.csv';

  const csvWriter = createObjectCsvWriter({
    path,
    header: [
      { id: 'id', title: 'id' },
      { id: 'userId', title: 'UserID' },
      { id: 'testId', title: 'TestID' },
      { id: 'library', title: 'library' },
      { id: 'trueAzimuth', title: 'trueAzimuth' },
      { id: 'trueElevation', title: 'trueElevation' },
      { id: 'guessedAzimuth', title: 'guessedAzimuth' },
      { id: 'guessedElevation', title: 'guessedElevation' },
      { id: 'os', title: 'os' },
      { id: 'versionSha', title: 'versionSha' },
      { id: 'duration', title: 'duration' },
    ],
  });

  csvWriter
    .writeRecords(guesses)
    .then(() => {
      const csvFile = fs.createReadStream(path);

      console.log('CSV file has been written');
      res
        .status(200)
        .setHeader('Content-Type', 'text/csv')
        .setHeader('Content-Disposition', `attachment; filename=${path}`)
        .send(csvFile);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: 'Error writing CSV file' });
    });
};

export default submitGuessesHandler;
