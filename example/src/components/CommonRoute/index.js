import React from 'react';
import { Route } from 'react-router-dom';

const CommonRoute = ({ component: Component, path, ...rest }) => (
  <Route path={path} render={props => <Component {...props} {...rest} />} />
);

export default CommonRoute;
