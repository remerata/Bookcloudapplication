import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ReceiptHistory = ({ receipts }) => {
  const navigation = useNavigation();

  const returnBook = (receiptId) => {
    Alert.alert(
      'Return Book',
      'Are you sure you want to mark this book as returned?',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: () => {
            // Call your API or navigate to the route
            console.log(`Return book with receipt ID: ${receiptId}`);
            // For example: use your API call here
          },
        },
      ]
    );
  };

  const deleteReceipt = (receiptId) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: () => {
            // Call your API to delete the receipt
            console.log(`Delete receipt with ID: ${receiptId}`);
            // For example: use your API call here
          },
        },
      ]
    );
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'returned':
        return <Text style={styles.statusReturned}>Returned</Text>;
      case 'active':
        return <Text style={styles.statusActive}>Active</Text>;
      case 'overdue':
        return <Text style={styles.statusOverdue}>Overdue</Text>;
      default:
        return <Text>Status Unknown</Text>;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.receipt_number}</Text>
      <Text style={styles.cell}>{item.borrowerName}</Text>
      <Text style={styles.cell}>{item.bookTitle}</Text>
      <Text style={styles.cell}>{item.ISBN}</Text>
      <Text style={styles.cell}>{item.borrowDate}</Text>
      <Text style={styles.cell}>{item.dueDate}</Text>
      <Text style={styles.cell}>{item.returnDate || 'Not returned'}</Text>
      <Text style={styles.cell}>₱{item.fine_amount || '0.00'}</Text>
      <View style={styles.statusCell}>{renderStatus(item.status)}</View>
      <View style={styles.actionsCell}>
        {item.status === 'active' && (
          <Button
            title="Return"
            onPress={() => returnBook(item.id)}
            color="blue"
          />
        )}
        {item.status === 'returned' && (
          <Button
            title="Delete"
            onPress={() => deleteReceipt(item.id)}
            color="red"
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt History</Text>
      {receipts.length === 0 ? (
        <Text>No receipts found</Text>
      ) : (
        <FlatList
          data={receipts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cell: {
    width: '10%',
    fontSize: 14,
    textAlign: 'center',
  },
  statusCell: {
    width: '10%',
    alignItems: 'center',
  },
  actionsCell: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusReturned: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  statusActive: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  statusOverdue: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
  },
});

export default ReceiptHistory;
