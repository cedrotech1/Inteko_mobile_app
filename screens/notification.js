import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons for bell icon
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { formatDistanceToNow } from "date-fns";
import { REACT_APP_BASE_URL } from '@env';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(null); // Add state for token

  // Effect to load the token from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage
      if (storedToken) {
        setToken(storedToken); // Set token in state
      }
    };

    loadUserData();
  }, []); // Load token on component mount

  // Effect to fetch notifications once the token is available
  useEffect(() => {
    if (token) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(
            `${REACT_APP_BASE_URL}/api/v1/notification`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotifications(response.data.data || []);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotifications([]); // Optionally handle empty notifications if the fetch fails
          Alert.alert("Error", "Failed to fetch notifications.");
        }
      };
      fetchNotifications();
    }
  }, [token]); // Only fetch notifications when the token is available

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${REACT_APP_BASE_URL}/api/v1/notification/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Error", "Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${REACT_APP_BASE_URL}/api/v1/notification/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      Alert.alert("Error", "Failed to delete notification");
    }
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.card, item.isRead ? styles.readCard : styles.unreadCard]}>
      <View style={styles.cardHeader}>
        <Ionicons
          name={item.isRead ? "notifications-outline" : "notifications"}
          size={24}
          color={item.isRead ? "gray" : "orange"}
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Text>
      <View style={styles.cardFooter}>
        {!item.isRead && (
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => markAsRead(item.id)}
          >
            <Text style={styles.readButtonText}>Mark as Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        <Ionicons name="notifications" size={28} color="blue" /> Notifications
      </Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No new notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 16,
  },
  noNotifications: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  unreadCard: {
    borderColor: "orange",
  },
  readCard: {
    borderColor: "gray",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: "gray",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  readButton: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 4,
  },
  readButtonText: {
    color: "white",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
  },
});

export default Notifications;
