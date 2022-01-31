import React from 'react'
import {
  View, ScrollView, Button, TextInput, Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { observer } from 'mobx-react/native'
import Modal from "react-native-modal"
import LinearGradient from 'react-native-linear-gradient'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import MainState from '../MainState'
import * as Config from '../Config'
import * as Utils from '../apputils'
import LoginState from '../LoginState'
import * as fire from '../fire'

const trayItemWidth = 84

@observer
export default class FollowList extends React.Component {
  componentDidMount = () => {
  }
  componentDidCatch = () => {
    // firebase.crashlytics().log('FollowListCatch')
  }
  state = {
    refreshing: false,
  }

  onRefresh = async () => {
    this.setState({ refreshing: true }, async () => {
      await LoginState.fetchFollowedStories()
      this.setState({ refreshing: false })
    })
  }

  renderContent = () => {
    if (LoginState.isLoggedIn) {
      const bannerPadding = Config.adsEnabled() ? 100 : 0
      return (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 8,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: bannerPadding,
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: 'black',
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.renderListItems()}
        </ScrollView>
      )
    } else {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16, }}>
          <Text style={{
            fontFamily: Config.fontName, fontWeight: "bold", textAlign: "center",
            fontSize: 16, lineHeight: 26, marginBottom: 16,
            color: "white",
          }}>
            By signing in with Instagram you will be able to anonymously view stories of your users on your list
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("InstagramLogin")
            }}
            style={{
              flexDirection: "row", alignItems: "center",
              borderRadius: 8, borderWidth: 1, borderColor: "white", padding: 4,
            }}
          >
            <IconMaterialCommunityIcons color="white" name="instagram" size={27} />
            <Text style={{
              fontFamily: Config.fontName, fontWeight: "bold", textAlign: "center",
              fontSize: 16, color: "white", marginLeft: 8,
            }}>Sign in with Instagram</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
      </View>
    )
  }

  renderListItems = () => {
    if (!LoginState.initialized) return null

    if (LoginState._trayFetching && !this.state.refreshing) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator />
        </View>
      )
    }
    if (LoginState.trayUsers.length === 0) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text
            style={{
              fontSize: 16, fontFamily: Config.fontName, fontWeight: 'bold', textAlign: 'center',
            }}
          >There are no stories available</Text>
        </View >
      )
    }
    // console.log('LOGINSTATETRAY', LoginState.trayUsers)
    // firebase.crashlytics().log('render_tray_users ' + LoginState.trayUsers.length)
    // fetch('https://us-central1-storystalker-89bdb.cloudfunctions.net/traySuccess', {
    //   method: "POST",
    //   body: JSON.stringify({ trayUsers: LoginState.trayUsers })
    // })
    return LoginState.trayUsers.map((user, index) => {
      // fetch('https://us-central1-storystalker-89bdb.cloudfunctions.net/traySuccess', {
      //   method: "POST",
      //   body: JSON.stringify({ user: user })
      // })
      // firebase.crashlytics().log('tray_user_index ' + JSON.stringify(index))
      // firebase.crashlytics().log('tray_user ' + JSON.stringify(user))
      if (!user) {
        fire.trackEvent("tray_user_null")
        // firebase.crashlytics().log('tray_user_null ')
        return null
      }
      return (
        <TouchableOpacity
          key={'mylist' + user.pk}
          style={{
            marginVertical: 8,
            marginHorizontal: 8,
            alignItems: "center",
            width: trayItemWidth,
          }}
          onPress={() => {
            this.props.navigation.navigate("Stories", {
              users: LoginState.trayUsers, initialIndex: index
            })
          }}
        >
          <LinearGradient
            colors={['red', 'blue']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: trayItemWidth,
              width: trayItemWidth,
              borderRadius: trayItemWidth / 2,
            }}
          />
          <Image
            source={{ uri: Utils.getAvatar(user.profile_pic_url) }}
            style={{
              backgroundColor: '#222',
              marginTop: 6,
              marginBottom: 8,
              height: trayItemWidth - 12,
              width: trayItemWidth - 12,
              borderRadius: (trayItemWidth - 12) / 2,
            }}
          />
          <Text
            numberOfLines={1}
            style={{ fontFamily: Config.fontName, fontWeight: "bold", color: "#888", fontSize: 12, }}
          >{Utils.getUsername(user.username)}</Text>
        </TouchableOpacity>
      )
    })
  }

  // renderItem = (user, onPress) => {
  //   if (!user) return null
  //   const { pk, username, full_name, profile_pic_url, has_anonymous_profile_picture } = user
  //   return (
  //     <TouchableOpacity
  //       key={'search' + pk}
  //       style={{
  //         flexDirection: 'row',
  //         padding: 8,
  //         alignItems: 'center',
  //       }}
  //       onPress={onPress}
  //     >
  //       <Image
  //         source={{ uri: Utils.getAvatar(profile_pic_url) }}
  //         style={{
  //           backgroundColor: '#EEE',
  //           width: 52,
  //           height: 52,
  //           borderRadius: 26,
  //           marginRight: 8,
  //         }}
  //       />
  //       <View>
  //         <Text numberOfLines={1} style={{ fontFamily: Config.fontName, fontWeight: 'bold' }}>
  //           {Utils.getUsername(username)}
  //         </Text>
  //         <Text numberOfLines={1} style={{ fontFamily: Config.fontName, }}>
  //           {Utils.getFullname(full_name)}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   )
  // }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})