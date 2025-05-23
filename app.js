// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home            from './app/index';
import Login           from './Login';
import Register        from './app/Register';
import User            from './app/User';
import Profile         from './app/Profile';
import Addbooks        from './app/Addbooks';
import Availablebooks  from './app/Availablebooks';
import Dashboard       from './app/Dashboard';
import Sidebar         from './app/Sidebar';
import Userlist        from './app/Userlist';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,    // Hide header on all screens
        }}
      >
        <Stack.Screen name="Home"           component={Home} />
        <Stack.Screen name="Login"          component={Login} />
        <Stack.Screen name="Register"       component={Register} />
        <Stack.Screen name="User"           component={User} />
        <Stack.Screen name="Profile"        component={Profile} />
        <Stack.Screen name="Addbooks"       component={Addbooks} />
        <Stack.Screen name="Availablebooks" component={Availablebooks} />
        <Stack.Screen name="Dashboard"      component={Dashboard} />
        <Stack.Screen name="Sidebar"        component={Sidebar} />
        <Stack.Screen name="Userlist"       component={Userlist} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
