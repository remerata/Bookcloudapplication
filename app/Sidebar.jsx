import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const Sidebar = ({ user = { fullname: 'John Doe', studentid: '20210001' }, onClose = () => {} }) => {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);

  const userInitial = user.fullname.charAt(0).toUpperCase();

  return (
    <View style={styles.sidebar}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="times" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require('../assets/images/img/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Menu Items */}
      <ScrollView style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('Dashboard');
            onClose(); // Close sidebar after navigation
          }}
        >
          <Icon name="tachometer-alt" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.menuText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('Availablebooks');
            onClose(); // Close sidebar after navigation
          }}
        >
          <Icon name="book" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.menuText}>Available Books</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('Addbooks');
            onClose(); // Close sidebar after navigation
          }}
        >
          <Icon name="plus" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.menuText}>Add Books</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('Userlist');
            onClose(); // Close sidebar after navigation
          }}
        >
          <Icon name="user-graduate" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.menuText}>User List</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.divider} />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.profileInitial}>{userInitial}</Text>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.fullName}>{user.fullname}</Text>
          <Text style={styles.studentId}>{user.studentid}</Text>
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setShowDropdown(false);
                navigation.navigate('Profile');
              }}
            >
              <Icon name="user-circle" size={16} style={styles.dropdownIcon} />
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setShowDropdown(false);
                navigation.navigate('Logout');
              }}
            >
              <Icon name="sign-out-alt" size={16} style={styles.dropdownIcon} />
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: '50%',
    backgroundColor: '#020746',
    height: '100%',
    padding: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 999,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 20,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15,
  },
  profileSection: {
    alignItems: 'flex-start',
  },
  profileButton: {
    backgroundColor: '#4a5568',
    borderRadius: 50,
    padding: 10,
    marginBottom: 10,
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginBottom: 10,
  },
  fullName: {
    color: '#fff',
    fontSize: 16,
  },
  studentId: {
    color: '#cbd5e0',
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    padding: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  dropdownIcon: {
    marginRight: 8,
  },
});

export default Sidebar;
