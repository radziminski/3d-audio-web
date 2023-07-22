import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '../../helpers/3D/getUnitSphereCoordinates';
import {
  DEFAULT_AZIMUTH,
  DEFAULT_ELEVATION,
} from '../../services/audio/constants';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';

export type SceneType = 'inside' | 'outside';

export type AppMode = 'playground' | 'guess' | 'test';

interface SettingsState {
  appMode: AppMode | undefined;
  azimuth: number;
  elevation: number;
  gain: number;
  panning: number;
  sourcePosition: SpatialPoint;
  audioSource: string;
  sceneType: SceneType;
  reset: () => void;
  setAppMode: (mode: AppMode) => void;
  setAzimuth: (newAzimuth: number) => void;
  setElevation: (newElevation: number) => void;
  setRandomAngles: () => void;
  setGain: (newGain: number) => void;
  setPanning: (newPanning: number) => void;
  setAudioSource: (newSource: string) => void;
  setSceneType: (newSceneType: SceneType) => void;
}

export const INITIAL_STORE = {
  appMode: undefined,
  azimuth: DEFAULT_AZIMUTH,
  elevation: DEFAULT_ELEVATION,
  gain: 100,
  panning: 0,
  sourcePosition: { x: 0, y: 0, z: 1 },
  audioSource: '/test.mp3',
  sceneType: 'outside',
} as const;

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STORE,
      reset: () => {
        set(INITIAL_STORE);
      },
      setAppMode: (mode) => {
        set({ appMode: mode });
      },
      setAzimuth: (newAzimuth) => {
        const { elevation } = get();
        const sourcePosition = getUniSphereCoordinates(
          360 - newAzimuth,
          elevation
        );
        set({ azimuth: 360 - newAzimuth, sourcePosition });
      },
      setElevation: (newElevation) => {
        const { azimuth } = get();
        const sourcePosition = getUniSphereCoordinates(azimuth, newElevation);
        set({ elevation: newElevation, sourcePosition });
      },
      setRandomAngles: () => {
        let azimuth = 0;
        let elevation = 0;

        for (let i = 0; i < 1000; i++) {
          const { azimuth: randomAzimuth, elevation: randomElevation } =
            getRandomAzimuthElevation();

          const diff = Math.abs(randomAzimuth - get().azimuth);

          if (Math.min(diff, 360 - diff) <= 45) {
            continue;
          }

          azimuth = randomAzimuth;
          elevation = randomElevation;

          break;
        }

        const sourcePosition = getUniSphereCoordinates(azimuth, elevation);

        set({ azimuth, elevation, sourcePosition });
      },
      setGain: (newGain) => {
        set({ gain: newGain });
      },
      setPanning: (newPanning) => {
        set({ panning: newPanning });
      },
      setAudioSource: (newSource) => {
        set({ audioSource: newSource });
      },
      setSceneType: (newSceneType) => {
        set({ sceneType: newSceneType });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
