import { nanoid } from 'nanoid';

export const generateUserId = () =>
  localStorage.setItem('userId', `user_${nanoid()}`);
