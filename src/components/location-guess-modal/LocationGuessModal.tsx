import { Modal } from '@mantine/core';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { roundToDecimal } from '~/helpers/3D/getUnitSphereCoordinates';

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

  const windowAzimuth =
    typeof window !== 'undefined' ? (window as any)?.azimuth ?? 0 : 0;

  const windowElevation =
    typeof window !== 'undefined' ? (window as any)?.elevation ?? 0 : 0;

  return (
    <Modal opened={isOpened} onClose={onClose} title='Your Guess'>
      True azimuth: {roundToDecimal(azimuth)}
      <br />
      True elevation: {roundToDecimal(elevation)}
      <br />
      <br />
      Your azimuth guess: {roundToDecimal(windowAzimuth)} (you were off by{' '}
      {roundToDecimal(Math.abs(azimuth - windowAzimuth))} degrees)
      <br />
      Your elevation guess: {roundToDecimal(windowElevation)} (you were off by{' '}
      {roundToDecimal(Math.abs(elevation - windowElevation))} degrees)
      <br />
    </Modal>
  );
};
