// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Sidebar from './Sidebar';
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const Dashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const [totalBooks, setTotalBooks] = useState(0);
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [totalReserves, setTotalReserves] = useState(0);
  const [topBorrowedBooks, setTopBorrowedBooks] = useState([]);
  const [recentActions, setRecentActions] = useState([]);

  useEffect(() => {
    // Listen for book counts & statuses
    const booksRef = collection(db, 'books');
    const unsubBooks = onSnapshot(booksRef, snap => {
      setTotalBooks(snap.size);
      const borrowedCount = snap.docs.filter(d => d.data().status === 'Borrowed').length;
      setTotalBorrows(borrowedCount);
      const reservedCount = snap.docs.filter(d => d.data().status === 'Reserved').length;
      setTotalReserves(reservedCount);
    });

    // Listen for transactions
    const txRef = collection(db, 'transactions');
    const txQuery = query(txRef, orderBy('createdAt', 'desc'));
    const unsubTx = onSnapshot(txQuery, snap => {
      const txns = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Top 5 borrowed
      const counts = {};
      txns.forEach(t => {
        if (t.requestType === 'Borrow') {
          counts[t.bookTitle] = (counts[t.bookTitle] || 0) + 1;
        }
      });
      const top5 = Object.entries(counts)
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopBorrowedBooks(top5);

      // Recent actions (last 5)
      setRecentActions(
        txns.slice(0, 5).map(t => ({
          id: t.id,
          title: t.bookTitle,
          action:
            t.status === 'Approved'
              ? 'Approved'
              : t.status === 'Rejected'
              ? 'Rejected'
              : t.requestType,
          user: t.requesterName || t.userId,
          date: t.createdAt.toDate
            ? t.createdAt.toDate().toLocaleString()
            : new Date(t.createdAt.seconds * 1000).toLocaleString(),
        }))
      );
    });

    return () => {
      unsubBooks();
      unsubTx();
    };
  }, []);

  const renderCard = (icon, title, value) => (
    <View style={styles.card}>
      <FontAwesome5 name={icon} size={32} color="#4e73df" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  const renderActionItem = ({ item }) => (
    <View style={styles.listRow}>
      <Text style={styles.listText}>{item.title}</Text>
      <Text
        style={[
          styles.listText,
          item.action === 'Approved' ? styles.green : styles.red,
        ]}
      >
        {item.action}
      </Text>
      <Text style={styles.listText}>{item.user}</Text>
      <Text style={styles.listText}>{item.date}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setSidebarVisible(true)}
        >
          <FontAwesome5 name="bars" size={24} color="#2d3748" />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        {renderCard('book', 'Total Books', totalBooks)}
        {renderCard('book-reader', 'Total Borrows', totalBorrows)}
        {renderCard('bookmark', 'Total Reserves', totalReserves)}
      </View>

      {/* Top 5 Most Borrowed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 Most Borrowed Books</Text>
        {topBorrowedBooks.map((item, i) => (
          <View key={i} style={styles.listRow}>
            <Text style={styles.listText}>{item.title}</Text>
            <Text style={styles.listText}>{item.count}</Text>
          </View>
        ))}
      </View>

      {/* Recent Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Book Actions History</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/images/img/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <Modal visible={isSidebarVisible} animationType="slide" transparent>
        <View style={styles.sidebarModal}>
          <Sidebar onClose={() => setSidebarVisible(false)} />
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setSidebarVisible(false)}
          />
        </View>
      </Modal>

      <FlatList
        data={recentActions}
        keyExtractor={item => item.id}
        renderItem={renderActionItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 20 }}
      />
    </ImageBackground>
  );
};

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
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    marginRight: 15,
  },

  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    width: '30%',
    minWidth: 100,
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 8,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4e73df',
    marginTop: 4,
  },

  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  listText: {
    fontSize: 14,
    flex: 1,
    marginHorizontal: 2,
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
});

export default Dashboard;
