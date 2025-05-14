// User.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  FlatList, Modal, Button, ActivityIndicator,
  StyleSheet, Platform, Alert
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
    const booksRef = collection(db, 'books');
    const q = query(booksRef, orderBy('createdAt','desc'));
    const unsub = onSnapshot(q, snap => {
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Load this user's transactions
  useEffect(() => {
    const txRef = collection(db,'transactions');
    const unsub = onSnapshot(txRef, snap => {
      const all = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      const mine = all
        .filter(tx=> tx.userId===auth.currentUser?.uid)
        .sort((a,b)=> b.createdAt.toMillis()-a.createdAt.toMillis());
      setTransactionHistory(mine);
    });
    return ()=>unsub();
  },[]);

  const handleLogout = async () => {
    await signOut(auth);
    setShowProfile(false);
    setProfileModalVisible(false);
  };
  const navigateToProfile = () => {
    setProfileModalVisible(false);
    setShowProfile(true);
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
    setRequestType('Borrow');
    setStartDate(new Date());
    setReturnDate(new Date());
    setBookModalVisible(true);
  };

  const handleTransactionSubmit = async () => {
    if (!auth.currentUser || !selectedBook) return;
    try {
      // 1️⃣ Lookup user full name
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const fullname = userDoc.exists() ? userDoc.data().fullname : auth.currentUser.email;

      // 2️⃣ write a transaction record
      await addDoc(collection(db,'transactions'), {
        userId: auth.currentUser.uid,
        requesterName: fullname,
        bookId: selectedBook.id,
        bookTitle: selectedBook.bookTitle,
        requestType,
        startDate: startDate.toISOString(),
        returnDate: returnDate.toISOString(),
        createdAt: new Date()
      });

      // 3️⃣ update the book doc to Pending + store requesterName
      const bookRef = doc(db,'books',selectedBook.id);
      await updateDoc(bookRef, {
        status: 'Pending',
        type: requestType,
        requester: auth.currentUser.uid,
        requesterName: fullname,
        startDate: startDate.toISOString(),
        dueDate: returnDate.toISOString()
      });

      setBookModalVisible(false);
    } catch(err) {
      console.error(err);
      Alert.alert('Error','Could not submit request');
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity style={styles.bookCard} onPress={()=>openBookModal(item)}>
      <Image source={{uri:item.coverUrl}} style={styles.bookImage}/>
      <Text style={styles.bookTitle}>{item.bookTitle}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      <Text style={[
        styles.bookStatus,
        item.status==='Available'?styles.available: styles.borrowed
      ]}>
        {item.status||'Available'}
      </Text>
    </TouchableOpacity>
  );
  const renderTransactionItem = ({item})=>(
    <View style={styles.transactionItem}>
      <Text>{item.bookTitle}</Text>
      <Text>Type: {item.requestType}</Text>
      <Text>From: {new Date(item.startDate).toDateString()}</Text>
      <Text>To: {new Date(item.returnDate).toDateString()}</Text>
    </View>
  );

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large"/>
      <Text>Loading...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showProfile ? <Profile /> : <>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={()=>setProfileModalVisible(true)}>
            <Icon name="person-circle-outline" size={28} />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        {activeTab==='home' ? (
          <FlatList
            data={books.filter(b=>b.bookTitle.toLowerCase().includes(search.toLowerCase()))}
            keyExtractor={i=>i.id}
            numColumns={2}
            renderItem={renderBookItem}
          />
        ) : (
          <FlatList
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
              style={[styles.navButton,activeTab===tab&&styles.activeNavButton]}
              onPress={()=>setActiveTab(tab)}
            >
              <Icon
                name={tab==='home'?'home-outline':'swap-horizontal-outline'}
                size={24}
                color={activeTab===tab?'#fff':'#000'}
              />
              <Text>{tab==='home'?'Home':'My Requests'}</Text>
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
                  onChange={(e,d)=>{setShowStartPicker(false); d&&setStartDate(d);}}
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
                  onChange={(e,d)=>{setShowReturnPicker(false); d&&setReturnDate(d);}}
                />
              )}
              <View style={styles.modalActions}>
                <Button title="Cancel" onPress={()=>setBookModalVisible(false)}/>
                <Button title="Submit" onPress={handleTransactionSubmit}/>
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
  bookCard:{flex:1,margin:10,alignItems:'center'},
  bookImage:{width:120,height:160,borderRadius:8,marginBottom:8},
  bookTitle:{fontWeight:'bold'},
  bookAuthor:{color:'#666'},
  bookStatus:{marginTop:4},
  available:{color:'green'}, borrowed:{color:'red'},
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
  emptyText:{textAlign:'center',marginTop:20}
});
