import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import styles from '../components/loginStyle'; 
import { REACT_APP_BASE_URL } from '@env';

const Login = ({ route  }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  console.log("User logged in!");
  const { onLogin } = route.params || {};


  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${REACT_APP_BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccessMessage('Login successful!');
      
        onLogin();  // Redirect to another screen after successful login
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Something went wrong, please try again.');
      } else if (error.request) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('There was an error logging in.');
      }
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Success Message */}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {isLoading && <ActivityIndicator size="large" color="#3498db" style={styles.loader} />}
    </View>
  );
};

export default Login;
