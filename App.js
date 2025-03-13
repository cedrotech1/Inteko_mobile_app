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
      <StatusBar backgroundColor="red" barStyle="light-content" />
      <Tab.Navigator>
        {isLoggedIn ? (
          <>
            <Tab.Screen
              name="Notifications"
              component={Notifications}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="bell" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Posts"
              component={Posts}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="message" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Penarities"
              component={Penarities}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account-star-outline" color={color} size={size} />
                ),
                tabBarLabel: 'Penarities',
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              initialParams={{ onLogout: handleLogout }}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
              }}
            />
          </>
        ) : (
          <>
          <Tab.Screen
  name="Login"
  component={Login}
  initialParams={{ onLogin: handleLogin }} // Pass it as an initial param
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="log-in" size={size} color={color} />
    ),
  }}
/>

            <Tab.Screen
              name="Signup"
              component={Signup}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-add" size={size} color={color} />
                ),
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
