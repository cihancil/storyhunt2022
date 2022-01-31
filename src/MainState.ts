import { computed, observable, action, reaction } from 'mobx'
import { AsyncStorage } from 'react-native'
import { IUser, IUserDetailed } from './interfaces'
import Api from './Api'

class MainState {
  @observable _users = []
  @observable initialized = false
  @observable activeStoryTab = null
  @observable adIsComing = false

  constructor() {
    this.initialize()
  }

  initialize = async () => {
    // await this.removeAll()
    const usersString = await AsyncStorage.getItem('users')
    const users = JSON.parse(usersString)
    this._users = users || []
    this.initialized = true
  }

  @computed get users() {
    return this._users.slice()
  }

  @action addUserToMyList = async (user) => {
    await this.removeFromMyList(user)
    this._users = [user, ...this._users]
    await AsyncStorage.setItem('users', JSON.stringify(this._users.slice()))
  }

  @action removeFromMyList = async (userToRemove: IUser) => {
    this._users = this._users.filter(user => {
      return user.pk !== userToRemove.pk
    })
    await AsyncStorage.setItem('users', JSON.stringify(this._users.slice()))
  }

  @action updateUserPrivateStatus = async (updatedUser: IUser) => {
    this._users.forEach(user => {
      if (user.pk === updatedUser.pk) {
        user.is_private = updatedUser.is_private
      }
    })
    await AsyncStorage.setItem('users', JSON.stringify(this._users.slice()))
  }

  @action updateUserAvatar = async (userForAvatarUpdate: IUser) => {
    this._users.forEach(async (user: IUser) => {
      if (user.pk === userForAvatarUpdate.pk) {
        const userDetailed: IUserDetailed = await Api.getUserDetail(user.pk)
        user.profile_pic_url = userDetailed.profile_pic_url
      }
    })
    await AsyncStorage.setItem('users', JSON.stringify(this._users.slice()))
  }

  @action removeAll = async () => {
    await AsyncStorage.removeItem('users')
  }

  @action setAdIsComing = async (isComing: boolean) => {
    this.adIsComing = isComing
    if (isComing) {
      setTimeout(() => {
        this.adIsComing = false
      }, 3000)
    }
  }
}

export default new MainState()