import analytics from '@react-native-firebase/analytics'

export const trackScreen = (screenName: string) => {
  analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  })
}

export const trackEvent = (event: string, params: object | undefined = undefined) => {
  analytics().logEvent(event, params)
}

// export const getPublicCookie = async () => {
//   try {
//     const res = await fetch('https://us-central1-storystalker-89bdb.cloudfunctions.net/getPublicCookieSimple')
//     const data = await res.text()
//     console.warn(data)
//     return data

//     // const callable = firebase.functions().httpsCallable("getPublicCookie")
//     // const getPublicCookieData = await callable({ some: 'args' })
//     // return getPublicCookieData
//   } catch (error) {
//     console.warn(error)
//     return false
//   }
// }