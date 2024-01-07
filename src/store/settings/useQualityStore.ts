import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';

export interface LibraryQuality {
  soundQuality: number | undefined;
  soundSpatialQuality: number | undefined;
}

interface QualityStore {
  libraryQuality: Record<SupportedLibrary, LibraryQuality>;
  setLibraryQuality: (
    library: SupportedLibrary,
    quality: Partial<LibraryQuality>
  ) => void;
  reset: () => void;
}

export const INITIAL_STORE = {
  libraryQuality: {
    resonance: {
      soundQuality: undefined,
      soundSpatialQuality: undefined,
    },
    'web-api': {
      soundQuality: undefined,
      soundSpatialQuality: undefined,
    },
    omnitone: {
      soundQuality: undefined,
      soundSpatialQuality: undefined,
    },
    'js-ambisonics': {
      soundQuality: undefined,
      soundSpatialQuality: undefined,
    },
    'js-ambisonics-hoa': {
      soundQuality: undefined,
      soundSpatialQuality: undefined,
    },
  },
} as const;

export const useQualityStore = create<QualityStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STORE,
      reset: () => {
        set(INITIAL_STORE);
      },
      setLibraryQuality: (library, quality) => {
        const newQuality = {
          ...get().libraryQuality,
          [library]: {
            ...get().libraryQuality[library],
            ...quality,
          },
        };

        set({ libraryQuality: newQuality });
      },
    }),
    {
      name: 'quality-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
