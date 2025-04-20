import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker

export default function EditProfileScreen() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    studentid: '',
    courseSection: '',
    gender: 'Male',
  });
  const [profileImage, setProfileImage] = useState(null); // State to store the profile image

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', form);
    // You would typically send the form data to your API or backend here
  };

  const handleChooseImage = () => {
    // Launch the image picker when the user selects the button
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri); // Set the selected image URI
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={form.fullname}
        onChangeText={(text) => handleChange('fullname', text)}
        placeholder="Enter your full name"
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        placeholder="Enter your email"
      />

      {/* Student ID */}
      <Text style={styles.label}>Student ID</Text>
      <TextInput
        style={styles.input}
        value={form.studentid}
        onChangeText={(text) => handleChange('studentid', text)}
        placeholder="Enter your student ID"
      />

      {/* Course Section */}
      <Text style={styles.label}>Course Section</Text>
      <TextInput
        style={styles.input}
        value={form.courseSection}
        onChangeText={(text) => handleChange('courseSection', text)}
        placeholder="Enter your course section"
      />

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.gender}
          onValueChange={(value) => handleChange('gender', value)}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* Profile Image Section */}
      <Text style={styles.label}>Profile Image</Text>
      <TouchableOpacity onPress={handleChooseImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>Choose Profile Image</Text>
      </TouchableOpacity>
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.profileImagePreview} />
      )}

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 70,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // New styles for the image section
  imageButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
});
