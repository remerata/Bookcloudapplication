import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('User'); // Go directly to User screen
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Image source={require('../assets/images/img/sign.jpg')} style={styles.backgroundImage} />
      <View style={styles.overlay} />

      <View style={styles.formContainer}>
        <Image source={require('../assets/images/img/logo2.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                      <Text style={styles.registerLink}>Register</Text>
                    </TouchableOpacity>
                  </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '80%',
    maxWidth: 400,
    zIndex: 1,
  },
  logo: {
    width: 220,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: '#1e9e9d',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  }, // <- 🔥 this comma was missing
  registerText: {
    color: '#ccc',
    fontSize: 14,
  },
  registerLink: {
    color: '#1e9e9d',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
