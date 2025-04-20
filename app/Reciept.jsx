import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Picker, Alert, StyleSheet, ScrollView } from 'react-native';

const CreateReceipt = ({ books, users }) => {
  const [form, setForm] = useState({
    user_id: '',
    book_id: '',
    borrow_date: '',
    due_date: ''
  });

  // Handle form submission
  const createReceipt = async () => {
    try {
      // Send data to API (Replace with your actual API route)
      const response = await fetch('your-api-endpoint/receipts.store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', 'Receipt Created');
        setForm({
          user_id: '',
          book_id: '',
          borrow_date: '',
          due_date: ''
        });
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to create receipt');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create receipt');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Receipt</Text>
      <View style={styles.form}>
        {/* Borrower Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Borrower:</Text>
          <Picker
            selectedValue={form.user_id}
            style={styles.picker}
            onValueChange={(itemValue) => setForm({ ...form, user_id: itemValue })}
          >
            <Picker.Item label="Select Borrower" value="" />
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.fullname} value={user.id} />
            ))}
          </Picker>
        </View>

        {/* Book Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Book:</Text>
          <Picker
            selectedValue={form.book_id}
            style={styles.picker}
            onValueChange={(itemValue) => setForm({ ...form, book_id: itemValue })}
          >
            <Picker.Item label="Select Book" value="" />
            {books.map((book) => (
              <Picker.Item key={book.id} label={book.title} value={book.id} />
            ))}
          </Picker>
        </View>

        {/* Borrow Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Borrow Date:</Text>
          <TextInput
            style={styles.input}
            value={form.borrow_date}
            onChangeText={(text) => setForm({ ...form, borrow_date: text })}
            placeholder="Select Date"
            keyboardType="default"
          />
        </View>

        {/* Due Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date:</Text>
          <TextInput
            style={styles.input}
            value={form.due_date}
            onChangeText={(text) => setForm({ ...form, due_date: text })}
            placeholder="Select Date"
            keyboardType="default"
          />
        </View>

        {/* Submit Button */}
        <Button
          title="Create Receipt"
          onPress={createReceipt}
          disabled={!form.user_id || !form.book_id || !form.borrow_date || !form.due_date}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
  },
});

export default CreateReceipt;
