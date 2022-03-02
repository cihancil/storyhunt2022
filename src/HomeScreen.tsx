import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert, ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { observer } from 'mobx-react/native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const Tab = createMaterialTopTabNavigator();

import StalkList from './home/StalkList'
import MainState from './MainState'
import LoginState from './LoginState'
import Header from './Header'
import * as Config from './Config'
import FollowList from './home/FollowList';
// import * as fire from './fire'
import * as utils from './apputils'

@observer
export default class HomeScreen extends React.Component {
  componentDidMount = async () => {
    // await InAppState.initialize()
  }

  componentWillUnmount() {
    // InAppState.clear()
  }

  _tabview: any

  renderTabs = ({ navigation, index }: { navigation: any, index: number }): JSX.Element => {
    const tabWidth = 108
    return (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 48,
      }}>
        <TouchableOpacity
          style={{ padding: 12, height: 48, width: tabWidth, alignItems: 'center', justifyContent: 'center', }}
          onPress={() => { navigation.navigate({ name: 'StalkList' }) }}
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
          onPress={() => { navigation.navigate({ name: 'FollowList' }) }}
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
              left: (index === 0) ? 0 : tabWidth,
              backgroundColor: "white",
              height: 4,
              width: tabWidth,
            }} />
          </View>
        </View>
      </View>
    )
  }

  renderLeftIcon = (): JSX.Element => <View style={{ height: 48, width: 64 }} />

  renderRightIcon = ({ navigation, index }: { navigation: any, index: number }): JSX.Element => {
    if (index === 0) {
      return (
        <TouchableOpacity
          style={{ padding: 16, height: 48, width: 64, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            navigation.push('Search')
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
          <IconMaterialCommunityIcons color="white" name="logout" size={18} />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{ width: 64 }} />
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Tab.Navigator
          tabBar={({ navigation, state }) => <Header
            rightIcon={this.renderRightIcon({ navigation, index: state.index })}
            leftIcon={this.renderLeftIcon()}
            centerView={this.renderTabs({ navigation, index: state.index })}
          />}
        >
          <Tab.Screen name="StalkList" component={StalkList} />
          <Tab.Screen name="FollowList" component={FollowList} />
        </Tab.Navigator>
        {
          Config.adsEnabled() &&
          <View style={styles.bannerContainer}>
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
          <View style={styles.adSpinner}>
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
  adSpinner: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'black',
    opacity: 0.6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    position: "absolute",
    bottom: ifIphoneX(30, 0),
    right: 0, left: 0,
    alignItems: "center",
  },
})