// import React, { Fragment } from 'react'
// import {
//   View, ScrollView, Button, TextInput, Text,
//   Image,
//   TouchableOpacity,
//   Dimensions, Platform,
//   Alert,
//   StyleSheet,
// } from 'react-native'
// import { observer } from 'mobx-react/native'
// import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import { ifIphoneX } from 'react-native-iphone-x-helper'
// import LinearGradient from 'react-native-linear-gradient'
// import RNIap, {
//   ProductPurchase,
//   purchaseUpdatedListener,
//   purchaseErrorListener,
// } from 'react-native-iap'

// import InAppState from './InAppState'
// import * as fire from './fire'

// @observer
// export default class InAppScreen extends React.Component {

//   handlePurchase = sku => {
//     // InAppState.purchaseNoAds()
//     try {
//       RNIap.requestPurchase(sku)
//       fire.trackEvent("noads_request")
//     } catch (err) {
//       fire.trackEvent("noads_error", { msg: err.message })
//       // console.warn(err.code, err.message)
//     }
//   }

//   componentDidMount() {
//     fire.trackEvent("noads_opened")
//     purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
//       // console.log('purchaseUpdatedListener', purchase)
//       InAppState.noAdsPurchaseSuccess(purchase.transactionReceipt)
//       try {
//         RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken)
//       } catch (error) {
//       }
//       fire.trackEvent("noads_success")
//       this.props.navigation.pop()
//       // this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext());
//     })
//     purchaseErrorSubscription = purchaseErrorListener((error) => {
//       fire.trackEvent("noads_success", error)
//       // console.log('purchaseErrorListener', error)
//       // Alert.alert('purchase error', JSON.stringify(error))
//     })
//   }

//   componentWillUnmount() {
//     if (purchaseUpdateSubscription) {
//       purchaseUpdateSubscription.remove()
//       purchaseUpdateSubscription = null
//     }
//     if (purchaseErrorSubscription) {
//       purchaseErrorSubscription.remove()
//       purchaseErrorSubscription = null
//     }
//   }

//   renderGradient = () => {
//     return (
//       <LinearGradient
//         colors={['red', 'blue']}
//         style={{
//           position: 'absolute',
//           left: 0,
//           right: 0,
//           top: 0,
//           height: Dimensions.get('window').height,
//           width: Dimensions.get('window').width,
//         }}
//       />
//     )
//   }

//   renderClose = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           this.props.navigation.pop()
//         }}
//         style={{
//           position: 'absolute',
//           top: ifIphoneX(32, Platform.select({ android: 4, ios: 22 })),
//           right: 0,
//           padding: 16,
//         }}
//       >
//         <IconMaterialCommunityIcons size={30} name="close" color="white" />
//       </TouchableOpacity>
//     )
//   }

//   renderTexts = () => {
//     return (
//       <Fragment>
//         <Text style={styles.header}>
//           REMOVE ADS
//         </Text>
//         <Text style={styles.normal}>
//           You will get no ads forever.
//           {'\n'}
//           Support us to improve the app even more.
//         </Text>
//       </Fragment>
//     )
//   }

//   renderAction = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => this.handlePurchase(InAppState.noAdsProductId)}
//         style={{ padding: 16, borderColor: 'white', borderWidth: 3, borderRadius: 4, }}>
//         <Text style={styles.action}>BUY for {InAppState.noAdsLocalizedPrice}</Text>
//       </TouchableOpacity>
//     )
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         {this.renderGradient()}
//         {this.renderClose()}
//         {this.renderTexts()}
//         {this.renderAction()}
//       </View>
//     )
//   }
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   header: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 30,
//     marginBottom: 40,
//     textAlign: 'center',
//   },
//   normal: {
//     color: 'white',
//     fontSize: 20,
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   action: {
//     color: 'white',
//     fontSize: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   }
// })