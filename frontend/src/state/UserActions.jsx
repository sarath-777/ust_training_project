export const setUser = (userData) => {
  return {
    type: 'SET_USER',
    payload: userData,
  }};
  
export const clearUser = () => {
  return {
    type: 'CLEAR_USER',
  }};