import { createStyles } from '@mantine/core';
import { useState } from 'react';
import { Compare } from '~/components/compare/Compare';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

const useStyles = createStyles(() => ({
  container: {
    maxWidth: 850,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: '0 0 24px',
  },
  paragraph: {
    margin: 0,
    color: '#233',
    fontWeight: 400,
    textAlign: 'left',
    strong: {
      fontWeight: 600,
    },
    div: {
      margin: '10px 14px',
      fontWeight: 400,
      span: {
        fontWeight: 600,
      },
    },
  },
  buttons: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    margin: '32px 0 0',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
}));

export default function ComparePage() {
  const { classes } = useStyles();

  const isClientRender = useClientRender();

  if (!isClientRender)
    return (
      <>
        <Providers>
          <Layout></Layout>
        </Providers>
      </>
    );

  return (
    <Providers>
      <Layout withScroll>
        <div className={classes.container}>
          <h1 className={classes.title}>Compare</h1>
        </div>
        <Compare />
      </Layout>
    </Providers>
  );
}
