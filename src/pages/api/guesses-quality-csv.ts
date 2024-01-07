import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { retrieveQualityGuesses } from './guesses-quality';

const retrieveQualityGuessesCsvHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    res.status(405).json([]);

    return;
  }

  const guesses = await retrieveQualityGuesses(req);

  const path = '/tmp/data.csv';

  const csvWriter = createObjectCsvWriter({
    path,
    header: [
      { id: 'id', title: 'id' },
      { id: 'userId', title: 'UserID' },
      { id: 'testId', title: 'TestID' },
      { id: 'library', title: 'library' },
      { id: 'soundQuality', title: 'soundQuality' },
      { id: 'soundSpatialQuality', title: 'soundSpatialQuality' },
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

export default retrieveQualityGuessesCsvHandler;
