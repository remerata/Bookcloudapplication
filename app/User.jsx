// User.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  FlatList, Modal, Button, ActivityIndicator,
  StyleSheet, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Profile from './Profile';

import { db, auth } from '../firebaseConfig';
import {
  collection, onSnapshot, query, orderBy,
  addDoc, updateDoc, doc, getDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function User() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);

  // form state
  const [requestType, setRequestType] = useState('Borrow');
  const [startDate, setStartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const [transactionHistory, setTransactionHistory] = useState([]);

  // Load books
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'books'), orderBy('createdAt', 'desc')),
      snap => {
        setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Load this user's transactions
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'transactions'),
      snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const mine = all
          .filter(tx => tx.userId === auth.currentUser?.uid)
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setTransactionHistory(mine);
      }
    );
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowProfile(false);
    setProfileModalVisible(false);
  };
  const navigateToProfile = () => {
    setProfileModalVisible(false);
    setShowProfile(true);
  };

  // Open modal only if book is currently available
  const openBookModal = book => {
    setSelectedBook(book);
    setRequestType('Borrow');
    setStartDate(new Date());
    setReturnDate(new Date());
    setBookModalVisible(true);
  };

  const handleTransactionSubmit = async () => {
    if (!auth.currentUser || !selectedBook) return;

    // Prevent double‑booking
    if (selectedBook.status !== 'Available') {
      Alert.alert('Unavailable', 'This book is not currently available.');
      return;
    }

    try {
      // 1) Fetch full name
      const u = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const fullname = u.exists() ? u.data().fullname : auth.currentUser.email;

      // 2) Create transaction (Pending)
      await addDoc(collection(db, 'transactions'), {
        userId: auth.currentUser.uid,
        requesterName: fullname,
        bookId: selectedBook.id,
        bookTitle: selectedBook.bookTitle,
        requestType,
        startDate: startDate.toISOString(),
        returnDate: returnDate.toISOString(),
        createdAt: new Date(),
        status: 'Pending',
      });

      // 3) Mark book Pending
      await updateDoc(doc(db, 'books', selectedBook.id), {
        status: 'Pending',
        type: requestType,
        requester: auth.currentUser.uid,
        requesterName: fullname,
        startDate: startDate.toISOString(),
        dueDate: returnDate.toISOString(),
      });

      setBookModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not submit request');
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => openBookModal(item)}
      disabled={item.status !== 'Available'}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.bookImage}/>
      <Text style={styles.bookTitle}>{item.bookTitle}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      <Text style={[
        styles.bookStatus,
        item.status === 'Available' ? styles.available : styles.borrowed
      ]}>
        {item.status || 'Available'}
      </Text>
    </TouchableOpacity>
  );

  const renderTransactionItem = ({ item }) => {
    const status = item.status || 'Pending';
    const map = {
      Pending: styles.txPending,
      Approved: styles.txApproved,
      Rejected: styles.txRejected,
      Borrowed: styles.txBorrowed,
      Reserved: styles.txReserved,
      Returned: styles.txReturned,
    };
    const style = map[status] || styles.txPending;

    return (
      <View style={styles.transactionItem}>
        <Text style={styles.txBookTitle}>{item.bookTitle}</Text>
        <Text>Action: {item.requestType}</Text>
        <Text>From: {new Date(item.startDate).toDateString()}</Text>
        <Text>To: {new Date(item.returnDate).toDateString()}</Text>
        <Text style={[styles.txStatus, style]}>Status: {status}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large"/>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showProfile ? <Profile/> : <>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={()=>setProfileModalVisible(true)}>
            <Icon name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        {activeTab==='home' ? (
          <FlatList
            key="homeList"
            data={books.filter(b =>
              b.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
              b.author?.toLowerCase().includes(search.toLowerCase()) ||
              b.status?.toLowerCase().includes(search.toLowerCase())
            )}
            numColumns={2}
            keyExtractor={i=>i.id}
            renderItem={renderBookItem}
          />
        ) : (
          <FlatList
            key="txList"
            data={transactionHistory}
            keyExtractor={i=>i.id}
            renderItem={renderTransactionItem}
            ListEmptyComponent={<Text style={styles.emptyText}>No transactions</Text>}
          />
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['home','transaction'].map(tab=>(
            <TouchableOpacity
              key={tab}
              style={[styles.navButton, activeTab===tab && styles.activeNavButton]}
              onPress={()=>setActiveTab(tab)}
            >
              <Icon
                name={tab==='home'?'home-outline':'swap-horizontal-outline'}
                size={24}
                color={activeTab===tab?'#fff':'#000'}
              />
              <Text style={activeTab===tab?{color:'#fff'}:undefined}>
                {tab==='home'?'Home':'My Requests'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Request Modal */}
        <Modal visible={bookModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Request Book</Text>
              <Picker
                selectedValue={requestType}
                onValueChange={setRequestType}
                style={styles.picker}
              >
                <Picker.Item label="Borrow" value="Borrow"/>
                <Picker.Item label="Reserve" value="Reserve"/>
              </Picker>
              <TouchableOpacity onPress={()=>setShowStartPicker(true)}>
                <Text style={styles.dateText}>From: {startDate.toDateString()}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(e,d)=>{ setShowStartPicker(false); d&&setStartDate(d); }}
                />
              )}
              <TouchableOpacity onPress={()=>setShowReturnPicker(true)}>
                <Text style={styles.dateText}>To: {returnDate.toDateString()}</Text>
              </TouchableOpacity>
              {showReturnPicker && (
                <DateTimePicker
                  value={returnDate}
                  mode="date"
                  display="default"
                  onChange={(e,d)=>{ setShowReturnPicker(false); d&&setReturnDate(d); }}
                />
              )}
              <View style={styles.modalActions}>
                <Button title="Cancel" onPress={()=>setBookModalVisible(false)}/>
                <Button
                  title="Submit"
                  onPress={handleTransactionSubmit}
                  disabled={selectedBook?.status !== 'Available'}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Profile Modal */}
        <Modal visible={profileModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Button title="Edit Profile" onPress={navigateToProfile}/>
              <Button title="Logout" onPress={handleLogout}/>
              <Button title="Cancel" onPress={()=>setProfileModalVisible(false)}/>
            </View>
          </View>
        </Modal>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},
  centered:{flex:1,justifyContent:'center',alignItems:'center'},
  navbar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10,backgroundColor:'#002D62'},
  searchBar:{flex:1,backgroundColor:'#fff',borderRadius:8,padding:8,marginRight:10},
  bookCard:{flex:1,margin:10,alignItems:'center',opacity:1},
  bookImage:{width:120,height:160,borderRadius:8,marginBottom:8},
  bookTitle:{fontWeight:'bold'},
  bookAuthor:{color:'#666'},
  bookStatus:{marginTop:4},
  available:{color:'green'},
  borrowed:{color:'red'},

  tabContainer:{flexDirection:'row',justifyContent:'space-around',backgroundColor:'#eee',paddingVertical:10},
  navButton:{alignItems:'center'},
  activeNavButton:{backgroundColor:'#002D62',padding:6,borderRadius:6},

  modalContainer:{flex:1,justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'},
  modalContent:{backgroundColor:'#fff',margin:20,padding:20,borderRadius:8},
  modalTitle:{fontSize:18,fontWeight:'bold',marginBottom:10},
  picker:{height:50,width:'100%',marginBottom:10},
  dateText:{fontSize:16,marginVertical:8},
  modalActions:{flexDirection:'row',justifyContent:'space-between',marginTop:10},

  transactionItem:{padding:10,borderBottomWidth:1,borderColor:'#ddd'},
  txBookTitle:{fontWeight:'bold'},
  txStatus:{marginTop:4,fontWeight:'bold'},
  txPending:{color:'#FFA500'},
  txApproved:{color:'green'},
  txRejected:{color:'red'},
  txBorrowed:{color:'#1E90FF'},
  txReserved:{color:'#8A2BE2'},
  txReturned:{color:'#32CD32'},

  emptyText:{textAlign:'center',marginTop:20}
});
