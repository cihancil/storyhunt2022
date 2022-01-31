import React from 'react'
import {
  View, ScrollView, TextInput,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native'
import { observer } from 'mobx-react/native'
import _ from 'lodash'
import { Input } from 'react-native-elements';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import MainState from './MainState'
import Header from './Header'
import BackButton from './BackButton'
import * as Config from './Config'
import MyListItem from './MyListItem'
import * as fire from './fire'
import Api from './Api'
import { IUser } from './interfaces'


@observer
export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props)
    const initialValue = this.props.navigation.state.params
    this.state = {
      searchKey: initialValue || '',
      searchResults: [],
      searching: false,
      isModalVisible: false,
      selectedUser: null,
    }
  }
  searchApi = async (text) => {
    this.setState({ searching: true })
    let data
    let users
    if (/^\d+$/.test(text) && text.length === 6) {
      const res = await fetch('https://us-central1-story-stalker-1a4b7.cloudfunctions.net/getStalkList', {
        method: "POST",
        body: JSON.stringify({ digit: text })
      })
      const json = await res.json()
      data = {
        users: json.users.map(u => {
          return {
            user: u
          }
        })
      }
      users = data.users
    } else {
      const found = await Api.search(text)
      users = found.map(f => {
        return {
          user: f
        }
      })
      // console.warn('found users:', users)
    }
    fire.trackEvent("search_found")
    this.setState({ searchResults: users, searching: false })
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  render() {
    const { searchKey, searchResults } = this.state
    const { navigation } = this.props
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title='Add User'
          leftIcon={<BackButton
            onPress={() => navigation.pop()}
          />}
        />
        <View style={styles.inputContainer}>
          <Input
            autoCorrect={false}
            autoCapitalize={'none'}
            autoFocus={false}
            placeholder={'Search users'}
            keyboardType='web-search'
            style={styles.input}
            containerStyle={{
              flex: 1,
            }}
            inputStyle={{
              color: 'white'
            }}
            placeholderTextColor={'#aaa'}
            selectionColor={'white'}
            onChangeText={(text) => {
              this.setState({ searchKey: text })
            }}
            value={searchKey}
            rightIcon={this.renderClearInput()}
            onSubmitEditing={() => {
              this.searchApi(searchKey)
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.searchApi(searchKey)
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
            }}>
            <Text style={{
              color: "white",
              fontWeight: "bold",
            }}>Search</Text>
          </TouchableOpacity>
        </View>
        {this.renderSearchResults()}
        {this.renderAd()}
        {this.renderLoader()}
      </SafeAreaView>
    )
  }

  renderClearInput = () => {
    const { searchKey } = this.state
    if (searchKey.length > 0) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({ searchKey: "", searchResults: [] })
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
          }}>
          <IconMaterialIcons name="clear" color="black" size={20} />
        </TouchableOpacity>
      )
    }
  }

  // renderSync = () => {
  //   const { searchKey, searchResults, searching } = this.state
  //   if (searching || searchResults) {
  //     return null
  //   }
  //   return (
  //     <View>
  //       <Text>or</Text>
  //       <Text>Import from old app</Text>
  //     </View>
  //   )
  // }

  renderSearchResults = () => {
    const { searchKey, searchResults, searching } = this.state

    return (
      <ScrollView
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.scrollContent}
      >
        {
          searching &&
          <ActivityIndicator animating={true} style={{ marginTop: 16 }} color='white' />
        }
        {
          !searching && searchResults.map(searchResult => {
            return this.renderItem(searchResult.user)
          })
        }
      </ScrollView >
    )
  }

  renderItem = (user) => {
    if (!user) return null
    console.log(user)
    let isAdded = false
    MainState.users.forEach(myUser => {
      if (myUser.pk === user.pk) {
        isAdded = true
      }
    })
    console.log(user)
    return (
      <MyListItem
        key={'searchList' + user.pk}
        user={user}
        button={isAdded ? "remove" : "add"}
        autoSwitch={true}
        onRemovePress={() => {
          fire.trackEvent("search_removed", { count: MainState.users })
          MainState.removeFromMyList(user)
        }}
        onAddPress={() => {
          fire.trackEvent("search_added", { count: MainState.users })
          MainState.addUserToMyList(user)
        }}
        onProfileButtonPress={() => {
          // this.props.navigation.navigate("User", {
          //   user,
          // })
          this.props.navigation.navigate("Photo", {
            user,
          })
        }}
        onPress={() => {
          this.props.navigation.navigate("Stories", {
            users: [user], initialIndex: 0
          })
        }}
      />
    )
  }

  renderAd = () => {
    if (Config.adsEnabled()) {
      return (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0, left: 0,
            alignItems: "center",
          }}
        >
          {/* <Banner
            unitId={requestSearchAdUnit}
            size={"BANNER"}
            request={requestSearch.build()}
            onAdLoaded={(e) => {
            }}
            onAdFailedToLoad={error => {
            }}
          /> */}
        </View>
      )
    }
  }

  renderLoader = () => {
    const showLoader = MainState.adIsComing
    if (!showLoader) {
      return null
    }
    return (
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    padding: 12,
    flex: 1,
    borderColor: 'gray', borderWidth: 1,
    borderRadius: 6,
    marginBottom: 4,
    color: 'white'
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
})