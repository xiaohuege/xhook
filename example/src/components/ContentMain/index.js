import React from 'react';
import { Switch } from 'react-router-dom';
import CommonRoute from '../CommonRoute';

class ContentMain extends React.Component {
  render() {
    const { router } = this.props;
    return (
      <div>
        <Switch>
          {router.map((item, index) => (
            <CommonRoute key={index} exact={item.exact} path={item.path} component={item.component} />
          ))}
        </Switch>
      </div>
    );
  }
}

export default ContentMain;
