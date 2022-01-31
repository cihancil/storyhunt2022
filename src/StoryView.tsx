import React, { Fragment } from 'react'
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-tiny-toast'
import moment from 'moment'

import StoryVideo from './StoryVideo'
import NativeAdsView from './NativeAdsView'
import * as Config from './Config'
import MainState from './MainState';
import LoginState from './LoginState';
import * as Utils from './apputils'
import * as fire from './fire'

export default class StoryView extends React.Component {
  constructor(props) {
    super(props)
    this.user = this.props.user
    this.storiesURL = `https://i.instagram.com/api/v1/feed/user/${this.user.pk}/story/`
    this.state = {
      loading: !props.isAd || true,
      stories: [],
      storyIndex: 0,
    }
  }


  componentDidCatch = () => {
    this.setState({ error: 'error' })
  }

  componentDidMount = async () => {
    const { isAd } = this.props
    if (isAd) return
    // uncomment for getting fake sessions
    // console.warn('cihancil fetch', LoginState.cookieRow)
    // console.warn('cihancil this.storiesURL:', this.storiesURL)
    const storiesResponse = await fetch(this.storiesURL, {
      method: 'GET',
      headers: {
        "user-agent": "Instagram 10.26.0 (iPhone9,3)",
        "cookie": LoginState.cookieRow,
        // "cookie": "sessionid=8723064199%3A68oBufaU68kNNR%3A25; dd_user_id=8723064199;"
      },
      credentials: "omit",
    })
    // console.log(storiesResponse)
    if (storiesResponse.status === 429) {
      fire.trackEvent("fail")
      Toast.show('Please try again later')
      await LoginState.getPublicKeys()
    }
    if (storiesResponse.status === 403) {
      if (LoginState.isLoggedIn) {
        await LoginState.logout()
        this.props.navigation.pop()
        this.props.navigation.navigate("InstagramLogin")
      } else {
        // const newCookie = await fire.getPublicCookie()
        // await LoginState.setPublicCookies(newCookie)
        await LoginState.logout()
        // this.props.navigation.pop()
        fire.trackEvent("fail")
        Toast.show('Please try again later')
        await LoginState.getPublicKeys()
      }
    }
    const storiesJson = await storiesResponse.json()
    // console.log(storiesJson)
    try {
      if (storiesJson.reel) {

        // console.warn(storiesJson.reel.id)
        // this.hebele = storiesJson.reel.id

        const stories = storiesJson.reel.items
        // console.log(stories)
        this.setState({ stories, loading: false })
      } else {
        // console.log('else', this.user)
        const res = await fetch(`https://www.instagram.com/web/search/topsearch/?context0blended&query=${encodeURIComponent(this.user.username)}`)
        const data = await res.json()
        const user = data.users[0].user
        const isPrivate = user.is_private
        // console.log('else ', user, isPrivate)
        if (isPrivate !== this.user.is_private) {
          // Change this user in store
          MainState.updateUserPrivateStatus(user)
        }
        if (isPrivate) {
          this.setState({ stories: [], loading: false, isPrivate })
        }
        this.setState({ stories: [], loading: false })
      }
    } catch (error) {
      this.setState({ stories: [], loading: false })
    }
  }

  handleForwardPress = () => {
    const { stories, storyIndex } = this.state
    if (storyIndex < stories.length - 1) {
      this.setState({ storyIndex: storyIndex + 1 })
    } else {
      this.props.onForward()
    }
  }

  render() {
    const { loading } = this.state
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator style={{ flex: 1 }} animating={loading} color='#EEE' />
        {this.renderStoryImage()}
        {this.renderStoryVideo()}
        {this.renderShadow()}
        {this.renderProfileIcon()}
        {this.renderSideButtons()}
        {this.renderIndexBar()}
      </View>
    )
  }

  renderStoryImage = () => {
    const { loading, stories, storyIndex, error, isPrivate } = this.state
    const { isAd } = this.props
    if (isAd) return (
      <View style={{
        position: 'absolute',
        top: 0, bottom: 0, right: 0, left: 0,
      }}>
        <NativeAdsView
          index={this.props.index}
          onSkip={this.handleForwardPress}
        />
      </View>
    )

    if (loading) return null
    if (error) return null
    if (isPrivate) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0, bottom: 0, right: 0, left: 0,
        }}>
          <Image
            color="white"
            resizeMode="contain"
            style={{
              width: 96,
              height: 96,
              marginVertical: 10
            }}
            source={require('../assets/private.png')}
          />
          <Text style={{
            color: 'white', fontFamily: Config.fontName,
            fontSize: 18,
          }}>PRIVATE USER</Text>
        </View>
      )
    }
    if (stories.length < 1) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0, bottom: 0, right: 0, left: 0,
        }}>
          <Image
            tintColor="white"
            resizeMode="contain"
            style={{
              width: 96,
              height: 96,
              marginVertical: 16
            }}
            source={require('../assets/empty.png')}
          />
          <Text style={{
            color: 'white', fontFamily: Config.fontName,
            fontSize: 18,
          }}>NOT FOUND</Text>
        </View>
      )
    }

    const item = stories[storyIndex]
    const imageVersions = item["image_versions2"]
    // console.log("imageVersions", imageVersions)
    const candidate = imageVersions.candidates[0]
    // console.log("candidate", candidate)

    const uri = candidate.url
    this.downloadUrl = uri
    this.videoUrl = null
    return (
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      }}>
        <Image
          resizeMode={Config.ssMode ? "cover" : "contain"}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
          source={{ uri: Utils.getStoryImage(uri) }}
        />
      </View>
    )
  }

  renderStoryVideo = () => {
    const { loading, stories, storyIndex, error } = this.state
    if (loading) return null
    if (error) return null
    if (Config.ssMode) return null
    if (stories.length <= 0) return null
    const item = stories[storyIndex]
    const hasVideo = item.media_type === 2 && item.video_versions && item.video_versions[0]
    if (!hasVideo) return null

    const videoUrl = item.video_versions[0].url
    this.videoUrl = videoUrl
    return (
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      }}>
        <StoryVideo
          index={this.props.index}
          source={{ uri: videoUrl }}
          onEnd={this.handleForwardPress}
        />
      </View>
    )
  }

  renderShadow = () => {
    return (
      <LinearGradient
        colors={['black', 'transparent']}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 72,
        }}
      />
    )
  }

  renderProfileIcon = () => {
    const { stories, storyIndex } = this.state
    let item, takenAt, relativeTime
    if (stories && stories[storyIndex]) {
      item = stories[storyIndex]
      takenAt = item.taken_at
      relativeTime = moment.unix(takenAt).fromNow()
    }
    return (
      <View style={{
        position: 'absolute',
        left: 0,
        top: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Image
          resizeMode="contain"
          style={{
            width: 32,
            height: 32,
            margin: 8,
            borderRadius: 16,
           
          }}
          source={{ uri: Utils.getAvatar(this.user.profile_pic_url) }}
        />
        <View
        style={{
          flexDirection: 'column',
          display: 'flex',
        }}
        >
        <Text style={{ fontFamily: Config.fontName, color: 'white' }}>{Utils.getUsername(this.user.username)}</Text>
        {relativeTime && <Text style={{ 
          fontSize: 12,
          fontFamily: Config.fontName, color: 'white' }}>{relativeTime}</Text>}
        </View>
      </View>
    )
  }

  renderSideButtons = () => {
    const { isAd } = this.props
    if (isAd) return null

    return (
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        flexDirection: 'row',
      }}>
        <TouchableOpacity
          onPress={async () => {
            const { storyIndex } = this.state
            if (storyIndex > 0) {
              this.setState({ storyIndex: storyIndex - 1 })
            } else {
              this.props.onBack()
            }
          }}
          style={{
            flex: 1
          }}
        />
        <TouchableOpacity
          onPress={this.handleForwardPress}
          style={{
            flex: 1
          }}
        />
      </View>
    )
  }

  renderIndexBar = () => {
    const { isAd } = this.props
    if (isAd) return null
    const { loading, stories, storyIndex } = this.state
    if (loading) return null
    const { length } = stories
    if (length > 1) {
      const tempArray = []
      for (let i = 0; i < length; i++) {
        tempArray.push(i)
      }
      return (
        <View
          style={{
            position: 'absolute',
            top: 5,
            right: 6,
            left: 6,
            flexDirection: 'row',
          }}
        >
          {tempArray.map((item, index) => {
            return (
              <View
                key={"storybar" + this.user.pk + index}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: 3,
                  marginHorizontal: 1,
                  backgroundColor: storyIndex === index ? 'white' : 'gray'
                }}
              />
            )
          })}
        </View>
      )
    } else {
      return null
    }
  }
}
