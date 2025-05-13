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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import Sidebar from './Sidebar'; // Make sure this path is correct

export default function AddBookScreen() {
  const [image, setImage] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [bookId, setBookId] = useState('');
  const [pubDate, setPubDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/img/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Sidebar Modal */}
      <Modal visible={isSidebarVisible} animationType="slide" transparent={true}>
        <View style={styles.sidebarModal}>
          <Sidebar onClose={() => setSidebarVisible(false)} />
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setSidebarVisible(false)}
          />
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
          <Text style={styles.label}>Book Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter book title"
            value={bookTitle}
            onChangeText={setBookTitle}
          />

          <Text style={styles.label}>Author</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter author"
            value={author}
            onChangeText={setAuthor}
          />

          <Text style={styles.label}>Book ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter book ID"
            value={bookId}
            onChangeText={setBookId}
          />

          <Text style={styles.label}>Publication Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter publication date"
            value={pubDate}
            onChangeText={setPubDate}
          />

          <Text style={styles.label}>Book Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter book description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Book Cover Image</Text>
          <View style={styles.fileBox}>
            <TouchableOpacity style={styles.chooseFileButton} onPress={pickImage}>
              <Text style={styles.chooseFileText}>Choose File</Text>
            </TouchableOpacity>
            <Text style={styles.fileName}>
              {image ? image.split('/').pop() : 'No file chosen'}
            </Text>
          </View>

          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} />
          )}

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  sidebarModal: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center', // vertically center
    alignItems: 'center',     // horizontally center
    padding: 24,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
    marginLeft: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  form: {
    backgroundColor: '#ffffffcc',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    maxWidth: 500, // max width for large screens
  },
  
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chooseFileButton: {
    backgroundColor: '#4e73df',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  chooseFileText: {
    color: '#fff',
    fontWeight: '600',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#1cc88a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
