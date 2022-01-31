import React from 'react'
import {
  View, ScrollView, Button, TextInput, Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  Keyboard,
  Alert,
} from 'react-native'
import { observer } from 'mobx-react/native'
import WebView from 'react-native-webview'

import CookieManager from 'react-native-cookies';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Header from './Header'
import LoginState from './LoginState';
import * as fire from './fire'

@observer
export default class InstagramLoginScreen extends React.Component {
  componentWillUnmount() {
    if (!LoginState.isLoggedIn && (Platform.OS === "ios")) {
      CookieManager.clearAll()
    }
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove()
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove()
    }
    setTimeout(() => {
      if (!LoginState.isLoggedIn) {
        fire.trackEvent("login_cancel")
      }
    }, 500);
  }
  componentDidMount() {
    if (Platform.OS === "android") {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      )
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      )
    }
    fire.trackEvent("login_form")
  }
  _keyboardDidShow = () => {
    this.setState({ keyboard: true })
  }

  _keyboardDidHide = () => {
    this.setState({ keyboard: false })
  }

  state = {
    token: "not",
    fakeUsername: "",
    fakePassword: "",
  }

  renderFakeLogin = () => {
    return (
      <View>
        <TextInput
          autoCorrect={false}
          autoCapitalize={"none"}
          placeholder="Username"
          value={this.state.fakeUsername}
          onChangeText={text => this.setState({ fakeUsername: text })}
          style={{
            margin: 16, padding: 8, height: 42,
            borderWidth: StyleSheet.hairlineWidth, borderColor: "gray", borderRadius: 4,
          }}
        />
        <TextInput
          autoCorrect={false}
          autoCapitalize={"none"}
          placeholder="Password"
          secureTextEntry={true}
          returnKeyType="done"
          value={this.state.fakePassword}
          onChangeText={text => this.setState({ fakePassword: text })}
          style={{
            margin: 16, padding: 6, height: 42,
            borderWidth: StyleSheet.hairlineWidth, borderColor: "gray", borderRadius: 4,
          }}
          onSubmitEditing={this.fakeSignIn}
        />
        <Button
          title={"Sign In"}
          onPress={this.fakeSignIn}
        />
      </View>
    )
  }

  fakeSignIn = () => {
    console.warn(this.state.fakeUsername, this.state.fakePassword)
    if ((this.state.fakeUsername === "vrltech" && this.state.fakePassword === "qwertypoi")) {
      LoginState.fakeSignIn()
      this.props.navigation.pop()
    } else {
      Alert.alert("Wrong username or password")
      this.setState({
        fakePassword: "",
        fakeUsername: "",
      })
    }
  }

  renderWebView = () => {
    if (LoginState.iosReviewMode) {
      return this.renderFakeLogin()
    }
    return (
      <WebView
        ref={ref => this.wbv = ref}
        // useWebKit={false}
        style={{
        }}
        scalesPageToFit={true}
        source={{ uri: 'https://www.instagram.com/accounts/login/' }}
        onNavigationStateChange={async (state) => {
          // console.log(state.url)

          let cookieRes
          if (Platform.OS === "ios") {
            cookieRes = await CookieManager.getAll()
          } else {
            cookieRes = await CookieManager.get('https://www.instagram.com')
          }

          console.log('CookieManager.getAll from webkit-view =>', cookieRes);
          const { ds_user_id, sessionid } = cookieRes
          if (ds_user_id && sessionid) {
            const id = Platform.select({
              ios: ds_user_id.value,
              android: ds_user_id,
            })
            const token = Platform.select({
              ios: sessionid.value,
              android: sessionid,
            })

            // console.log('CookieManager setting', id, token);
            LoginState.setCookies({ id, token })
            this.props.navigation.pop()
            fire.trackEvent("login_success")
          }
        }}
      />
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
        paddingTop: ifIphoneX(42, Platform.select({ android: 0, ios: 20 })),
        marginBottom: Platform.select({
          ios: 0,
          android: this.state.keyboard ? 200 : 0,
        })
      }}>
        <Header
          title="Sign In with Instagram"
          rightIcon={<TouchableOpacity
            onPress={() => {
              this.props.navigation.pop()
            }}
            style={{
              position: 'absolute',
              alignItems: "center",
              justifyContent: "center",
              top: 0,
              right: 0,
              padding: 10,
            }}
          >
            <IconMaterialCommunityIcons size={24} name="close" color="black" />
          </TouchableOpacity>}
        />
        {this.renderWebView()}
      </View>
    )
  }
}