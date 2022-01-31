import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class BackButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.icon}
        {...this.props}
      >
        <MaterialIcons size={22} name="arrow-back" color="white" />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 48,
    width: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
