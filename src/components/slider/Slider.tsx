import { createStyles, Slider as MantineSlider } from '@mantine/core';
import { ComponentProps } from 'react';

const useStyles = createStyles((theme) => ({
  slider: {},
  sliderTitle: {
    fontSize: '16px',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 400,
    color: 'white',
    margin: 0,
    marginBottom: '12px',
  },
}));

type SliderProps = ComponentProps<typeof MantineSlider> & {
  label: string;
};

export const Slider = ({ label, ...props }: SliderProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.slider}>
      <h2 className={classes.sliderTitle}>{label}</h2>
      <MantineSlider
        defaultValue={40}
        thumbSize={26}
        styles={(theme) => ({
          track: {
            color: 'red',
          },
          //   mark: {
          //     borderColor: theme.colors.green[3],
          //   },
          //   markFilled: {
          //     borderColor: theme.colors.green[3],
          //   },
        })}
        {...props}
      />
    </div>
  );
};
