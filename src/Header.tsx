import React from 'react';
import { View, StyleSheet, Text, Platform, } from 'react-native';

import * as Config from './Config'

export default class Header extends React.Component<{
  title?: string,
  leftIcon?: JSX.Element,
  rightIcon?: JSX.Element,
  centerView?: JSX.Element,
  style?: object,
}> {
  render() {
    const { title, leftIcon, rightIcon, centerView, style } = this.props;
    return (
      <View style={[{
        height: 48, flexDirection: 'row', alignItems: 'center',
        borderBottomColor: '#eee',
        borderBottomWidth: Platform.select({ ios: StyleSheet.hairlineWidth, android: StyleSheet.hairlineWidth }),
      }, style]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: Config.fontName, color: 'white' }}>
            {title === null ? '' : title}
          </Text>
        </View>
        <View style={[StyleSheet.absoluteFill, { flexDirection: 'row', }]}>
          <View>
            {leftIcon}
          </View>
          <View style={{ flex: 1 }}>
            {centerView}
          </View>
          <View>
            {rightIcon}
          </View>
        </View>
      </View>
    );
  }
}