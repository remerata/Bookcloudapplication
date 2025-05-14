import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Sidebar from './Sidebar';

// Firestore imports
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ fullname: '', email: '', courseSection: '', gender: '', phone_number: '' });
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Real-time fetch users
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users'),
      snapshot => {
        const list = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setStudents(list);
        setLoading(false);
      },
      err => {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const openAddModal = () => {
    setEditStudent(null);
    setNewStudent({ fullname: '', email: '', courseSection: '', gender: '', phone_number: '' });
    setModalVisible(true);
  };

  const openEditModal = student => {
    setEditStudent(student);
    setNewStudent({
      fullname: student.fullname,
      email: student.email,
      courseSection: student.courseSection,
      gender: student.gender,
      phone_number: student.phone_number,
    });
    setModalVisible(true);
  };

  const handleAddOrUpdateStudent = async () => {
    try {
      if (editStudent) {
        const stuRef = doc(db, 'users', editStudent.id);
        await updateDoc(stuRef, newStudent);
      } else {
        await addDoc(collection(db, 'users'), newStudent);
      }
    } catch (err) {
      console.error('Error saving user:', err);
      Alert.alert('Error', 'Could not save user');
    } finally {
      setModalVisible(false);
      setEditStudent(null);
      setNewStudent({ fullname: '', email: '', courseSection: '', gender: '', phone_number: '' });
    }
  };

  const handleDelete = id => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            try { await deleteDoc(doc(db, 'users', id)); }
            catch (err) { console.error('Error deleting user:', err); Alert.alert('Error', 'Could not delete user'); }
          }
        }
      ],
      { cancelable: true }
    );
  };

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large"/><Text>Loading users...</Text></View>
  );
  if (error) return (
    <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
  );

  return (
    <View style={styles.container}>
      {isSidebarVisible && <Sidebar onClose={() => setSidebarVisible(false)} />}
      <ImageBackground source={require('../assets/images/img/background.jpg')} style={styles.background}>
        <TouchableOpacity style={styles.hamburger} onPress={() => setSidebarVisible(!isSidebarVisible)}>
          <FontAwesome5 name="bars" size={24} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Add New Student</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {students.length === 0 ? (
            <Text style={styles.emptyText}>No users found</Text>
          ) : (
            students.map(s => (
              <View key={s.id} style={styles.card}>
                <View style={styles.infoBlock}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{s.fullname}</Text></View>
                <View style={styles.infoBlock}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{s.email}</Text></View>
                <View style={styles.infoBlock}><Text style={styles.label}>Course:</Text><Text style={styles.value}>{s.courseSection}</Text></View>
                <View style={styles.infoBlock}><Text style={styles.label}>Gender:</Text><Text style={styles.value}>{s.gender}</Text></View>
                <View style={styles.infoBlock}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{s.phone_number}</Text></View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => openEditModal(s)}><Text style={styles.edit}>Edit</Text></TouchableOpacity>
                  <Text style={styles.separator}> | </Text>
                  <TouchableOpacity onPress={() => handleDelete(s.id)}><Text style={styles.delete}>Delete</Text></TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </ImageBackground>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editStudent ? 'Edit Student' : 'Add New Student'}</Text>
            {['fullname','email','courseSection','gender','phone_number'].map(field => (
              <TextInput key={field} style={styles.input}
                placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                value={newStudent[field]}
                onChangeText={t=>setNewStudent({...newStudent,[field]:t})}
              />
            ))}
            <View style={styles.modalActions}>
              <Button title="Save" onPress={handleAddOrUpdateStudent} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{flex:1},
  background:{width,height,paddingHorizontal:20,paddingTop:60},
  centered:{flex:1,justifyContent:'center',alignItems:'center'},
  errorText:{color:'red'},
  emptyText:{textAlign:'center',marginTop:20,color:'#555'},
  hamburger:{position:'absolute',top:50,left:20,zIndex:10,backgroundColor:'#ffffffcc',padding:8,borderRadius:10},
  addButton:{backgroundColor:'#2563eb',paddingVertical:10,paddingHorizontal:16,borderRadius:8,alignSelf:'flex-end',marginBottom:20},
  addButtonText:{color:'#fff',fontSize:14,fontWeight:'600'},
  scrollContent:{paddingBottom:100},
  card:{backgroundColor:'#fff',padding:16,borderRadius:10,marginBottom:16,elevation:3},
  infoBlock:{flexDirection:'row',marginBottom:6},
  label:{fontWeight:'600',fontSize:14,width:120,color:'#374151'},
  value:{fontSize:14,color:'#1f2937'},
  actions:{flexDirection:'row',marginTop:10,justifyContent:'flex-end'},
  edit:{color:'#2563eb',fontWeight:'600'},
  delete:{color:'#dc2626',fontWeight:'600'},
  separator:{marginHorizontal:8,color:'#6b7280'},
  modalOverlay:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'},
  modalContainer:{backgroundColor:'white',padding:20,borderRadius:10,width:'80%'},
  modalTitle:{fontSize:20,fontWeight:'600',marginBottom:20},
  input:{borderBottomWidth:1,marginBottom:10,padding:8,fontSize:16},
  modalActions:{marginTop:20}
});

export default StudentList;
