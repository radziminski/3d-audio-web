export const getUserId = () =>
  typeof window !== 'undefined' && localStorage.getItem('userId');
