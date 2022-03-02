import React from 'react'
import {
  View, ScrollView, TextInput, Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { observer } from 'mobx-react/native'
import Modal from "react-native-modal"
import { ifIphoneX } from 'react-native-iphone-x-helper'

import MainState from '../MainState'
import LoginState from '../LoginState'
import MyListItem from '../MyListItem'
import * as Config from '../Config'
import * as fire from '../fire'
import { IUser } from '../interfaces'
import { Input, Button } from 'react-native-elements';

@observer
export default class StalkList extends React.Component<{
  navigation: any
}, {
  selectedUser: IUser | null,
  isModalVisible: Boolean,
  previousCode: string
}> {
  state = {
    isModalVisible: false,
    selectedUser: null,
    previousCode: '',
  }
  updatedAvatarPks: string[] = []
  render() {
    // const { searchKey } = this.state
    const bannerPadding = Config.adsEnabled() ? 100 : 0
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 8,
            paddingTop: 8,
            paddingBottom: ifIphoneX(86, Platform.select({ android: bannerPadding, ios: bannerPadding })),
          }}>
          {this.renderListItems()}
          {
            MainState.initialized &&
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Search')
              }} style={styles.addTextContainer}>
              <Text style={styles.addText} numberOfLines={1}>
                Add
              </Text>
            </TouchableOpacity>
          }
        </ScrollView>
        {this.renderDialog()}
      </View>
    )
  }

  renderListItems = () => {
    if (!MainState.initialized) return null
    if (!LoginState.initialized) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 30 }}>
          <ActivityIndicator />
        </View>
      )
    }
    if (MainState.users.length === 0) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text
            style={{
              fontSize: 16, fontFamily: Config.fontName, fontWeight: 'bold', textAlign: 'center',
              color: 'white',
            }}
          >
            {Platform.select({
              ios: 'Add new users to view their stories',
              android: 'Add new users to view their stories anonymously',
            })}
          </Text>
          <Text
            style={{
              fontSize: 16, fontFamily: Config.fontName, fontWeight: 'bold', textAlign: 'center',
              color: 'white',
              marginTop: 50
            }}
          >
            or
          </Text>
          <Text
            style={{
              fontSize: 16, fontFamily: Config.fontName, fontWeight: 'bold', textAlign: 'center',
              color: 'white',
            }}
          >
            use the code from previous app
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              maxWidth: '40%',
              marginTop: 16,
            }}
          >
            <Input
              autoCorrect={false}
              autoCapitalize={'none'}
              autoFocus={false}
              placeholder={''}
              keyboardType='web-search'
              style={styles.input}
              inputStyle={{
                color: 'white',
                width: 80,
              }}
              placeholderTextColor={'#aaa'}
              selectionColor={'white'}
              onChangeText={(text) => {
                this.setState({ previousCode: text })
              }}
              value={this.state.previousCode}
              onSubmitEditing={() => {
                this.props.navigation.navigate('Search', {
                  code: this.state.previousCode
                })
              }}
            />
            <Button
              title='GO'
              onPress={() => {
                this.props.navigation.navigate('Search', {
                  code: this.state.previousCode
                })
              }}
            />
          </View>
        </View >
      )
    }
    return MainState.users.map((user: IUser, index) => {
      return (
        <MyListItem
          key={'mylist' + user.pk}
          user={user}
          button="remove"
          onRemovePress={() => {
            this.setState({ selectedUser: user, isModalVisible: true })
          }}
          onProfileButtonPress={() => {
            // this.props.navigation.navigate("User", {
            //   user: MainState.users[index],
            // })
            this.props.navigation.navigate("Photo", {
              user: MainState.users[index],
            })
          }}
          onPress={() => {
            this.props.navigation.navigate("Stories", {
              users: MainState.users, initialIndex: index
            })
          }}
          onAvatarImageError={() => {
            setTimeout(() => {
              if (this.updatedAvatarPks.indexOf(user.pk) >= 0) {
                // alread tried to update
                return
              }
              this.updatedAvatarPks.push(user.pk)
              MainState.updateUserAvatar(user)
            }, Math.floor(Math.random() * 3000))
          }}
        />
      )
    })
  }

  renderDialog = () => {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        onBackdropPress={() => {
          this.setState({ isModalVisible: false, selectedUser: null })
        }}
      >
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          paddingVertical: 24, paddingHorizontal: 16,
          alignItems: 'center',
        }}>
          <Text
            style={{
              fontWeight: 'bold', fontFamily: Config.fontName,
              marginBottom: 8,
            }}
          >Remove from your list?</Text>
          {this.renderItem(this.state.selectedUser, () => {
            // this.setState({ isModalVisible: false, selectedUser: null })
          })}
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isModalVisible: false, selectedUser: null })
              }}
              style={{ paddingHorizontal: 28, paddingVertical: 8 }}>
              <Text style={{ fontWeight: 'bold', fontFamily: Config.fontName, color: 'gray', }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this.state.selectedUser) {
                  MainState.removeFromMyList(this.state.selectedUser)
                  this.setState({ isModalVisible: false, selectedUser: null })
                }
              }}
              style={{ paddingHorizontal: 28, paddingVertical: 8 }}>
              <Text style={{ fontWeight: 'bold', fontFamily: Config.fontName, color: 'red', }}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
    )
  }

  renderItem = (user: IUser | null, onPress: any) => {
    if (!user) return null
    const { pk, username, full_name, profile_pic_url, has_anonymous_profile_picture } = user
    return (
      <TouchableOpacity
        key={'search' + pk}
        style={{
          flexDirection: 'row',
          padding: 8,
          alignItems: 'center',
        }}
        onPress={onPress}
      >
        <Image
          source={{ uri: profile_pic_url }}
          style={styles.itemProfileImage}
        />
        <View>
          <Text numberOfLines={1} style={{ fontFamily: Config.fontName, fontWeight: 'bold' }}>
            {username}
          </Text>
          <Text numberOfLines={1} style={{ fontFamily: Config.fontName, }}>
            {full_name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  input: {
    height: 50,
    padding: 12,
    borderColor: 'gray', borderWidth: 1,
    borderRadius: 6,
    marginBottom: 4,
    color: 'white'
  },
  addTextContainer: {
    padding: 12,
    paddingHorizontal: 36,
    borderRadius: 6,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    alignSelf: 'center',
  },
  addText: {
    color: 'white', fontFamily: Config.fontName,
    fontSize: 14, fontWeight: 'bold',
  },
  itemProfileImage: {
    backgroundColor: '#EEE',
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 8,
  },
})