import { create } from 'zustand';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '../../helpers/3D/getUnitSphereCoordinates';
import {
  DEFAULT_AZIMUTH,
  DEFAULT_ELEVATION,
} from '../../services/audio/constants';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';

export type SceneType = 'inside' | 'outside';

interface SettingsState {
  azimuth: number;
  elevation: number;
  gain: number;
  panning: number;
  sourcePosition: SpatialPoint;
  audioSource: string;
  sceneType: SceneType;
  setAzimuth: (newAzimuth: number) => void;
  setElevation: (newElevation: number) => void;
  setRandomAngles: () => void;
  setGain: (newGain: number) => void;
  setPanning: (newPanning: number) => void;
  setAudioSource: (newSource: string) => void;
  setSceneType: (newSceneType: SceneType) => void;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  azimuth: DEFAULT_AZIMUTH,
  elevation: DEFAULT_ELEVATION,
  gain: 100,
  panning: 0,
  sourcePosition: { x: 0, y: 0, z: 1 },
  audioSource: '/test.mp3',
  sceneType: 'outside',
  setAzimuth: (newAzimuth) => {
    const { elevation } = get();
    const sourcePosition = getUniSphereCoordinates(360 - newAzimuth, elevation);
    set({ azimuth: 360 - newAzimuth, sourcePosition });
  },
  setElevation: (newElevation) => {
    const { azimuth } = get();
    const sourcePosition = getUniSphereCoordinates(azimuth, newElevation);
    set({ elevation: newElevation, sourcePosition });
  },
  setRandomAngles: () => {
    const { azimuth, elevation } = getRandomAzimuthElevation();
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
}));
