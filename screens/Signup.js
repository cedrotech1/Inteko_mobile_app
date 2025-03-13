import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { REACT_APP_BASE_URL } from '@env';
const AddUser = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    role: 'citizen',
    nid: '',
    familyinfo: '',
    gender: 'Male',
    address: '',
    province_id: '',
    district_id: '',
    sector_id: '',
    cell_id: '',
    village_id: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [addressData, setAddressData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);
//   let token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/address`);
        const data = await response.json();
        if (data.success) {
          setAddressData(data.data);
        } else {
          setMessage('Failed to fetch address data.');
        }
      } catch (error) {
        setMessage('Error fetching address data: ' + error.message);
      }
    };
    fetchAddressData();
  }, []);

  const handleProvinceChange = (value) => {
    setFormData({
      ...formData,
      province_id: value,
      district_id: '',
      sector_id: '',
      cell_id: '',
      village_id: ''
    });

    const selectedProvince = addressData.find((province) => province.id === parseInt(value));
    setDistricts(selectedProvince ? selectedProvince.districts : []);
  };

  const handleDistrictChange = (value) => {
    setFormData({
      ...formData,
      district_id: value,
      sector_id: '',
      cell_id: '',
      village_id: ''
    });

    const selectedDistrict = districts.find((district) => district.id === parseInt(value));
    setSectors(selectedDistrict ? selectedDistrict.sectors : []);
  };

  const handleSectorChange = (value) => {
    setFormData({
      ...formData,
      sector_id: value,
      cell_id: '',
      village_id: ''
    });

    const selectedSector = sectors.find((sector) => sector.id === parseInt(value));
    setCells(selectedSector ? selectedSector.cells : []);
  };

  const handleCellChange = (value) => {
    setFormData({
      ...formData,
      cell_id: value,
      village_id: ''
    });

    const selectedCell = cells.find((cell) => cell.id === parseInt(value));
    setVillages(selectedCell ? selectedCell.villages : []);
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setMessage('');
    try {
      const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/users/signup`, {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('User added successfully!');
      } else {
        setMessage(data.message || 'Failed to add user.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign up in system</Text>
      {message && <Text style={styles.alert}>{message}</Text>}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="National ID Number"
          onChangeText={(text) => handleChange('nid', text)}
          value={formData.nid}
          keyboardType="numeric"
          maxLength={16}
          minLength={16}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(text) => handleChange('firstname', text)}
          value={formData.firstname}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(text) => handleChange('lastname', text)}
          value={formData.lastname}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => handleChange('email', text)}
          value={formData.email}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          onChangeText={(text) => handleChange('phone', text)}
          value={formData.phone}
          keyboardType="numeric"
          maxLength={10}
          minLength={10}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => handleChange('password', text)}
          value={formData.password}
          secureTextEntry
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={(text) => handleChange('confirmPassword', text)}
          value={formData.confirmPassword}
          secureTextEntry
          required
        />
        <Text style={styles.label}>Select Gender:</Text>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(itemValue) => handleChange('gender', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        <TextInput
          style={styles.textarea}
          placeholder="Enter Family Information"
          onChangeText={(text) => handleChange('familyinfo', text)}
          value={formData.familyinfo}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.label}>Select Province:</Text>
        <Picker
          selectedValue={formData.province_id}
          onValueChange={handleProvinceChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Province" value="" />
          {addressData.map((province) => (
            <Picker.Item key={province.id} label={province.name} value={province.id} />
          ))}
        </Picker>
        <Text style={styles.label}>Select District:</Text>
        <Picker
          selectedValue={formData.district_id}
          onValueChange={handleDistrictChange}
          style={styles.picker}
          enabled={formData.province_id !== ''}
        >
          <Picker.Item label="Select District" value="" />
          {districts.map((district) => (
            <Picker.Item key={district.id} label={district.name} value={district.id} />
          ))}
        </Picker>
        <Text style={styles.label}>Select Sector:</Text>
        <Picker
          selectedValue={formData.sector_id}
          onValueChange={handleSectorChange}
          style={styles.picker}
          enabled={formData.district_id !== ''}
        >
          <Picker.Item label="Select Sector" value="" />
          {sectors.map((sector) => (
            <Picker.Item key={sector.id} label={sector.name} value={sector.id} />
          ))}
        </Picker>
        <Text style={styles.label}>Select Cell:</Text>
        <Picker
          selectedValue={formData.cell_id}
          onValueChange={handleCellChange}
          style={styles.picker}
          enabled={formData.sector_id !== ''}
        >
          <Picker.Item label="Select Cell" value="" />
          {cells.map((cell) => (
            <Picker.Item key={cell.id} label={cell.name} value={cell.id} />
          ))}
        </Picker>
        <Text style={styles.label}>Select Village:</Text>
        <Picker
          selectedValue={formData.village_id}
          onValueChange={(value) => handleChange('village_id', value)}
          style={styles.picker}
          enabled={formData.cell_id !== ''}
        >
          <Picker.Item label="Select Village" value="" />
          {villages.map((village) => (
            <Picker.Item key={village.id} label={village.name} value={village.id} />
          ))}
        </Picker>
        <Button title="Sign Up" onPress={handleSubmit} />
        <Text style={styles.link} onPress={() => Alert.alert('Go to Login')}>Login</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  textarea: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    // height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
  },
  alert: {
    color: 'green',
    // backgroundColor:'lightgray',
    height:'1cm',
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default AddUser;
