export const TEST_ANGLES = [
  // Azimuth
  {
    azimuth: 0,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 90,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 90 + 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 180,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 180 + 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 270,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 270 + 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  // Elevation
  {
    azimuth: 0,
    elevation: -90,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: -45,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: 0,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: 45,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: 90,
    type: 'elevation',
  } as const,
  // Traps
  {
    azimuth: 0,
    elevation: 0,
    isBypassed: true,
    type: 'bypassed',
  } as const,
  {
    azimuth: 0,
    elevation: 0,
    isBypassed: true,
    type: 'bypassed',
  } as const,
  {
    azimuth: 270,
    elevation: 0,
    isBypassed: false,
    type: 'left-only',
  } as const,
  {
    azimuth: 90,
    elevation: 0,
    isBypassed: false,
    type: 'right-only',
  } as const,
];

export const AZIMUTH_ANGLES = [45, 90, 135, 180, 225, 270, 315] as const;
export const ELEVATION_ANGLES = [-90, -45, 45, 90] as const;

export const SAMPLE_TYPES = [
  '/sample-pinknoise.mp3',
  '/sample-speech.mp3',
  '/sample-environmental.mp3',
] as const;

export const shuffleArray = <T>(arr: T[]) =>
  arr
    .map((value) => [Math.random(), value] as const)
    .sort(([a], [b]) => a - b)
    .map((entry) => entry[1]);

export const getAzimuthTestCases = () =>
  AZIMUTH_ANGLES.map((azimuth) =>
    SAMPLE_TYPES.map((sample) => ({
      azimuth,
      elevation: 0 as const,
      sample,
      guessType: 'azimuth' as const,
    }))
  ).flat();

export const getElevationTestCases = () =>
  ELEVATION_ANGLES.map((elevation) =>
    SAMPLE_TYPES.map((sample) => ({
      azimuth: Math.random() > 0.5 ? (90 as const) : (270 as const),
      elevation,
      sample,
      guessType: 'elevation' as const,
    }))
  ).flat();

const checkIfIsAzimuthRepeated = (
  testCases: ReturnType<typeof getAzimuthTestCases>
) => {
  for (let i = 0; i < testCases.length - 1; i++) {
    if (
      testCases[i].azimuth === testCases[i + 1].azimuth ||
      testCases[i].sample === testCases[i + 1].sample
    ) {
      return false;
    }
  }

  return true;
};

const checkIfIsElevationRepeated = (
  testCases: ReturnType<typeof getElevationTestCases>
) => {
  for (let i = 0; i < testCases.length - 1; i++) {
    if (
      testCases[i].elevation === testCases[i + 1].elevation ||
      testCases[i].sample === testCases[i + 1].sample
    ) {
      return false;
    }
  }

  return true;
};

export const getTestCases = () => {
  let azimuth = shuffleArray(getAzimuthTestCases());

  while (!checkIfIsAzimuthRepeated(azimuth)) {
    azimuth = shuffleArray(getAzimuthTestCases());
  }

  let elevation = getElevationTestCases();

  while (!checkIfIsElevationRepeated(elevation)) {
    elevation = shuffleArray(getElevationTestCases());
  }

  return [...azimuth, ...elevation];
};

export const TEST_CASES_LENGTH = [
  ...getAzimuthTestCases(),
  ...getElevationTestCases(),
].length;

export type Angles = ReturnType<typeof getTestCases>[0];
