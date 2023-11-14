import { PropsWithChildren } from 'react';
import { Center, createStyles } from '@mantine/core';

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
  withPadding: {
    padding: '64px 32px',
  },
}));

type LayoutProps = {
  noPadding?: boolean;
} & PropsWithChildren;

export const Layout = ({ children, noPadding }: LayoutProps) => {
  const { classes } = useStyles();

  return (
    <Center
      className={`${classes.wrapper} ${noPadding ? '' : classes.withPadding}`}
    >
      {children}
    </Center>
  );
};
