import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Platform } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import MainState from './MainState'
import * as Config from './Config'
import { getPhoto, getUsername } from './apputils'
import Api from './Api'
import { IUserDetailed, IUser } from './interfaces'

interface Props {
  navigation: any,
}

export default class PhotoScreen extends Component<Props, {
  image?: string,
}> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.init()
  }
  componentWillUnmount() {
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
  init = async () => {
    try {
      const userBasic: IUser = this.props.navigation.getParam('user', null)
      const user: IUserDetailed = await Api.getUserDetail(userBasic.pk)
      // console.log('user:', user)
      let image
      if (user.hd_profile_pic_versions && user.hd_profile_pic_versions.length > 0) {
        image = user.hd_profile_pic_versions[user.hd_profile_pic_versions.length - 1].url
      } else if (user.hd_profile_pic_url_info) {
        image = user.hd_profile_pic_url_info.url
      }
      this.setState({ image })

      if (Config.adsEnabled()) {
      }
    } catch (error) {

    }
  }
  render() {
    const { image } = this.state
    const userBasic: IUser = this.props.navigation.getParam('user', null)
    return (
      <View
        style={styles.container}>
        {
          !image &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <ActivityIndicator color="white" />
          </View>
        }
        {
          image &&
          <ImageViewer
            renderIndicator={() => <View />}
            imageUrls={[{ url: getPhoto(image) }]}
          />
        }
        {this.renderClose()}
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


  // renderDownload = () => {
  //   if (this.state.downloading) {
  //     return (
  //       <View
  //         style={{
  //           position: 'absolute',
  //           top: ifIphoneX(32, Platform.select({ android: 4, ios: 22 })),
  //           right: 52,
  //           padding: 16,
  //           margin: 8,
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <ActivityIndicator color="white" />
  //       </View>
  //     )
  //   }
  //   return (
  //     <TouchableOpacity
  //       onPress={this.handleDownload}
  //       style={{
  //         position: 'absolute',
  //         top: ifIphoneX(32, Platform.select({ android: 4, ios: 22 })),
  //         right: 52,
  //         padding: 16,
  //       }}
  //     >
  //       {
  //         Platform.select({
  //           ios: <IconIonIcons size={28} name="ios-download" color="white" />,
  //           android: <IconMaterialCommunityIcons size={30} name="cloud-download" color="white" />,
  //         })
  //       }

  //     </TouchableOpacity >
  //   )
  // }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})