import { Layout } from '~/components/layout/Layout';
import { PlaygroundAudioScene } from '~/components/playground-audio-scene/PlaygroundAudioScene';
import { Providers } from '~/components/providers/Providers';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

export default function PlaygroundPage() {
  const isClientRender = useClientRender();

  if (!isClientRender) return null;

  return (
    <Providers>
      <Layout asFragment>
        <PlaygroundAudioScene />
      </Layout>
    </Providers>
  );
}
