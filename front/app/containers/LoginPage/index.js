import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import H1 from 'components/H1';

import messages from './messages';
import useAuth from '../../hooks/useAuth';
import useRequireAuth from '../../hooks/useRequireAuth';

export default function LoginPage() {
  useRequireAuth(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    login({
      email,
      password,
    }).then(() => {
      dispatch(push('/'));
    });
  });

  return (
    <div>
      <Helmet>
        <title>Login Page</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              value={email}
              onChange={event => {
                setEmail(event.target.value);
              }}
              type="text"
              name="email"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={event => {
                setPassword(event.target.value);
              }}
              name="password"
            />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
