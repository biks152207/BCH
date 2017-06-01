import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StyleProvider } from 'native-base';
import { ActivityIndicator } from 'react-native';
import App from './App';
import configureStore from './configureStore';
import getTheme from '../native-base-theme/components';
import variables from '../native-base-theme/variables/commonColor';

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      store: configureStore(() => this.setState({ isLoading: false })),
      isReady: false,
    };
  }
  async componentWillMount() {
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      return <ActivityIndicator />;
    }
    return (
      <StyleProvider style={getTheme(variables)}>
        <Provider store={this.state.store}>
          <App />
        </Provider>
      </StyleProvider>
    );
  }
  }
