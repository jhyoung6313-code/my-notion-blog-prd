import api from './axios';

export const login = async (username, password) => {
  const { data } = await api.post('/auth/login', { username, password });
  return data; // { token, user }
};

export const register = async (username, password, displayName) => {
  const { data } = await api.post('/auth/register', { username, password, displayName });
  return data; // { token, user }
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data; // user
};
