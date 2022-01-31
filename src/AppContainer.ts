import { createAppContainer, createStackNavigator } from 'react-navigation'
import { Dimensions } from 'react-native'

import HomeScreen from './HomeScreen'
import SearchScreen from './SearchScreen'
import StoriesScreen from './StoriesScreen'
// import InAppScreen from './InAppScreen'
import InstagramLoginScreen from './InstagramLoginScreen'
import UserScreen from './UserScreen'
import PhotoScreen from './PhotoScreen'

const MainStack = createStackNavigator({
  Home: HomeScreen,
  Search: SearchScreen,
  User: UserScreen,
}, {
  headerMode: 'none',
})


const AppNavigator = createStackNavigator({
  Main: MainStack,
  Stories: {
    screen: StoriesScreen,
    navigationOptions: {
      gestureResponseDistance: { vertical: Dimensions.get('window').height }
    }
  },
  InstagramLogin: {
    screen: InstagramLoginScreen,
  },
  // InApp: {
  //   screen: InAppScreen,
  //   navigationOptions: {
  //     gestureResponseDistance: { vertical: Dimensions.get('window').height / 2 }
  //   }
  // },
  Photo: {
    screen: PhotoScreen,
  }
}, {
  mode: 'modal',
  headerMode: 'none',
})

export default createAppContainer(AppNavigator)