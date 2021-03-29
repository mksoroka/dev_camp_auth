import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import useAuth from './useAuth';

const loginPath = '/login';
const homePath = '/';

export default function useRequireAuth(invert) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(push(loginPath));
    } else if (invert) {
      dispatch(push(homePath));
    }
  }, [user, dispatch]);
}
