import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';
import {
  SupportedLibrary,
  useRedirectToLibrary,
} from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { SUPPORTED_LIBRARIES } from '~/hooks/use-test-mode/useTestMode';

const checkIsLibrarySupported = (
  library: string
): library is SupportedLibrary =>
  SUPPORTED_LIBRARIES.includes(library as SupportedLibrary);

export default function LibraryRedirectPage() {
  const router = useRouter();

  const library = router.query.library as string;

  const { redirectToLibrary } = useRedirectToLibrary();

  useEffect(() => {
    if (checkIsLibrarySupported(library)) {
      redirectToLibrary(library);
      return;
    }

    console.error('Unsupported library param');
  });

  return (
    <Providers>
      <Layout />
    </Providers>
  );
}
