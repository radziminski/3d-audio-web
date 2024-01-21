import { useTestStore } from '~/store/settings/useTestStore';
import { StageContent } from './StageAltContent';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const Stage = (): JSX.Element => {
  const azimuthGuess = useTestStore((state) => state.azimuthGuess);
  const elevationGuess = useTestStore((state) => state.elevationGuess);
  const setGuessedDirections = useTestStore(
    (state) => state.setGuessedDirections
  );

  const appMode = useSettingsStore((state) => state.appMode);
  const azimuth = useSettingsStore((state) => state.azimuth);
  const elevation = useSettingsStore((state) => state.elevation);
  const isGuessingMode = appMode !== 'playground';
  const onAzimuthChange = useSettingsStore(({ setAzimuth }) => setAzimuth);
  const onElevationChange = useSettingsStore(
    ({ setElevation }) => setElevation
  );

  const selectedAzimuth = isGuessingMode ? azimuthGuess : azimuth;
  const selectedElevation = isGuessingMode ? elevationGuess : elevation;

  return (
    <Canvas camera={{ position: [-2, 10, -15] }} frameloop='demand'>
      <Environment
        files='/skybox-alt.hdr'
        background={true} // can be true, false or "only" (which only sets the background) (default: false)
        blur={0.4} // blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
        scene={undefined} // adds the ability to pass a custom THREE.Scene, can also be a ref
        encoding={undefined} // adds the ability to pass a cust
      />

      <StageContent
        selection={roundToNearest15(selectedAzimuth, selectedElevation)}
        setSelection={({ azimuth, elevation }) => {
          if (isGuessingMode) {
            setGuessedDirections(azimuth, elevation);

            return;
          }

          onAzimuthChange(360 - azimuth);
          onElevationChange(elevation);
        }}
      />
    </Canvas>
  );
};

function roundToNearest15(
  azimuth: number,
  elevation: number
): { azimuth: number; elevation: number } {
  // Ensure azimuth is within the range 0 to 360
  const normalizedAzimuth = ((azimuth % 360) + 360) % 360;

  // Round azimuth to the nearest multiple of 15
  const roundedAzimuth = Math.round(normalizedAzimuth / 15) * 15;

  // Ensure elevation is within the range -90 to 90
  const clampedElevation = Math.max(-90, Math.min(90, elevation));

  // Round elevation to the nearest multiple of 15
  const roundedElevation = Math.round(clampedElevation / 15) * 15;

  return { azimuth: roundedAzimuth, elevation: roundedElevation };
}
