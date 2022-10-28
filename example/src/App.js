import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import AdminRouter from './router/index';

class App extends Component {
  render() {
    return (
      <Switch>
        <AdminRouter />
      </Switch>
    );
  }
}

export default App;
