import React, { createContext, useReducer } from 'react';
import Reducer from './reducers/authReducer';

const refreshTokenString = localStorage.getItem('refreshToken') || null;
const refreshToken = JSON.parse(refreshTokenString);

const initialState = {
  user: null,
  loading: false,
  accessToken: null,
  refreshToken,
};

export const Context = createContext(initialState);

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

export default Store;
