// AddBookScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';

// Firestore imports
import { db } from '../firebaseConfig';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

// ── Cloudinary configuration ─────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME    = 'dkcxdvg92';
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset';
// ───────────────────────────────────────────────────────────────────────────────

// Sidebar component
import Sidebar from './Sidebar';

export default function AddBookScreen() {
  const [image, setImage]             = useState(null);
  const [bookTitle, setBookTitle]     = useState('');
  const [author, setAuthor]           = useState('');
  const [bookId, setBookId]           = useState('');
  const [pubDate, setPubDate]         = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      return Alert.alert('Permission required', 'Allow access to media library.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddBook = async () => {
    if (!bookTitle || !author || !bookId) {
      return Alert.alert('Error', 'Please fill in title, author, and ID.');
    }
    setIsLoading(true);

    try {
      let coverUrl = null;

      // 1️⃣ Upload to Cloudinary if image selected
      if (image) {
        const data = new FormData();
        data.append('file', {
          uri: image,
          type: 'image/jpeg',
          name: `upload_${Date.now()}.jpg`,
        });
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: data }
        );
        const json = await res.json();
        if (!json.secure_url) throw new Error('Cloudinary upload failed');
        coverUrl = json.secure_url;
      }

      // 2️⃣ Add book record to Firestore
      await addDoc(collection(db, 'books'), {
        bookTitle,
        author,
        bookId,
        // store as Firestore Timestamp
        pubDate: Timestamp.fromDate(pubDate),
        description,
        coverUrl,
        createdAt: Timestamp.fromDate(new Date()),
      });

      Alert.alert('Success', 'Book added successfully!');
      // Clear form
      setBookTitle('');
      setAuthor('');
      setBookId('');
      setPubDate(new Date());
      setDescription('');
      setImage(null);

    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to add book.');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setPubDate(selectedDate);
  };

  return (
    <ImageBackground
      source={require('../assets/images/img/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Sidebar Modal */}
      <Modal visible={isSidebarVisible} animationType="slide" transparent>
        <View style={styles.sidebarModal}>
          <Sidebar onClose={() => setSidebarVisible(false)} />
          <TouchableOpacity style={styles.overlay} onPress={() => setSidebarVisible(false)} />
        </View>
      </Modal>

      {/* Header with Hamburger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <FontAwesome5 name="bars" size={24} color="#2d3748" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          {/* Input fields */}
          {[
            ['Book Title', bookTitle, setBookTitle],
            ['Author', author, setAuthor],
            ['Book ID', bookId, setBookId],
          ].map(([label, val, setter]) => (
            <React.Fragment key={label}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${label.toLowerCase()}`}
                value={val}
                onChangeText={setter}
              />
            </React.Fragment>
          ))}

          {/* Publication Date Picker */}
          <Text style={styles.label}>Publication Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{pubDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={pubDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Cover Image</Text>
          <View style={styles.fileBox}>
            <TouchableOpacity style={styles.chooseFileButton} onPress={pickImage}>
              <Text style={styles.chooseFileText}>Choose File</Text>
            </TouchableOpacity>
            <Text style={styles.fileName}>
              {image ? image.split('/').pop() : 'No file chosen'}
            </Text>
          </View>
          {image && <Image source={{ uri: image }} style={styles.previewImage} />}

          {/* Add Book Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddBook}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.addButtonText}>Add Book</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  sidebarModal: { flex: 1, flexDirection: 'row' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30, marginLeft: 10 },
  form: { backgroundColor: '#ffffffcc', borderRadius: 8, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, width: '100%', maxWidth: 500 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#f9f9f9', justifyContent: 'center' },
  descriptionInput: { height: 100, textAlignVertical: 'top' },
  fileBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  chooseFileButton: { backgroundColor: '#4e73df', padding: 10, borderRadius: 8, marginRight: 10 },
  chooseFileText: { color: '#fff', fontWeight: '600' },
  fileName: { flex: 1, fontSize: 14, color: '#444' },
  previewImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  addButton: { backgroundColor: '#1cc88a', padding: 15, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});