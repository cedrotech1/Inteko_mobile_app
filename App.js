import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from 'react-native-vector-icons';
import Posts from './screens/Posts';
import Notifications from './screens/notification';
import Profile from './screens/profile';
import Penarities from './screens/Penarities';
import Login from './screens/Login';
import Signup from './screens/Signup';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);  // Update state on successful login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#0096FF" barStyle="light-content" />
      <Tab.Navigator>
        {isLoggedIn ? (
          <>
            <Tab.Screen
              name="Notifications"
              component={Notifications}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
            <Tab.Screen
              name="Posts"
              component={Posts}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="post-outline" color={color} size={size} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
            <Tab.Screen
              name="Penarities"
              component={Penarities}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="cash-multiple" color={color} size={size} />
                ),
                tabBarLabel: 'Penalties',
                headerShown: false, // Hide header for this screen
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              initialParams={{ onLogout: handleLogout }}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Login"
              component={Login}
              initialParams={{ onLogin: handleLogin }}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-in-outline" size={size} color={color} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
            <Tab.Screen
              name="Signup"
              component={Signup}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-add-outline" size={size} color={color} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
