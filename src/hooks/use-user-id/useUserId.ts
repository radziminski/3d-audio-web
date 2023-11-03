import { useEffect } from 'react';
import { generateUserId } from '~/helpers/user-id/generateUserId';
import { getUserId } from '~/helpers/user-id/getUserId';

export const useUserId = () => {
  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      generateUserId();
    }
  }, [userId]);

  return userId;
};
