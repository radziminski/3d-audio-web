import { ThemeProvider } from '@emotion/react';
import { createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Providers } from '~/components/providers/Providers';
import {
  SupportedLibrary,
  useRedirectToLibrary,
} from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { SUPPORTED_LIBRARIES } from '~/hooks/use-test-mode/useTestMode';

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'linear-gradient(to bottom right, #49BCF6 , #49DEB2)',
    width: '100%',
    height: '100vh',
    fontFamily: 'var(--font-poppins)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
}));

const checkIsLibrarySupported = (
  library: string
): library is SupportedLibrary =>
  SUPPORTED_LIBRARIES.includes(library as SupportedLibrary);

export default function LibraryRedirectPage() {
  const { classes } = useStyles();

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
      <div className={classes.wrapper} />
    </Providers>
  );
}
