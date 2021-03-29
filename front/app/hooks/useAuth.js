import { useCallback, useContext } from 'react';
import axios from 'axios';
import { Context } from '../authStore';

export default function useAuth() {
  const [state, dispatch] = useContext(Context);

  const refresh = useCallback(() => {
    if (state.refreshToken && state.refreshToken.expires) {
      const now = new Date();
      const expires = new Date(state.refreshToken.expires);
      if (now.getTime() < expires.getTime()) {
        return axios
          .post('http://localhost:3001/v1/auth/refresh-tokens', {
            refreshToken: state.refreshToken.token,
          })
          .then(res => {
            dispatch({
              type: 'SET_AUTH',
              payload: {
                user: res.data.user,
                accessToken: res.data.tokens.access,
                refreshToken: res.data.tokens.refresh,
              },
            });
            localStorage.setItem(
              'refreshToken',
              JSON.stringify(res.data.tokens.refresh),
            );

            return res.data.tokens.access.token;
          })
          .catch(() => {
            dispatch({
              type: 'SET_AUTH',
              payload: {
                user: null,
                accessToken: null,
                refreshToken: null,
              },
            });
            localStorage.removeItem('refreshToken');
          });
      }
    }

    return false;
  }, [state]);

  const login = useCallback(
    ({ email, password }) =>
      axios
        .post('http://localhost:3001/v1/auth/login', {
          email,
          password,
        })
        .then(res => {
          dispatch({
            type: 'SET_AUTH',
            payload: {
              user: res.data.user,
              accessToken: res.data.tokens.access,
              refreshToken: res.data.tokens.refresh,
            },
          });
          localStorage.setItem(
            'refreshToken',
            JSON.stringify(res.data.tokens.refresh),
          );
        }),
    [],
  );

  const logout = useCallback(async () => {
    if (state.refreshToken) {
      return axios
        .post('http://localhost:3001/v1/auth/logout', {
          refreshToken: state.refreshToken.token,
        })
        .finally(() => {
          dispatch({
            type: 'SET_AUTH',
            payload: {
              user: null,
              accessToken: null,
              refreshToken: null,
            },
          });
          localStorage.removeItem('refreshToken');
        });
    }

    return false;
  }, [state]);

  return {
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    refresh,
    login,
    logout,
  };
}
