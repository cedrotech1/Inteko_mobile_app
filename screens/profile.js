import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from '@env';
const ProfilePage = ({ navigation, route }) => {
  const { onLogout } = route.params || {};
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',

  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      const user = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      if (user) {
        const parsedUser = JSON.parse(user);
        setFormData({
          firstname: parsedUser.firstname || '',
          lastname: parsedUser.lastname || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
        });
        setUserId(parsedUser.id);
      }
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadUserData();
  }, []);



  const handlePasswordChange = async () => {
    if (!token) {
      Alert.alert('Error', 'User is not authenticated.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/users/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        Alert.alert('Success', res.message);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setLoading(false);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again later.');
      setLoading(false);
      console.error(error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
            await AsyncStorage.clear();
            // navigation.navigate('Login');
            onLogout();
        }},
      ],
      { cancelable: false }
    );
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  // Update login state
  };

  return (
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Information</Text>
        <Text style={styles.cardText}>Name: {formData.firstname} {formData.lastname}</Text>
        <Text style={styles.cardText}>Email: {formData.email}</Text>
        <Text style={styles.cardText}>Phone: {formData.phone}</Text>
 
      </View>

      {/* Change Password Section */}
      <Text style={styles.sectionTitle}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        value={passwordData.oldPassword}
        onChangeText={(text) => setPasswordData({ ...passwordData, oldPassword: text })}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={passwordData.newPassword}
        onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={passwordData.confirmPassword}
        onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
        secureTextEntry
      />

      {/* Submit Button for Password Change */}
      <Button title="Change Password" onPress={handlePasswordChange} disabled={loading} />

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfilePage;
