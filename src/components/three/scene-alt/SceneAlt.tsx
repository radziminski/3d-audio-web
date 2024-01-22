import { useTestStore } from '~/store/settings/useTestStore';
import { StageContent } from './StageAltContent';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { roundToNearest } from '~/helpers/math/roundToNearest';

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
        selection={roundToNearest(selectedAzimuth, selectedElevation)}
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
