import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Profile from './Profile';

const books = [
  {
    id: '1',
    title: 'Nature',
    author: 'Olivia Wilson',
    status: 'Borrowed',
    image: require('../assets/images/img/nature-1.jpg'),
  },
  {
    id: '2',
    title: 'Writing You In The Stars',
    author: 'Samysa Hamida',
    status: 'Available',
    image: require('../assets/images/img/nature-2.jpg'),
  },
  {
    id: '3',
    title: 'SOUL',
    author: 'Olivia Wilson',
    status: 'Borrowed',
    image: require('../assets/images/img/nature-1.jpg'),
  },
  {
    id: '4',
    title: 'Writing You In The Stars',
    author: 'Samysa Hamida',
    status: 'Available',
    image: require('../assets/images/img/nature-2.jpg'),
  },
];

const App = () => {
  const [search, setSearch] = useState('');
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [transactionHistory, setTransactionHistory] = useState([
    {
      id: 'txn1',
      bookTitle: 'Nature',
      bookAuthor: 'Olivia Wilson',
      requestType: 'Borrow',
      startDate: '2025-04-10',
      returnDate: '2025-04-17',
    },
    {
      id: 'txn2',
      bookTitle: 'Writing You In The Stars',
      bookAuthor: 'Samysa Hamida',
      requestType: 'Reserve',
      startDate: '2025-04-15',
      returnDate: '2025-04-22',
    },
  ]);

  const [requestType, setRequestType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleLogout = () => {
    console.log('Logout pressed');
    setIsLoggedIn(false);
    setProfileModalVisible(false);
  };

  const navigateToProfile = () => {
    setProfileModalVisible(false);
    setShowProfile(true);
  };

  const handleTransactionSubmit = () => {
    const newTransaction = {
      id: Math.random().toString(36).substring(7),
      bookTitle: selectedBook.title,
      bookAuthor: selectedBook.author,
      requestType,
      startDate,
      returnDate,
    };

    setTransactionHistory([...transactionHistory, newTransaction]);
    setBookModalVisible(false);
    setRequestType('');
    setStartDate('');
    setReturnDate('');
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => {
        setSelectedBook(item);
        setBookModalVisible(true);
      }}
    >
      <Image source={item.image} style={styles.bookImage} />
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.author}</Text>
      <Text
        style={[
          styles.bookStatus,
          item.status === 'Available' ? styles.available : styles.borrowed,
        ]}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text>{item.bookTitle} by {item.bookAuthor}</Text>
      <Text>Type: {item.requestType}</Text>
      <Text>Start Date: {item.startDate}</Text>
      <Text>Return Date: {item.returnDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          {showProfile ? (
            <Profile />
          ) : (
            <>
              <View style={styles.mainContent}>
                <View style={styles.navbar}>
                  <Image
                    source={require('../assets/images/img/logo2.png')}
                    style={styles.logo}
                  />
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Search for books..."
                    value={search}
                    onChangeText={setSearch}
                  />
                  <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => setProfileModalVisible(true)}
                  >
                    <Text style={styles.profileText}>U</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                  {activeTab === 'home' ? (
                    <FlatList
                      data={books}
                      keyExtractor={(item) => item.id}
                      numColumns={2}
                      renderItem={renderBookItem}
                    />
                  ) : (
                    <View style={styles.transactionSection}>
                      <Text style={styles.transactionText}>Transaction History</Text>
                      {transactionHistory.length === 0 ? (
                        <Text>No transactions found.</Text>
                      ) : (
                        <FlatList
                          data={transactionHistory}
                          keyExtractor={(item) => item.id}
                          renderItem={renderTransactionItem}
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.navButton, activeTab === 'home' && styles.activeNavButton]}
                  onPress={() => setActiveTab('home')}
                >
                  <Text style={[styles.navButtonText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, activeTab === 'transaction' && styles.activeNavButton]}
                  onPress={() => setActiveTab('transaction')}
                >
                  <Text style={[styles.navButtonText, activeTab === 'transaction' && styles.activeNavText]}>Transaction</Text>
                </TouchableOpacity>
              </View>

              <Modal visible={bookModalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Request Book</Text>
                    <Text>Request Type:</Text>
                    <TextInput
                      placeholder="Borrow or Reserve"
                      style={styles.input}
                      value={requestType}
                      onChangeText={setRequestType}
                    />
                    <Text>Start Date:</Text>
                    <TextInput
                      placeholder="YYYY-MM-DD"
                      style={styles.input}
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                    <Text>Return Date:</Text>
                    <TextInput
                      placeholder="YYYY-MM-DD"
                      style={styles.input}
                      value={returnDate}
                      onChangeText={setReturnDate}
                    />
                    <View style={styles.modalActions}>
                      <Button title="Cancel" onPress={() => setBookModalVisible(false)} />
                      <Button title="Submit Request" onPress={handleTransactionSubmit} />
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal visible={profileModalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Profile Options</Text>
                    <TouchableOpacity onPress={navigateToProfile}>
                      <Text style={styles.modalOption}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                      <Text style={styles.modalOption}>Logout</Text>
                    </TouchableOpacity>
                    <View style={styles.modalActions}>
                      <Button title="Cancel" onPress={() => setProfileModalVisible(false)} />
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          )}
        </>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>You have logged out</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainContent: { flex: 1, paddingBottom: 70 },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#002D62',
    marginTop: -10,
  },
  logo: { width: 120, height: 40, resizeMode: 'contain' },
  searchBar: {
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: { fontSize: 18, fontWeight: 'bold' },
  contentContainer: { flex: 1 },
  bookCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  bookImage: {
    width: 150,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  bookTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  bookAuthor: { fontSize: 14, color: '#555' },
  bookStatus: { marginTop: 5, fontSize: 12, fontWeight: 'bold' },
  available: { color: 'green' },
  borrowed: { color: 'red' },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', marginBottom: 15, padding: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalOption: { fontSize: 16, marginVertical: 10 },
  transactionSection: { marginTop: 30 },
  transactionText: { fontSize: 18, fontWeight: 'bold' },

  navButton: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  activeNavButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 5,
  },
  navButtonText: { fontSize: 16, color: '#555' },
  activeNavText: { color: '#fff' },

  tabContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default App;
