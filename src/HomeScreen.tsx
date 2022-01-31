import React from 'react'
import {
  View, ScrollView, Button, TextInput, Text,
  Image,
  TouchableOpacity,
  Dimensions, Platform,
  Alert, ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { observer } from 'mobx-react/native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import analytics from '@react-native-firebase/analytics'

import StalkList from './home/StalkList'
import MainState from './MainState'
import LoginState from './LoginState'
import Header from './Header'
import * as Config from './Config'
import FollowList from './home/FollowList';
import * as fire from './fire'
import * as utils from './apputils'

analytics().setAnalyticsCollectionEnabled(!__DEV__)

@observer
export default class HomeScreen extends React.Component {
  componentDidMount = async () => {
    // await InAppState.initialize()
  }

  componentWillUnmount() {
    // InAppState.clear()
  }

  state = {
    tabIndex: 0,
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.tabIndex !== prevState.tabIndex) {
  //     console.warn(this.state.tabIndex ? 'HomeStalk' : 'HomeFollow')
  //   }
  // }

  renderTabs = () => {
    const tabWidth = 108
    return (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 48,
      }}>
        <TouchableOpacity
          style={{
            padding: 12, height: 48, width: tabWidth, alignItems: 'center', justifyContent: 'center',
          }}
          onPress={() => {
            this._tabview.goToPage(0)
          }}
        >
          <Text style={{
            color: 'white', fontFamily: Config.fontName,
            fontWeight: 'bold',
            padding: 4,
          }}>{
              Platform.select({
                ios: "My List",
                android: "Stalk List",
              })
            }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 16, height: 48, width: tabWidth, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            this._tabview.goToPage(1)
          }}
        >
          <Text style={{
            color: 'white', fontFamily: Config.fontName,
            fontWeight: 'bold'
          }}>Follow List</Text>
        </TouchableOpacity>
        <View style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          alignItems: "center",
        }}>
          <View style={{
            width: 2 * tabWidth,
          }}>
            <View style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              left: (this.state.tabIndex === 0) ? 0 : tabWidth,
              backgroundColor: "white",
              height: 4,
              width: tabWidth,
            }} />
          </View>
        </View>
      </View>
    )
  }

  renderLeftIcon = () => {
    // const inappStateReady = InAppState.initialized
    // console.log('cioo inappStateReady:', inappStateReady)
    // if (!inappStateReady) {
    //   return <View style={{ width: 64 }} />
    // }
    // if (InAppState.noAdsEnabled) {
    //   return <View style={{ width: 64 }} />
    // }
    return (
      <View style={{ height: 48, width: 64 }} />
    )
    // return (
    //   <TouchableOpacity
    //     style={{ padding: 16, height: 48, width: 64, alignItems: 'center', justifyContent: 'center' }}
    //     onPress={() => {
    //       this.props.navigation.push('InApp')
    //     }}
    //   >
    //     <Image
    //       resizeMode='contain'
    //       style={{ width: 32, height: 32 }}
    //       source={require('../assets/noads.png')}
    //     />
    //   </TouchableOpacity>
    // )
  }

  renderRightIcon = () => {
    if (this.state.tabIndex === 0) {
      return (
        <TouchableOpacity
          style={{ padding: 16, height: 48, width: 64, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            fire.trackScreen("search_icon_press")
            this.props.navigation.push('Search')
          }}
        >
          <Text style={{
            color: 'white', fontFamily: Config.fontName,
            fontWeight: 'bold'
          }}>Add</Text>
        </TouchableOpacity>
      )
    } else if (LoginState.isLoggedIn) {
      return (
        <TouchableOpacity
          style={{ padding: 16, height: 48, width: 64, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Sign out', onPress: () => LoginState.logout() },
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
              { cancelable: true },
            );

          }}
        >
          <IconMaterialCommunityIcons color="black" name="logout" size={18} />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{ width: 64 }} />
      )
    }
  }

  render() {
    // const inappStateReady = InAppState.initialized

    const isLoggedIn = LoginState.isLoggedIn
    return (
      <View style={styles.container}>
        <ScrollableTabView
          ref={r => { this._tabview = r }}
          onChangeTab={({ i }) => {
            this.setState({ tabIndex: i })
          }}
          renderTabBar={() => {
            return (
              <Header
                rightIcon={this.renderRightIcon()}
                leftIcon={this.renderLeftIcon()}
                centerView={this.renderTabs()}
              />
            )
          }}
          prerenderingSiblingsNumber={2}
        >
          <StalkList navigation={this.props.navigation} tabLabel="Stalk List" />
          <FollowList navigation={this.props.navigation} tabLabel="Follow List" />
        </ScrollableTabView>
        {
          Config.adsEnabled() &&
          <View
            style={{
              position: "absolute",
              bottom: ifIphoneX(30, 0),
              right: 0, left: 0,
              alignItems: "center",
            }}
          >
            {/* <Banner
              unitId={bannerAdUnitFooter}
              size={"LARGE_BANNER"}
              request={requestFooter.build()}
              onAdLoaded={() => {
              }}
              onAdFailedToLoad={() => {
              }}
            /> */}
          </View>
        }
        {MainState.adIsComing &&
          <View style={{
            position: 'absolute',
            top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: 'black',
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ActivityIndicator color='white' size='large' />
          </View>
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ifIphoneX(46, Platform.select({ android: 0, ios: 20 })),
    paddingBottom: ifIphoneX(30, 0),
    backgroundColor: 'black',
  },
})