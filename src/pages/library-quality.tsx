import { Center, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { LibraryQualityCompare } from '~/components/library-quality-compare/LibraryQuality';
import { Providers } from '~/components/providers/Providers';

export default function LibraryQuality() {
  const [showAudioScene, setShowAudioScene] = useState(false);

  useEffect(() => {
    setShowAudioScene(true);
  }, [setShowAudioScene]);

  if (!showAudioScene) return null;

  return (
    <Providers>
      <LibraryQualityCompare />
    </Providers>
  );
}
