import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export type SupportedLibrary =
  | 'resonance'
  | 'web-audio'
  | 'omnitone'
  | 'js-ambisonics';

export const useRedirectToLibrary = () => {
  const router = useRouter();
  const [library, setLibrary] = useState<SupportedLibrary>();

  const isWebAudio = library === 'web-audio';
  const isResonance = library === 'resonance';
  const isOmnitone = library === 'omnitone';
  const isJsAmbisonics = library === 'js-ambisonics';

  useEffect(() => {
    if (!isResonance) {
      return;
    }
    import('~/services/audio/resonance-audio').then(
      ({ ResonanceAudioService }) => {
        (window as any).as = ResonanceAudioService.getInstance(true);
        router.push('./resonance-audio');
      }
    );
  }, [isResonance, router]);

  useEffect(() => {
    if (!isWebAudio) {
      return;
    }
    import('~/services/audio/web-audio-api').then(({ WebAudioApiService }) => {
      (window as any).as = WebAudioApiService.getInstance(true);
      router.push('./web-audio-api');
    });
  }, [isWebAudio, router]);

  useEffect(() => {
    if (!isOmnitone) {
      return;
    }
    import('~/services/audio/omnitone').then(({ OmnitoneService }) => {
      (window as any).as = OmnitoneService.getInstance(true);
      router.push('./omnitone-audio');
    });
  }, [isOmnitone, router]);

  useEffect(() => {
    if (!isJsAmbisonics) {
      return;
    }
    import('~/services/audio/js-ambisonics').then(
      ({ JsAmbisonicsAudioService }) => {
        (window as any).as = JsAmbisonicsAudioService.getInstance(true);
        router.push('./js-ambisonics-audio');
      }
    );
  }, [isJsAmbisonics, router]);

  const redirectToLibrary = useCallback(
    (library: SupportedLibrary) => setLibrary(library),
    []
  );

  return { redirectToLibrary };
};
