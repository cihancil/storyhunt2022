import {
  Platform,
} from 'react-native'

// import InAppState from './InAppState'

export const fontName = Platform.select({
  ios: "Arial",
  android: "Roboto",
})

export const storiesBetweenAdGap = 3
// export const adsEnabled = true && !__DEV__
// export const adsEnabled = () => !InAppState.noAdsEnabled
export const adsEnabled = () => true
export const ssMode = false


export const flurrySDK = Platform.select({
  android: 'Y795DTNWXDJFJYFT6KR3',
  ios: '',
})