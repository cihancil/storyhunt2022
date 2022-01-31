import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, StatusBar, YellowBox } from 'react-native';
import codePush from "react-native-code-push";

import AppContainer from './src/AppContainer'
import * as fire from './src/fire'

YellowBox.ignoreWarnings([
  `Require cycle: node_modules/react-native-gesture-handler`
])

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

@codePush
export default class App extends Component {
  render() {
    return <View
      style={{
        flex: 1,
      }}>
      <StatusBar
        backgroundColor={'black'}
        barStyle='default'
      />
      <AppContainer
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getActiveRouteName(currentState);
          const prevScreen = getActiveRouteName(prevState);

          if (prevScreen !== currentScreen) {
            // the line below uses the Google Analytics tracker
            // change the tracker here to use other Mobile analytics SDK.
            // tracker.trackScreenView(currentScreen);
            // console.warn(currentScreen)
            fire.trackScreen(currentScreen)
          }
        }}
      />
    </View >
  }
}