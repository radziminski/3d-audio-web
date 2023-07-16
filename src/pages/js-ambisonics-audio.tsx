import { JsAmbisonicsAudioScene } from '~/components/js-ambisonics-audio-scene/JsAmbisonicsAudioScene';
import { Providers } from '~/components/providers/Providers';

export default function JsAmbisonicsAudioPage() {
  return (
    <Providers>
      <JsAmbisonicsAudioScene />;
    </Providers>
  );
}
