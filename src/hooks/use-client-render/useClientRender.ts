import { useEffect, useState } from 'react';

export const useClientRender = () => {
  const [isClientRender, setIsClientRender] = useState(false);

  useEffect(() => {
    setIsClientRender(true);
  }, [setIsClientRender]);

  return isClientRender;
};
