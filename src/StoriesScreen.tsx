import React, { Fragment } from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native'
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view'
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import IconIonIcons from 'react-native-vector-icons/Ionicons'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Toast from 'react-native-tiny-toast'

import * as Config from './Config'
import StoryView from './StoryView'
import MainState from './MainState'
import * as fire from './fire'
import * as utils from './apputils'

export default class StoriesScreen extends React.Component {
  constructor(props) {
    super(props)
    const { navigation, route } = this.props
    const params = route.params
    this.usersRaw = params.users
    this.users = []
    this.usersRaw.forEach((raw, index) => {
      if (index % Config.storiesBetweenAdGap === 1) {
        if (Config.adsEnabled()) {
          this.users.push({
            type: 'ad',
            pk: `ad${index}`,
          })
        }
      }
      this.users.push(raw)
    })
    const initialIndexRaw = params.initialIndex
    let howManyAds = 0
    if (Config.adsEnabled()) {
      if (initialIndexRaw > 0) {
        if (initialIndexRaw == 1) {
          howManyAds = 1
        } else {
          howManyAds = Math.floor((initialIndexRaw - 1) / (Config.storiesBetweenAdGap)) + 1
        }
      }
    }
    this.initialIndex = initialIndexRaw + howManyAds
    this.storiesContainerIndex = this.initialIndex || 0
    MainState.activeStoryTab = this.initialIndex
    this.state = {
      loading: true,
      downloading: false,
    }
    this.storiesRefs = {}

  }

  componentDidMount = async () => {
    fire.trackEvent("story_view")
    if (Config.adsEnabled()) {
    }
  }

  componentWillUnmount = () => {
    fire.trackEvent("story_close")
    if (this && this._advert && this._advert.isLoaded()) {
      MainState.setAdIsComing(true)
      this._advert.on('onAdClosed', () => {
        MainState.setAdIsComing(false)
      })
      this._advert.on('onAdLeftApplication', () => {
        MainState.setAdIsComing(false)
      })
      setTimeout(() => {
        this._advert.show()
      }, 10)
    }
  }

  handleBack = () => {
    const { storiesContainerIndex } = this
    if (storiesContainerIndex > 0) {
      this.refs.storiesContainer.goToPage(storiesContainerIndex - 1)
    }
  }

  handleForward = () => {
    const { storiesContainerIndex } = this
    if (storiesContainerIndex < (this.users.length - 1)) {
      this.refs.storiesContainer.goToPage(storiesContainerIndex + 1)
    }
  }

  handleDownload = async () => {
    const videoUrl = this.storiesRefs["storyRef" + this.storiesContainerIndex].videoUrl
    const downloadUrl = this.storiesRefs["storyRef" + this.storiesContainerIndex].downloadUrl
    if (videoUrl || downloadUrl) {
      this.setState({ downloading: true }, async () => {
        let downloadStatus
        if (videoUrl) {
          downloadStatus = await utils.downloadVideo(videoUrl)
        } else {
          downloadStatus = await utils.downloadImage(downloadUrl)
        }
        this.setState({ downloading: false })
        if (downloadStatus) {
          Toast.showSuccess('Story downloaded')
        }
      })
    }
  }

  render() {
    const { storiesContainerIndex } = this
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          paddingTop: ifIphoneX(32, Platform.select({ android: 0, ios: 20 })),
        }}
      >
        <PagerView
          scrollEnabled
          style={{ flex: 1 }}
          ref="storiesContainer"
          offscreenPageLimit={1}
          initialPage={storiesContainerIndex}
          onPageSelected={(e: PagerViewOnPageSelectedEvent) => {
            // const i = e.;
            // this.storiesContainerIndex = i
            // MainState.activeStoryTab = i
          }}
        >
          {this.users.map((user, index) => {
            return <StoryView
              key={'storyview' + user.pk}
              ref={r => this.storiesRefs["storyRef" + JSON.stringify(index)] = r}
              isAd={user.type === "ad"}
              active={storiesContainerIndex === index}
              index={index}
              user={user}
              onBack={this.handleBack}
              onForward={this.handleForward}
              navigation={this.props.navigation}
            />
          })}
        </PagerView>
        {this.renderClose()}
        {this.renderDownload()}
      </View>
    )
  }

  renderClose = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.pop()
        }}
        style={{
          position: 'absolute',
          top: ifIphoneX(32, Platform.select({ android: 4, ios: 22 })),
          right: 0,
          padding: 16,
        }}
      >
        <IconMaterialCommunityIcons size={30} name="close" color="white" />
      </TouchableOpacity>
    )
  }

  renderDownload = () => {
    return null
    // try {
    //   const storyRef = this.storiesRefs["storyRef" + this.storiesContainerIndex]
    //   const downloadable = storyRef.videoUrl || storyRef.downloadUrl
    //   console.warn(storyRef.videoUrl, storyRef.downloadUrl)
    //   if (!downloadable) return null
    // } catch (err) {
    //   return null
    // }

    // if (this.state.loading) {
    //   return null
    // }

    if (this.state.downloading) {
      return (
        <View
          style={{
            position: 'absolute',
            top: ifIphoneX(32, Platform.select({ android: 4, ios: 22 })),
            right: 52,
            padding: 16,
            margin: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color="white" />
        </View>
      )
    }
    return (
      <TouchableOpacity
        onPress={this.handleDownload}
        style={{
          position: 'absolute',
          top: ifIphoneX(32, Platform.select({ android: 4, ios: 22 })),
          right: 52,
          padding: 16,
        }}
      >
        {
          Platform.select({
            ios: <IconIonIcons size={28} name="ios-download" color="white" />,
            android: <IconMaterialCommunityIcons size={30} name="cloud-download" color="white" />,
          })
        }

      </TouchableOpacity >
    )
  }
}
