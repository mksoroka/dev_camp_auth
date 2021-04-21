import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';
import useAuth from '../../hooks/useAuth';

export default function ChatPage2() {
  const { user } = useAuth();
  const userName = useMemo(
    () => (user ? user.name : `user #${new Date().getTime()}`),
    [user],
  );
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  let isClose = false;

  useEffect(() => {
    fetch('http://localhost:3001/v1/messages', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        setChatMessages(response.results);
      });
  }, []);

  const subscribe = useCallback(() => {
    if (!isClose) {
      fetch(`http://localhost:3001/v1/messages/subscribe`).then(response => {
        if (response.status === 502) {
          subscribe();
        } else if (response.status !== 200) {
          new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            subscribe();
          });
        } else {
          response.text().then(message => {
            setChatMessages(m => [JSON.parse(message), ...m.slice(0, 9)]);
            subscribe();
          });
        }
      });
    }
  }, [chatMessages]);

  useEffect(() => {
    subscribe();
    return () => {
      isClose = true;
    };
  }, []);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();
      if (newMessage) {
        fetch('http://localhost:3001/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: newMessage,
            author: userName,
          }),
        }).then(() => {
          setNewMessage('');
        });
      }
    },
    [newMessage],
  );

  const handleInput = useCallback(event => {
    setNewMessage(event.target.value);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Chat Page. v2</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <div>
        Hi <b>{userName}!</b>
      </div>
      <br />
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleInput} value={newMessage} />
          <button type="submit">Send</button>
        </form>
      </div>
      <div>
        {chatMessages.map(({ author, id, message }) => (
          <div key={id}>
            <b>{author}</b>: {message}
          </div>
        ))}
      </div>
    </div>
  );
}
