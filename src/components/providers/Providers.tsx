import { MantineProvider } from '@mantine/core';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '800'],
  subsets: ['latin'],
});

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <main className={poppins.className}>{children}</main>
    </MantineProvider>
  );
};
