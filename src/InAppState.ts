// import { computed, observable, action, reaction } from 'mobx'
// import { AsyncStorage, Platform } from 'react-native'
// import * as RNIap from 'react-native-iap'

// import * as fire from './fire'

// const itemSkus = Platform.select({
//   ios: [
//   ],
//   android: [
//     'com.storystalker.android.noads'
//   ]
// })

// class InAppState {
//   constructor() {
//   }

//   @observable products = []
//   @observable _noAdsEnabled = false
//   @observable _initialized = false

//   @computed get noAdsEnabled() {
//     return false
//     return this._noAdsEnabled
//   }

//   @computed get initialized() {
//     return this._initialized
//   }

//   @computed get noAdsProduct() {
//     if (!this.products) {
//       return null
//     }
//     for (let i = 0; i < this.products.length; i++) {
//       const product = this.products[i];
//       if (product.productId === 'com.storystalker.android.noads') {
//         return product
//       }
//     }
//     return null
//   }

//   @computed get noAdsProductId() {
//     return this.noAdsProduct && this.noAdsProduct.productId
//   }

//   @computed get noAdsLocalizedPrice() {
//     return this.noAdsProduct.localizedPrice
//   }

//   @action initialize = async () => {
//     // firebase.crashlytics().log('initialize bill')
//     this.products = await RNIap.getProducts(itemSkus)
//     let purchases
//     try {
//       purchases = await RNIap.getAvailablePurchases()
//     } catch (error) {
//       fire.trackEvent("fail_getProducts")
//     }
//     for (let i = 0; i < purchases.length; i++) {
//       const purchase = purchases[i];
//       // console.log('purchase:', purchase)
//       // console.warn('purchase.productId:', purchase.productId)
//       if (purchase.productId === 'com.storystalker.android.noads') {
//         this.noAdsPurchaseSuccess()
//         // console.log('purchase.isAcknowledgedAndroid:', purchase.isAcknowledgedAndroid)
//         try {
//           if (!purchase.isAcknowledgedAndroid) {
//             RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken)
//           }
//         } catch (error) {
//         }
//       }
//     }
//     this._initialized = true
//     // console.log('cioo init', this._initialized)
//   }

//   @action clear = () => {
//     RNIap.endConnectionAndroid()
//   }

//   @action noAdsPurchaseSuccess = (receipt) => {
//     this._noAdsEnabled = true
//   }
// }

// export default new InAppState()