import { IUser, IUserDetailed, IPost, IStoryPerUser } from './interfaces'
import LoginState from './LoginState'

export default {
  searchUser: async (text: string): Promise<IUser[]> => {
    const res = await fetch(`https://www.instagram.com/web/search/topsearch/?context0blended&query=${encodeURIComponent(text)}`)
    const data = await res.json()
    // console.log(data)
    const users: IUser[] = data.users.map((d: { user: IUser }) => d.user)
    // console.log('users:', users)
    return users
  },
  search: async (text: string): Promise<IUser[]> => {
    const searchUrl = `https://i.instagram.com/api/v1/users/search?q=${encodeURIComponent(text)}`
    const searchUrlResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        "user-agent": "Instagram 10.26.0 (iPhone9,3)",
        "cookie": LoginState.cookieRow,
      },
      credentials: "omit",
    })
    const data = await searchUrlResponse.json()
    // console.warn('data:', data)
    // console.warn('data.users:', typeof data.users, data.users)
    // console.warn('data.users[0]:', data.users[0])

    // data.users.forEach(element => {
    //   console.warn('element:', element)
    // });

    const users: IUser[] = data.users.map((d: IUser) => {
      return d
    })
    // console.warn('users:', users)
    return users
  },
  getUserDetail: async (userPk: string): Promise<IUserDetailed> => {
    const userInfoUrl = `https://i.instagram.com/api/v1/users/${userPk}/info`
    const userInfoUrlResponse = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        "user-agent": "Instagram 10.26.0 (iPhone9,3)",
        "cookie": LoginState.cookieRow,
      },
      credentials: "omit",
    })
    const data = await userInfoUrlResponse.json()
    const user: IUserDetailed = data.user
    // console.log('data:', user)
    return user
  },
  getUserFeed: async (userPk: string): Promise<IPost[]> => {
    const userFeedUrl = `https://i.instagram.com/api/v1/feed/user/${userPk}/`
    const userFeedUrlResponse = await fetch(userFeedUrl, {
      method: 'GET',
      headers: {
        "user-agent": "Instagram 10.26.0 (iPhone9,3)",
        "cookie": LoginState.cookieRow,
      },
      credentials: "omit",
    })
    const data = await userFeedUrlResponse.json()
    // console.log('data:', data)
    if (data.status === "fail") {
      if (data.message === "Not authorized to view user") {
        throw new Error("private")
      }
      throw new Error("")
    }
    return data.items
  },
  getUserTray: async (userPk: string): Promise<IStoryPerUser[]> => {
    const userTrayUrl = `https://i.instagram.com/api/v1/feed/user/${userPk}/reel_media`
    const userStoriesResponse = await fetch(userTrayUrl, {
      method: 'GET',
      headers: {
        "user-agent": "Instagram 10.26.0 (iPhone9,3)",
        "cookie": LoginState.cookieRow,
      },
      credentials: "omit",
    })
    const userStoriesJson = await userStoriesResponse.json()
    console.log('userStoriesJson', userStoriesJson)
    return userStoriesJson.items
  },
}