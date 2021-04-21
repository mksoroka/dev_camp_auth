import React, { useCallback } from 'react';
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
      <A href="/">
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

        <HeaderLink to="/chat">
          <FormattedMessage {...messages.chat} />
        </HeaderLink>
        <HeaderLink to="/chat1">
          <FormattedMessage {...messages.chat1} />
        </HeaderLink>
        <HeaderLink to="/chat2">
          <FormattedMessage {...messages.chat2} />
        </HeaderLink>
        <HeaderLink to="/chat3">
          <FormattedMessage {...messages.chat3} />
        </HeaderLink>
        <HeaderLink to="/chat4">
          <FormattedMessage {...messages.chat4} />
        </HeaderLink>
      </NavBar>
    </div>
  );
}

export default Header;
