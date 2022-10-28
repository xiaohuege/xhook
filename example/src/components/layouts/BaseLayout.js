import React from 'react';
import ContentMain from '../ContentMain';


class BaseLayout extends React.Component {
  render() {
    const { router } = this.props;
    return (
      <ContentMain router={router} />
    );
  }
}
export default BaseLayout;
