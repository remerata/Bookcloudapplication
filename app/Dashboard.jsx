import React, { useState } from 'react';
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
import Sidebar from './Sidebar'; // Adjust the path if needed

const Dashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const totalBooks = 123;
  const totalBorrows = 456;
  const totalReturns = 789;

  const topBorrowedBooks = [
    { id: '1', title: 'Book Title 1', count: 10 },
    { id: '2', title: 'Book Title 2', count: 8 },
    { id: '3', title: 'Book Title 3', count: 7 },
    { id: '4', title: 'Book Title 4', count: 6 },
    { id: '5', title: 'Book Title 5', count: 5 },
  ];

  const recentActions = [
    { id: '1', title: 'Sample Book', action: 'Returned', user: 'John Doe', date: 'Apr 5, 2025, 03:00 PM' },
    { id: '2', title: 'Another Book', action: 'Reservation Cancelled', user: 'Jane Smith', date: 'Apr 4, 2025, 10:30 AM' },
  ];

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
      <Text style={[styles.listText, item.action === 'Returned' ? styles.green : styles.red]}>
        {item.action}
      </Text>
      <Text style={styles.listText}>{item.user}</Text>
      <Text style={styles.listText}>{item.date}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <FontAwesome5 name="bars" size={24} color="#2d3748" />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        {renderCard('book', 'Total Books', totalBooks)}
        {renderCard('book-reader', 'Total Borrows', totalBorrows)}
        {renderCard('undo-alt', 'Total Returns', totalReturns)}
      </View>

      {/* Top Borrowed Books */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 Most Borrowed Books</Text>
        {topBorrowedBooks.map((item) => (
          <View key={item.id} style={styles.listRow}>
            <Text style={styles.listText}>{item.title}</Text>
            <Text style={styles.listText}>{item.count}</Text>
          </View>
        ))}
      </View>

      {/* Section Title for Recent Actions */}
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
      {/* Sidebar */}
      <Modal visible={isSidebarVisible} animationType="slide" transparent={true}>
        <View style={styles.sidebarModal}>
          <Sidebar onClose={() => setSidebarVisible(false)} />
          <TouchableOpacity style={styles.overlay} onPress={() => setSidebarVisible(false)} />
        </View>
      </Modal>

      {/* Main FlatList for recentActions with header */}
      <FlatList
        data={recentActions}
        keyExtractor={(item) => item.id}
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
    gap: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4e73df',
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
