import { Dimensions } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './HomeScreen'
import SearchScreen from './SearchScreen'
import StoriesScreen from './StoriesScreen'
// import InAppScreen from './InAppScreen'
import InstagramLoginScreen from './InstagramLoginScreen'
import UserScreen from './UserScreen'
import PhotoScreen from './PhotoScreen'

// const MainStack = createStackNavigator({
//   Home: HomeScreen,
//   Search: SearchScreen,
//   User: UserScreen,
// }, {
//   headerMode: 'none',
// })


// const AppNavigator = createStackNavigator({
//   Main: MainStack,
//   Stories: {
//     screen: StoriesScreen,
//     navigationOptions: {
//       gestureResponseDistance: { vertical: Dimensions.get('window').height }
//     }
//   },
//   InstagramLogin: {
//     screen: InstagramLoginScreen,
//   },
//   // InApp: {
//   //   screen: InAppScreen,
//   //   navigationOptions: {
//   //     gestureResponseDistance: { vertical: Dimensions.get('window').height / 2 }
//   //   }
//   // },
//   Photo: {
//     screen: PhotoScreen,
//   }
// }, {
//   mode: 'modal',
//   headerMode: 'none',
// })

// export default createAppContainer(AppNavigator)

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Search" component={SearchScreen} />
          <RootStack.Screen name="User" component={UserScreen} />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="Stories" component={StoriesScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator