import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { homeRouter } from './homeRouter';
import CommonRoute from '../components/CommonRoute';
import BaseLayout from '../components/layouts/BaseLayout';

class AdminRouter extends Component {
  render() {
    return (
      <Switch>
        <CommonRoute path="/visiual/home/rx" component={BaseLayout} router={homeRouter} />
        <Redirect
          to={{
            pathname: '/visiual/home/rx',
            state: { from: this.props.location },
          }}
          from="*"
        />
      </Switch>
    );
  }
}

export default AdminRouter;
