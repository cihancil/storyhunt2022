import React, { Fragment } from 'react'
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  StyleSheet,
} from 'react-native'
import { observer } from 'mobx-react/native'

import MainState from './MainState';
import * as Config from './Config'

@observer
export default class NativeAdsView extends React.Component {
  constructor(props) {
    super(props)

  }

  state = {
    loaded: false,
  }

  render() {
    const show = Math.abs(this.props.index - MainState.activeStoryTab) < 3

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {
          this.state.loaded &&
          <TouchableOpacity
            style={styles.touchable}
            onPress={this.props.onSkip}
          >
            <Text style={styles.buttonText}
            >Skip Ad</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  touchable: {
    padding: 16,
    position: 'absolute',
    bottom: 52,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Config.fontName,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
})