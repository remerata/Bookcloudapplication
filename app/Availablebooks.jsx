import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  ImageBackground,
  Alert,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Sidebar from './Sidebar';

const mockBooks = [
  { title: 'Book 1', author: 'Author 1', status: 'Available', image: '', type: '', requester: '', dueDate: '' },
  { title: 'Book 2', author: 'Author 2', status: 'Available', image: '', type: '', requester: '', dueDate: '' },
];

const mockRequests = [
  { 
    title: 'Book 3', 
    requester: 'John Doe', 
    type: 'borrow', 
    status: 'approved', 
    date: '2025-04-15' 
  },
  { 
    title: 'Book 4', 
    requester: 'Jane Smith', 
    type: 'reserve', 
    status: 'rejected', 
    date: '2025-04-16' 
  },
];


const mockBorrowed = [
  { title: 'Book 5', borrower: 'Alex Roe', dueDate: '2025-04-20' },
];

const mockReserved = [
  { title: 'Book 6', borrower: 'Emily Ray', dueDate: '2025-04-25' },
];

const AvailableBooks = () => {
  const [search, setSearch] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState({ title: '', author: '', status: '', image: '' });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your media library to pick images.');
      }
    })();
  }, []);

  const filteredBooks = mockBooks.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleEdit = (book) => {
    setSelectedBook(book);
    setBookDetails({ title: book.title, author: book.author, status: book.status, image: book.image });
  };
  const handleSave = () => { setSelectedBook(null); Alert.alert('Book details updated!'); };
  const handleDelete = (book) => Alert.alert('Confirm', `Delete ${book.title}?`, [
    { text: 'Cancel' },
    { text: 'Delete', onPress: () => Alert.alert(`${book.title} deleted.`) },
  ]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setBookDetails({ ...bookDetails, image: result.assets[0].uri });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return filteredBooks.map((book, index) => (
          <View key={index} style={styles.bookRow}>
            <Image source={require('../assets/images/img/nature-1.jpg')} style={styles.bookCover} />
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <Text style={styles.bookStatus}>{book.status}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEdit(book)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(book)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ));
      case 'requests':
        return (
          <>
            {mockRequests.map((item, index) => (
              <View key={index} style={styles.bookRow}>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  <Text>Requester: {item.requester}</Text>
                  <Text>Type: {item.type}</Text>
                  <Text>Status: {item.status}</Text>
                </View>
                <View style={styles.actionButtons}>
  <Button
    title="Approve"
    onPress={() => Alert.alert('Approved')}
    color="green"
  />
  <Button
    title="Reject"
    onPress={() => Alert.alert('Rejected')}
    color="red"
  />
</View>

              </View>
            ))}
           <View style={styles.historyContainer}>
  <Text style={styles.historyLabel}>History</Text>
  <FlatList
    data={mockRequests}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <View style={styles.historyItem}>
        <Text style={styles.historyText}>
          <Text style={styles.historyTitle}>{item.title}</Text> - 
          <Text style={styles.historyRequester}>{item.requester}</Text> - 
          <Text style={styles.historyType}>{item.type}</Text> - 
          <Text style={styles.historyDate}>{item.date}</Text> - 
          <Text style={item.status === 'approved' ? styles.statusApproved : styles.statusRejected}>
            {item.status === 'approved' ? 'Approved' : 'Rejected'}
          </Text>
        </Text>
      </View>
    )}
  />
</View>


          </>
        );
      case 'borrowed':
        return mockBorrowed.map((item, index) => (
          <View key={index} style={styles.bookRow}>
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>Borrower: {item.borrower}</Text>
              <Text>Due: {item.dueDate}</Text>
            </View>
            <Button title="Return" onPress={() => Alert.alert('Returned')} color="green" />
          </View>
        ));
      case 'reserved':
        return mockReserved.map((item, index) => (
          <View key={index} style={styles.bookRow}>
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>Reserved by: {item.borrower}</Text>
              <Text>Due: {item.dueDate}</Text>
            </View>
            <Button title="Cancel" onPress={() => Alert.alert('Reservation cancelled')} color="green" />
          </View>
        ));
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={require('../assets/images/img/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar}><Text style={styles.hamburger}>☰</Text></TouchableOpacity>
        </View>

        <Modal visible={sidebarVisible} animationType="slide" transparent={true}>
          <View style={styles.sidebarModal}>
            <Sidebar />
            <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
          </View>
        </Modal>

        <TextInput
          style={styles.searchBar}
          placeholder="Search for books..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.statsContainer}>
          {['all', 'requests', 'borrowed', 'reserved'].map((tab, i) => (
            <TouchableOpacity key={i} style={styles.statBox} onPress={() => setActiveTab(tab)}>
              <Text style={styles.statTitle}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bookList}>{renderTabContent()}</View>

        <Modal visible={selectedBook !== null} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Book</Text>
            {['title', 'author', 'status'].map((field, idx) => (
              <TextInput
                key={idx}
                style={styles.modalInput}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={bookDetails[field]}
                onChangeText={(text) => setBookDetails({ ...bookDetails, [field]: text })}
              />
            ))}
            <View style={styles.fileBox}>
              <TouchableOpacity style={styles.chooseFileButton} onPress={pickImage}>
                <Text style={styles.chooseFileText}>Choose File</Text>
              </TouchableOpacity>
              <Text style={styles.fileName}>{bookDetails.image ? bookDetails.image.split('/').pop() : 'No file chosen'}</Text>
              {bookDetails.image !== '' && <Image source={{ uri: bookDetails.image }} style={styles.selectedImage} />}
            </View>
            <View style={styles.modalActions}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={() => setSelectedBook(null)} />
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 15,
  },
  hamburger: { fontSize: 30, marginRight: 10 },
  headerText: { fontSize: 22, fontWeight: '600' },
  sidebarModal: { flex: 1, flexDirection: 'row' },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    margin: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // This ensures the items are evenly spaced
    marginHorizontal: 15,
    marginTop: 20,  // Increased the margin-top for better spacing
 
  },
  
  statBox: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTitle: { fontSize: 11, color: '#fff' },
  statValue: { fontSize: 12, color: '#fff' },
  bookList: { marginTop: 20 },
  bookRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginLeft: 15,
    marginRight: 15,

  },
  bookCover: { width: 50, height: 75, marginRight: 10 },
  bookDetails: { flex: 1 },
  bookTitle: { fontSize: 14, fontWeight: '500' },
  bookAuthor: { fontSize: 12, color: '#555' },
  bookStatus: { fontSize: 12, color: '#2589ec' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
    marginRight: 63,
    gap:5,
  },
  actionButton: { marginLeft: 10, padding: 5, borderRadius: 6 },
  editButton: { backgroundColor: '#3b82f6' },
  deleteButton: { backgroundColor: '#f87171' },
  actionText: { color: '#fff' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    paddingLeft: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  fileBox: { alignItems: 'center', marginBottom: 15 },
  chooseFileButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 6,
  },
  chooseFileText: { color: '#fff' },
  fileName: { marginTop: 10, color: '#333' },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  historyContainer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
  },
  historyLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 14,
  },
  historyTitle: {
    fontWeight: 'bold',
  },
  historyRequester: {
    color: '#555',
  },
  historyType: {
    color: '#888',
  },
  historyDate: {
    color: '#bbb',
  },
  statusApproved: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusRejected: {
    color: 'red',
    fontWeight: 'bold',
  },
  
  
});

export default AvailableBooks;
