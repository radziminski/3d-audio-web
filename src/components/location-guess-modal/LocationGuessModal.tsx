import { Modal } from '@mantine/core';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { roundToDecimal } from '~/helpers/3D/getUnitSphereCoordinates';
import { useTestStore } from '~/store/settings/useTestStore';

type LocationGuessModalProps = {
  isOpened?: boolean;
  onClose: () => void;
};

export const LocationGuessModal = ({
  isOpened = false,
  onClose,
}: LocationGuessModalProps) => {
  const { azimuth, elevation } = useSettingsStore(({ azimuth, elevation }) => ({
    azimuth,
    elevation,
  }));

  const azimuthGuess = useTestStore((state) => state.azimuthGuess);
  const elevationGuess = useTestStore((state) => state.elevationGuess);

  return (
    <Modal opened={isOpened} onClose={onClose} title='Your Guess'>
      True azimuth: {roundToDecimal(azimuth)}
      <br />
      True elevation: {roundToDecimal(elevation)}
      <br />
      <br />
      Your azimuth guess: {roundToDecimal(azimuthGuess)} (you were off by{' '}
      {roundToDecimal(Math.abs(azimuth - azimuthGuess))} degrees)
      <br />
      Your elevation guess: {roundToDecimal(elevationGuess)} (you were off by{' '}
      {roundToDecimal(Math.abs(elevation - elevationGuess))} degrees)
      <br />
    </Modal>
  );
};
