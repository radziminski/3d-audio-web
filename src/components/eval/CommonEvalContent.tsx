import { Button } from '@mantine/core';

export const CommonEvalContent = () => {
  return (
    <>
      <h1>Evaluation in progress</h1>
      <Button onClick={() => window.location.reload()}>Stop</Button>
    </>
  );
};
