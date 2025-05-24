import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditProfile() {
  const navigation = useNavigation();
  const [fullname, setFullname] = useState('');
  const [studentid, setStudentid] = useState('');
  const [courseSection, setCourseSection] = useState('');
  const [gender, setGender] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load current user profile from Firestore
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Error', 'No user logged in');
          navigation.navigate('Login');
          return;
        }
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullname(data.fullname || '');
          setStudentid(data.studentid || '');
          setCourseSection(data.courseSection || '');
          setGender(data.gender || '');
          setPhoneNumber(data.phone_number || '');
        } else {
          Alert.alert('Error', 'User profile not found!');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigation]);

  const handleUpdate = async () => {
    if (!fullname || !studentid || !courseSection || !gender || !phone_number) {
      return Alert.alert('Error', 'Please fill out all fields.');
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No user logged in');
        navigation.navigate('Login');
        return;
      }
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        fullname,
        studentid,
        courseSection,
        gender,
        phone_number,
        updatedAt: new Date(),
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1e9e9d" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../assets/images/img/sign.jpg')} style={styles.backgroundImage} />
        <View style={styles.overlay} />

        <View style={styles.formContainer}>
          <Image source={require('../assets/images/img/logo2.png')} style={styles.logo} />
          <Text style={styles.title}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#ccc"
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            style={styles.input}
            placeholder="Student ID"
            placeholderTextColor="#ccc"
            value={studentid}
            onChangeText={setStudentid}
          />
          <TextInput
            style={styles.input}
            placeholder="Course & Section"
            placeholderTextColor="#ccc"
            value={courseSection}
            onChangeText={setCourseSection}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={phone_number}
            onChangeText={setPhoneNumber}
          />

          <View style={[styles.input, { padding: 0 }]}>
            <Text style={styles.selectLabel}>Gender</Text>
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('User')} style={{ marginTop: 10 }}>
            <Text style={[styles.loginLink, { textAlign: 'center' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 28, 45, 0.9)',
  },
  formContainer: {
    backgroundColor: '#081c2d',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0a2a43',
    color: '#ccc',
    borderWidth: 1,
    borderColor: '#2b3e55',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  selectLabel: {
    color: '#ccc',
    marginBottom: 8,
  },
  picker: {
    color: '#ccc',
    backgroundColor: '#0a2a43',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#1e9e9d',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    color: '#1e9e9d',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  logo: {
    width: 220,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
