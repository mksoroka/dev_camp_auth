import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';
import useApi from '../../hooks/useApi';
import useRequireAuth from '../../hooks/useRequireAuth';

export default function AboutPage() {
  useRequireAuth();
  const [about, setAbout] = useState('');
  const { callApi } = useApi();

  useEffect(() => {
    callApi('http://localhost:3001/v1/about').then(result => {
      if (result) {
        setAbout(result);
      }
    });
  }, [callApi]);

  return (
    <div>
      <Helmet>
        <title>About Page</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      {about && <div>{about}</div>}
    </div>
  );
}
