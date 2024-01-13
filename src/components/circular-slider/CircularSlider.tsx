import ReactCircularSlider from '@fseehawer/react-circular-slider';
import { useState } from 'react';
import { createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  wrapper: {
    opacity: '50% !important',
    pointerEvents: 'none',
    cursor: 'not-allowed',
  },
}));

type Props = {
  onChange?: (value: number) => void;
  disabled?: boolean;
};

export const CircularSlider = ({ onChange, disabled }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const { classes } = useStyles();

  return (
    <section className={disabled ? classes.wrapper : undefined}>
      <ReactCircularSlider
        label='Azimuth'
        dataIndex={1}
        min={0}
        max={360}
        direction={1}
        knobPosition='top'
        valueFontSize='4rem'
        trackColor='#eeeeee'
        progressColorFrom={isDragging ? '#F0A367' : '#00bfbd'}
        progressColorTo={isDragging ? '#F65749' : '#009c9a'}
        labelColor={'white'}
        knobColor={isDragging ? '#F0A367' : '#00bfbd'}
        isDragging={(value: boolean) => setIsDragging(value)}
        onChange={(value: number) => onChange?.(Number(value))}
        width={200}
      />
    </section>
  );
};
