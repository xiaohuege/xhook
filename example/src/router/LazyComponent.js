import React from 'react';
import Loadable from 'react-loadable';

class LoadingPage extends React.Component {
  render() {
    return <div />;
  }
}

const LazyComponent = component => Loadable({
  loader: component,
  loading: () => <LoadingPage />,
});

export default LazyComponent;
