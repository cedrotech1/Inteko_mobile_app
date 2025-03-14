import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal, TextInput, ActivityIndicator, Alert, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from '@env';

const FinesList = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [token, setToken] = useState(null); // Add state for token

  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      if (storedToken) {
        setToken(storedToken); // Set token in state
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const fetchPenalties = async () => {
      if (!token) return; // Avoid fetching if token is not yet available

      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/penalties/mypenarities`, {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from state
            Accept: "*/*",
          },
        });
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
          setPenalties(result);
        } else {
          setError("No fines found.");
        }
      } catch (error) {
        setError("Failed to fetch fines.");
      } finally {
        setLoading(false);
      }
    };

    fetchPenalties();
  }, [token]); // Only fetch fines when token is available

  const handlePayPenalty = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a valid phone number!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/penalties/pay`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          penaltyID: selectedPenalty.id,
          number: phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", data.message);
        setPenalties((prevPenalties) =>
          prevPenalties.map((penalty) =>
            penalty.id === selectedPenalty.id ? { ...penalty, status: "paid" } : penalty
          )
        );
        setShowModal(false);
      } else {
        Alert.alert("Error", "Failed to pay penalty, please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Error processing the payment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚨 My Fines</Text>

      <ScrollView style={styles.finesList}>
        {penalties.map((penalty) => (
          <View key={penalty.id} style={styles.card}>
            <Text style={styles.title}>Penalty on post</Text>
            <Text style={styles.subText}>
              {penalty.post.title} post On: {new Date(penalty.post.createdAt).toLocaleDateString()}
            </Text>

            <Text style={styles.status}>
              Status:{" "}
              <Text style={{ color: penalty.status === "un paid" ? "orange" : "green" }}>
                {penalty.status}
              </Text>
            </Text>

            <Text style={styles.subText}>
              Offered On: {new Date(penalty.createdAt).toLocaleDateString()}
            </Text>

            {penalty.status === "un paid" ? (
              <>
                <Text style={styles.danger}>
                  Fine: {penalty.penarity} (un paid)
                </Text>
                <View style={styles.warning}>
                  <MaterialCommunityIcons name="alert-triangle" size={20} color="orange" />
                  <Text>You must go to the village to report about this fine.</Text>
                </View>
                <Button
                  title="Pay Fine"
                  onPress={() => {
                    setSelectedPenalty(penalty);
                    setShowModal(true);
                  }}
                />
              </>
            ) : (
              <>
                <Text style={styles.success}>
                  Fine {penalty.penarity} Paid!
                </Text>
                <View style={styles.successAlert}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="green" />
                  <Text>Congratulations! Your penalty has been resolved.</Text>
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pay Penalty</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <View style={styles.buttonContainer}>
            <Button
              title={loading ? "Processing..." : "Pay Now"}
              onPress={handlePayPenalty}
              disabled={loading}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  finesList: {
    flex: 1,
  },
  card: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subText: {
    color: "#6c757d",
    fontSize: 14,
  },
  status: {
    marginVertical: 10,
  },
  danger: {
    color: "red",
    fontWeight: "bold",
  },
  success: {
    color: "green",
    fontWeight: "bold",
  },
  warning: {
    backgroundColor: "#fff3cd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  successAlert: {
    backgroundColor: "#d4edda",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  error: {
    textAlign: "center",
    color: "red",
  },
});

export default FinesList;
