import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import codePush from "react-native-code-push";

import HomeScreen from './src/HomeScreen'
import SearchScreen from './src/SearchScreen'
import UserScreen from './src/UserScreen'
import StoriesScreen from './src/StoriesScreen'
import InstagramLoginScreen from './src/InstagramLoginScreen'
import PhotoScreen from './src/PhotoScreen'

const RootStack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor='black' barStyle='default' />
      <RootStack.Navigator initialRouteName="Home" screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Search" component={SearchScreen} />
        <RootStack.Screen name="User" component={UserScreen} />
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="Stories" component={StoriesScreen} />
          <RootStack.Screen name="InstagramLogin" component={InstagramLoginScreen} />
          <RootStack.Screen name="Photo" component={PhotoScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default codePush(App)
