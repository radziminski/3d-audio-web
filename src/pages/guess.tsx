import { CombinedAudioScene } from '~/components/combined-audio-scene/CombinedAudioScene';
import { Providers } from '~/components/providers/Providers';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

export default function GuessPage() {
  const isClientRender = useClientRender();

  if (!isClientRender) return null;

  return (
    <Providers>
      <CombinedAudioScene />
    </Providers>
  );
}
