import { PermissionsAndroid, Platform, Dimensions } from 'react-native'
import CameraRoll from "@react-native-community/cameraroll"
import RNFetchBlob from 'rn-fetch-blob'
// import faker from "faker"
import * as Config from './Config'
import { IImageCandidate } from './interfaces'

export const downloadVideo = async (videoUrl: string) => {
  const doDownload = async (videoUrl: string) => {
    try {
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'mp4'
      }).fetch('GET', videoUrl)
      const fileName = res.path()
      await CameraRoll.saveToCameraRoll(fileName)
      return true
    } catch (error) {
      return false
    }
  }

  if (Platform.OS === "android") {
    const writeExternalStoragePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    if (!writeExternalStoragePermission) {
      const grantedWrite = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Story Stalker Download Permission',
          message:
            'Story Stalker needs your permission to' +
            'download stories.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (grantedWrite === PermissionsAndroid.RESULTS.GRANTED) {
        return doDownload(videoUrl)
      } else {
        return false
      }
    } else {
      return doDownload(videoUrl)
    }
  } else {
    return doDownload(videoUrl)
  }
}

export const downloadImage = async (imageUrl) => {
  const doDownload = async (url) => {
    try {
      await CameraRoll.saveToCameraRoll(url, "photo")
      return true
    } catch (error) {
      // console.warn(error)
      return false
    }
  }

  if (Platform.OS === "android") {
    const downloadLocal = async () => {
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
      }).fetch('GET', imageUrl)
      const fileName = 'file://' + res.path()
      // console.warn(fileName)
      return await doDownload(fileName)
    }
    const writeExternalStoragePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    if (!writeExternalStoragePermission) {
      const grantedWrite = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Story Stalker Download Permission',
          message:
            'Story Stalker needs your permission to' +
            'download stories.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (grantedWrite === PermissionsAndroid.RESULTS.GRANTED) {
        return await downloadLocal()
      } else {
        return false
      }
    } else {
      return await downloadLocal()
    }
  } else {
    return await doDownload(imageUrl)
  }
}

const fakeStories = [
  "https://images.pexels.com/photos/1122868/pexels-photo-1122868.jpeg",
  "https://images.pexels.com/photos/1143367/pexels-photo-1143367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/1586483/pexels-photo-1586483.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/1889731/pexels-photo-1889731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/1666073/pexels-photo-1666073.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
]

const fakePosts = [
  "https://images.pexels.com/photos/616427/pexels-photo-616427.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/1427741/pexels-photo-1427741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/977460/pexels-photo-977460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/225017/pexels-photo-225017.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/297977/pexels-photo-297977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/2102332/pexels-photo-2102332.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/127229/pexels-photo-127229.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/460373/pexels-photo-460373.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/813362/pexels-photo-813362.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
]

export const getAvatar = (avatar: string) => {
  const count = Math.floor(Math.random() * 70) + 1
  return Config.ssMode ? `https://i.pravatar.cc/64?img=${count}` : avatar
}

export const getUsername = (username: string) => {
  return Config.ssMode ? 'faker.internet.userName()' : username
}

export const getFullname = (fullname: string) => {
  return Config.ssMode ? ('faker.name.firstName()' + " " + 'faker.name.lastName()') : fullname
}

export const getStoryImage = (image: string) => {
  const random = Math.floor(Math.random() * fakeStories.length);
  return Config.ssMode ? fakeStories[random] : image
}


export const getPostCandidate = (candidate: IImageCandidate) => {
  const random = Math.floor(Math.random() * fakePosts.length);
  return Config.ssMode ?
    {
      url: fakePosts[random],
      width: Dimensions.get('window').width,
      height: 0.7 * Dimensions.get('window').width,
    }
    : candidate
}

export const getPhoto = (image: string) => {
  return Config.ssMode ? "https://images.pexels.com/photos/2221875/pexels-photo-2221875.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" : image
}