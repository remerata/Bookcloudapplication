import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tailwind from 'tailwind-rn';

const ReserveBooks = () => {
  const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', availability: 'Available' },
    { id: 2, title: '1984', author: 'George Orwell', availability: 'Reserved' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', availability: 'Borrowed' }
  ];

  return (
    <ScrollView style={tailwind('bg-cover bg-center')} contentContainerStyle={tailwind('p-8')}>
      <View style={tailwind('bg-white rounded-lg shadow-md p-6')}>
        <Text style={tailwind('text-2xl font-semibold mb-6')}>Reserve Books</Text>

        <View style={tailwind('overflow-x-auto')}>
          {books.map((book) => (
            <View
              key={book.id}
              style={tailwind('flex flex-row justify-between items-center p-4 border-b border-gray-200')}
            >
              <View style={tailwind('flex-1')}>
                <Text style={tailwind('text-base font-semibold')}>{book.title}</Text>
                <Text style={tailwind('text-sm text-gray-500')}>{book.author}</Text>
              </View>
              <View style={tailwind('flex-1')}>
                <Text
                  style={[
                    tailwind('px-2 py-1 text-xs font-semibold rounded-full'),
                    book.availability === 'Available'
                      ? tailwind('bg-green-100 text-green-800')
                      : book.availability === 'Reserved'
                      ? tailwind('bg-yellow-100 text-yellow-800')
                      : tailwind('bg-red-100 text-red-800')
                  ]}
                >
                  {book.availability}
                </Text>
              </View>
              <View style={tailwind('flex-1')}>
                {book.availability === 'Available' ? (
                  <TouchableOpacity
                    style={tailwind('bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-sm text-xs')}
                    onPress={() => alert(`Reserving ${book.title}`)}
                  >
                    <Text style={tailwind('text-center text-white')}>Reserve</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={tailwind('text-gray-400 text-xs text-center')}>Not Available</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ReserveBooks;
