import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import LinearGradient from 'react-native-linear-gradient'

import * as Config from './Config'
import * as Utils from './apputils'
import { IUser } from './interfaces'

type State = {
  buttonAdd: Boolean,
}

type Props = {
  button: string,
  onPress: Function,
  onAddPress: Function,
  onRemovePress: Function,
  onProfileButtonPress: Function,
  onAvatarImageError: Function,
  user: IUser,
  autoSwitch?: Boolean,
}

export default class MyListItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      buttonAdd: this.props.button === "add"
    }
  }

  public static defaultProps: Partial<Props> = {
    onAddPress: () => { },
    onRemovePress: () => { },
    onProfileButtonPress: () => { },
  }

  renderAvatar = () => {
    const { user, onAvatarImageError } = this.props
    const { profile_pic_url } = user
    return (
      <View
        // hitSlop={{
        //   left: 16,
        //   right: 4,
        //   top: 8,
        //   bottom: 8,
        // }}
        style={[styles.image, {
          alignItems: 'center',
          justifyContent: 'center',
          height: 52 + 12,
          width: 52 + 12,
          marginRight: 8,

        }]}>
        {/* <LinearGradient
          colors={['red', 'blue']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 52 + 12,
            width: 52 + 12,
            borderRadius: (52 + 12) / 2,
          }}
        /> */}
        <Image
          source={{ uri: Utils.getAvatar(profile_pic_url) }}
          style={styles.image}
        // onError={() => {
        //   onAvatarImageError()
        // }}
        />
      </View>
    )
  }

  renderProfileButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onProfileButtonPress()
        }}
        hitSlop={{
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        }}
        style={{
          padding: 8,
        }}
      >
        <IconFontAwesome name="user-circle" color="white" size={24} />
      </TouchableOpacity>
    )
  }

  renderAddRemove = () => {
    if (this.state.buttonAdd) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (this.props.autoSwitch) {
              this.setState({ buttonAdd: false })
            }
            this.props.onAddPress()
          }}
          hitSlop={{
            left: 8,
            right: 8,
            top: 8,
            bottom: 8,
          }}
          style={StyleSheet.flatten([styles.button, styles.buttonAdd])}>
          <IconAntDesign name="adduser" color="white" size={24} />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.autoSwitch) {
            this.setState({ buttonAdd: true })
          }
          this.props.onRemovePress()
        }}
        hitSlop={{
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        }}
        style={StyleSheet.flatten([styles.button, styles.buttonRemove])}>
        <IconAntDesign name="delete" color="red" size={24} />
      </TouchableOpacity>
    )
  }

  render() {
    const { user, onPress } = this.props
    const Container: React.ReactType = onPress ? TouchableOpacity : View
    const { pk, username, full_name, profile_pic_url, is_private } = user
    return (
      <Container
        key={'mylist' + pk}
        style={styles.container}
        onPress={onPress}
      >
        {this.renderAvatar()}
        <View style={styles.nameContainer}>
          <View style={styles.usernameContainer}>
            <Text numberOfLines={1} style={styles.textUsername}>
              {Utils.getUsername(username)}
            </Text>
            {
              is_private &&
              <View style={{
                flexDirection: "row", padding: 2, borderRadius: 4,
                borderColor: "#bbb", borderWidth: StyleSheet.hairlineWidth,
                alignItems: "center",
              }}>
                <IconEntypo name="lock" color="black" />
                <Text style={{ fontFamily: Config.fontName, fontSize: 12, }}>Private</Text>
              </View>
            }
          </View>
          <Text style={styles.textFullname} numberOfLines={1}>
            {Utils.getFullname(full_name)}
          </Text>
        </View>
        {this.renderProfileButton()}
        {this.renderAddRemove()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    backgroundColor: '#222',
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  nameContainer: {
    flex: 1,
    justifyContent: "center",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  textUsername: {
    fontWeight: 'bold',
    fontFamily: Config.fontName,
    marginRight: 4,
    color: 'white'
  },
  textFullname: { fontFamily: Config.fontName, color: '#ccc' },
  button: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAdd: {
  },
  buttonRemove: {
  },
  buttonText: { fontSize: 14, fontFamily: Config.fontName, color: 'red' },
  buttonAddText: {
    color: 'white'
  }
})
