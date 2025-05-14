// RegisterScreen.jsx
import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullname, setFullname]           = useState('');
  const [email, setEmail]                 = useState('');
  const [studentid, setStudentid]         = useState('');
  const [courseSection, setCourseSection] = useState('');
  const [gender, setGender]               = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone_number, setPhoneNumber]    = useState('');
  const [passwordVisible, setPasswordVisible]         = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading]         = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match!');
    }
    if (!fullname || !email || !studentid || !courseSection || !gender || !phone_number) {
      return Alert.alert('Error', 'Please fill out all fields.');
    }

    setIsLoading(true);
    try {
      // 1️⃣ Create user in Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid      = userCred.user.uid;

      // 2️⃣ Save additional profile info in Firestore
      await setDoc(doc(db, 'users', uid), {
        fullname,
        email,
        studentid,
        courseSection,
        gender,
        phone_number,
        role: 0,  
        createdAt: new Date()
      });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      let message = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'That email is already in use.';
          break;
        case 'auth/invalid-email':
          message = 'That email address is invalid.';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters.';
          break;
      }
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(v => !v);
    } else {
      setConfirmPasswordVisible(v => !v);
    }
  };

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
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#ccc"
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
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

          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => togglePasswordVisibility('password')}>
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => togglePasswordVisibility('confirmPassword')}>
              <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  selectOption: {
    padding: 10,
    backgroundColor: '#2E3B4E',
    color: 'gray',
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#1F3B42',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
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