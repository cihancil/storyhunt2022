import React, { Fragment } from 'react'
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from 'react-native'
import Video from 'react-native-video'
import { observer } from 'mobx-react/native'
import MainState from './MainState';

@observer
export default class StoryVideo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    const active = this.props.index == MainState.activeStoryTab
    return (
      <Video
        source={this.props.source}
        paused={!active}
        resizeMode="contain"
        ref={(ref) => {
          this.player = ref
        }}
        playWhenInactive={false}
        onEnd={this.props.onEnd}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }} />
    )
  }
}