import ReactCircularSlider from '@fseehawer/react-circular-slider';
import { useEffect, useState } from 'react';
import { createStyles } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

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
  const [hide, setHide] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const mediaQuery = useMediaQuery('(max-width: 1500px)', false);
  const mediaQuerySmall = useMediaQuery('(max-width: 700px)', false);

  useEffect(() => {
    setHide(true);
    setTimeout(() => setHide(false), 50);
  }, [mediaQuery, mediaQuerySmall]);

  const { classes } = useStyles();

  if (hide) return null;

  return (
    <section className={disabled ? classes.wrapper : undefined}>
      <ReactCircularSlider
        label='Azimuth'
        dataIndex={1}
        min={0}
        max={360}
        direction={1}
        knobPosition='top'
        valueFontSize={mediaQuery ? '1rem' : '4rem'}
        trackColor='#eeeeee'
        progressColorFrom={isDragging ? '#F0A367' : '#00bfbd'}
        progressColorTo={isDragging ? '#F65749' : '#009c9a'}
        labelColor={'white'}
        knobColor={isDragging ? '#F0A367' : '#00bfbd'}
        isDragging={(value: boolean) => setIsDragging(value)}
        onChange={(value: number) => onChange?.(Number(value))}
        width={mediaQuery ? (mediaQuerySmall ? 120 : 160) : 200}
      />
    </section>
  );
};
