import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
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
      <Notifications position='top-right' />
      <main className={poppins.className}>{children}</main>
    </MantineProvider>
  );
};
