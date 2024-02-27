import { CombinedAudioScene } from '~/components/combined-audio-scene/CombinedAudioScene';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

export default function GuessPage() {
  const isClientRender = useClientRender();

  if (!isClientRender) return null;

  return (
    <Providers>
      <Layout noPadding>
        <CombinedAudioScene />
      </Layout>
    </Providers>
  );
}
