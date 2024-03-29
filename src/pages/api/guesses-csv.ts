import { NextApiRequest, NextApiResponse } from 'next';
import { retrieveGuesses } from './guesses';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const retrieveGuessesCsvHandler = async (
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
      { id: 'trueAzimuth', title: 'trueAzimuth' },
      { id: 'trueElevation', title: 'trueElevation' },
      { id: 'guessedAzimuth', title: 'guessedAzimuth' },
      { id: 'guessedElevation', title: 'guessedElevation' },
      { id: 'isBypassed', title: 'isBypassed' },
      { id: 'guessedIsBypassed', title: 'guessedIsBypassed' },
      { id: 'library', title: 'library' },
      { id: 'guessType', title: 'guessType' },
      { id: 'sample', title: 'sample' },
      { id: 'view', title: 'view' },
      { id: 'createdAt', title: 'createdAt' },
      { id: 'updatedAt', title: 'updatedAt' },
      { id: 'duration', title: 'duration' },
      { id: 'versionSha', title: 'versionSha' },
      { id: 'os', title: 'os' },
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

export default retrieveGuessesCsvHandler;
