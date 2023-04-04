import { ComponentProps, ReactNode } from 'react';
import { Button as MantineButton } from '@mantine/core';

type ButtonProps = ComponentProps<typeof MantineButton> & {
  children?: ReactNode;
};

export const Button = (props: ButtonProps) => {
  return <MantineButton {...props} />;
};
