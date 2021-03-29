import React, { useCallback, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';
import useAuth from '../../hooks/useAuth';
import { Context } from '../../authStore';

function Header() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = useCallback(
    event => {
      event.preventDefault();
      logout().then(() => {
        dispatch(push('/login'));
      });
    },
    [logout],
  );

  return (
    <div>
      <A href="https://www.reactboilerplate.com/">
        <Img src={Banner} alt="react-boilerplate - Logo" />
      </A>
      <NavBar>
        <HeaderLink to="/">
          <FormattedMessage {...messages.home} />
        </HeaderLink>

        {Boolean(user) && (
          <>
            <HeaderLink to="/features">
              <FormattedMessage {...messages.features} />
            </HeaderLink>
            <HeaderLink to="/about">
              <FormattedMessage {...messages.about} />
            </HeaderLink>
          </>
        )}

        {!user && (
          <HeaderLink to="/login">
            <FormattedMessage {...messages.login} />
          </HeaderLink>
        )}
        {Boolean(user) && (
          <HeaderLink to="/logout" onClick={handleLogout}>
            <FormattedMessage {...messages.logout} />
          </HeaderLink>
        )}
      </NavBar>
    </div>
  );
}

export default Header;
