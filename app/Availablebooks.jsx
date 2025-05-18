// AvailableBooks.jsx
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
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Sidebar from './Sidebar';

// Firestore imports
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  getDocs,
  where,
} from 'firebase/firestore';

const AvailableBooks = () => {
  const [search, setSearch] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    status: '',
    image: '',
  });
  const [activeTab, setActiveTab] = useState('all');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need access to your media library to pick images.'
        );
      }
    })();

    const booksRef = collection(db, 'books');
    const q = query(booksRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setBooks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.error(err);
        setError('Failed to load books.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => setSidebarVisible(v => !v);

  // Open modal to edit
  const handleEdit = book => {
    setSelectedBook(book);
    setBookDetails({
      title: book.bookTitle,
      author: book.author,
      status: book.status || 'Available',
      image: book.coverUrl || '',
    });
  };

  // Save edited fields back to Firestore
  const handleSave = async () => {
    try {
      const bookRef = doc(db, 'books', selectedBook.id);
      await updateDoc(bookRef, {
        bookTitle: bookDetails.title,
        author: bookDetails.author,
        status: bookDetails.status,
        coverUrl: bookDetails.image,
      });
      Alert.alert('Success', 'Book details updated!');
      setSelectedBook(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update book.');
    }
  };

  // Delete a book document
  const handleDelete = book =>
    Alert.alert('Confirm', `Delete "${book.bookTitle}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'books', book.id));
            Alert.alert('Deleted', 'Book has been removed.');
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to delete book.');
          }
        },
      },
    ]);

  // Update matching pending transaction(s)
  const updateTransactionStatus = async (bookId, newStatus) => {
    const txSnap = await getDocs(
      query(
        collection(db, 'transactions'),
        where('bookId', '==', bookId),
        where('status', '==', 'Pending')
      )
    );
    txSnap.forEach(docSnap => {
      updateDoc(doc(db, 'transactions', docSnap.id), { status: newStatus });
    });
  };

  // Approve a pending request
  const approveRequest = async book => {
    try {
      const bookRef = doc(db, 'books', book.id);
      const newStatus = book.type === 'Reserve' ? 'Reserved' : 'Borrowed';
      await updateDoc(bookRef, {
        status: newStatus,
        type: '',
        borrower: newStatus === 'Borrowed' ? book.requesterId : '',
        reserver: newStatus === 'Reserved' ? book.requesterId : '',
        dueDate: book.dueDate,
        requesterId: '',
        requesterName: '',
        requesterPhone: '',
      });
      await updateTransactionStatus(book.id, newStatus);
      Alert.alert('Request approved');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to approve request.');
    }
  };

  // Reject a pending request
  const rejectRequest = async book => {
    try {
      const bookRef = doc(db, 'books', book.id);
      await updateDoc(bookRef, {
        status: 'Available',
        type: '',
        requesterId: '',
        requesterName: '',
        requesterPhone: '',
        startDate: '',
        dueDate: '',
      });
      await updateTransactionStatus(book.id, 'Rejected');
      Alert.alert('Request rejected');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to reject request.');
    }
  };

  // Return a borrowed/reserved book
  const returnBook = async book => {
    try {
      const bookRef = doc(db, 'books', book.id);
      await updateDoc(bookRef, {
        status: 'Available',
        borrower: '',
        reserver: '',
        dueDate: '',
      });
      await addDoc(collection(db, 'transactions'), {
        bookId: book.id,
        action: 'Return',
        userId: book.requesterId,
        userName: book.requesterName,
        userPhone: book.requesterPhone,
        timestamp: serverTimestamp(),
        status: 'Returned',
      });
      await updateTransactionStatus(book.id, 'Returned');
      Alert.alert('Book returned and recorded');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to return book.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length) {
      setBookDetails(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const filteredBooks = books.filter(book => {
    const searchLower = search.toLowerCase();
    return (
      (book.bookTitle || '').toLowerCase().includes(searchLower) ||
      (book.author || '').toLowerCase().includes(searchLower) ||
      (book.status || '').toLowerCase().includes(searchLower) ||
      (book.type || '').toLowerCase().includes(searchLower) ||
      (book.requesterName || '').toLowerCase().includes(searchLower) ||
      (book.borrower || '').toLowerCase().includes(searchLower) ||
      (book.reserver || '').toLowerCase().includes(searchLower) ||
      (book.dueDate || '').toLowerCase().includes(searchLower)
    );
  });
  

  const renderTabContent = () => {
    if (loading) return <ActivityIndicator size="large" />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;

    switch (activeTab) {
      case 'all':
        return (
          <FlatList
            data={filteredBooks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookRow}>
                <Image
                  source={{ uri: item.coverUrl || 'https://via.placeholder.com/100' }}
                  style={styles.bookCover}
                />
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                  <Text style={styles.bookAuthor}>{item.author}</Text>
                  <Text style={styles.bookStatus}>{item.status || 'Available'}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No books found</Text>}
          />
        );

      case 'requests':
        return (
          <FlatList
            data={books.filter(b => b.status === 'Pending')}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookRow}>
                <View style={styles.bookDetails}>
                  <Text >Book Tittle: {item.bookTitle}</Text>
                     <Text>
                    Requester: {item.requesterName} 
                  </Text><Text>Type: {item.type}</Text>
                  <Text>Status: {item.status}</Text>
               
                </View>
                <View style={styles.actionButtons}>
                  <Button title="Approve" onPress={() => approveRequest(item)} color="green" />
                  <Button title="Reject" onPress={() => rejectRequest(item)} color="red" />
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No requests</Text>}
          />
        );

      case 'borrowed':
        return (
          <FlatList
            data={books.filter(b => b.status === 'Borrowed')}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookRow}>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                  <Text>
                    Borrower: {item.requesterName}
                  </Text>
                  <Text>Due: {item.dueDate}</Text>
                </View>
                <Button title="Return" onPress={() => returnBook(item)} color="green" />
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No borrowed books</Text>}
          />
        );

      case 'reserved':
        return (
          <FlatList
            data={books.filter(b => b.status === 'Reserved')}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookRow}>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                  <Text>
                    Reserved by: {item.requesterName} 
                  </Text>
                  <Text>Due: {item.dueDate}</Text>
                </View>
                <Button title="Return" onPress={() => returnBook(item)} color="green" />
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No reservations</Text>}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/img/background.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar}>
            <Text style={styles.hamburger}>☰</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={sidebarVisible} animationType="slide" transparent>
          <View style={styles.sidebarModal}>
            <Sidebar />
            <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
          </View>
        </Modal>
        <TextInput
  style={{
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  }}
  placeholder="Search by title, author, status, requester, etc."
  value={search}
  onChangeText={setSearch}
/>
        <View style={styles.statsContainer}>
          {['all', 'requests', 'borrowed', 'reserved'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.statBox, activeTab === tab && styles.activeStat]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={styles.statTitle}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bookList}>{renderTabContent()}</View>

        {/* Edit Modal */}
        <Modal visible={!!selectedBook} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Book</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Title"
                value={bookDetails.title}
                onChangeText={t => setBookDetails({ ...bookDetails, title: t })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Author"
                value={bookDetails.author}
                onChangeText={t => setBookDetails({ ...bookDetails, author: t })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Status"
                value={bookDetails.status}
                onChangeText={t => setBookDetails({ ...bookDetails, status: t })}
              />
              <TouchableOpacity style={styles.chooseFileButton} onPress={pickImage}>
                <Text style={styles.chooseFileText}>Choose Cover</Text>
              </TouchableOpacity>
              {bookDetails.image && (
                <Image source={{ uri: bookDetails.image }} style={styles.selectedImage} />
              )}
              <View style={styles.modalActions}>
                <Button title="Save" onPress={handleSave} />
                <Button title="Cancel" onPress={() => setSelectedBook(null)} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  background: { flex: 1, width: '100%', height: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginLeft: 15 },
  hamburger: { fontSize: 30, marginRight: 10 },
  sidebarModal: { flex: 1, flexDirection: 'row' },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    justifyContent: 'space-evenly',
    marginHorizontal: 15,
    marginTop: 20,
  },
  statBox: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStat: { backgroundColor: '#2563eb' },
  statTitle: { fontSize: 11, color: '#fff' },
  bookList: { marginTop: 20 },
  bookRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
  },
  bookCover: { width: 50, height: 75, marginRight: 10 },
  bookDetails: { flex: 1 },
  bookTitle: { fontSize: 14, fontWeight: '500' },
  bookAuthor: { fontSize: 12, color: '#555' },
  bookStatus: { fontSize: 12, color: '#2589ec' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 110,
    marginRight: 35,
  },
  actionButton: { padding: 5, borderRadius: 6 },
  editButton: { backgroundColor: '#3b82f6' },
  deleteButton: { backgroundColor: '#f87171' },
  actionText: { color: '#fff' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  chooseFileButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  chooseFileText: { color: '#fff', textAlign: 'center' },
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
});

export default AvailableBooks;
