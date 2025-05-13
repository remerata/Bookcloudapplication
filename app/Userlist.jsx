import React, { useState } from 'react';
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
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Sidebar from './Sidebar';

const { width, height } = Dimensions.get('window');

const initialStudents = [
  {
    id: 'S001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    course: 'BSCS 3A',
    gender: 'Male',
    phone: '+1234567890',
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    course: 'BSIT 2B',
    gender: 'Female',
    phone: '+0987654321',
  },
  {
    id: 'S003',
    name: 'Mark Lee',
    email: 'mark.lee@example.com',
    course: 'BSCS 4C',
    gender: 'Male',
    phone: '+1122334455',
  },
  {
    id: 'S004',
    name: 'Ana Cruz',
    email: 'ana.cruz@example.com',
    course: 'BSIS 1D',
    gender: 'Female',
    phone: '+9988776655',
  },
];

const StudentList = () => {
  const [students, setStudents] = useState(initialStudents);
  const [modalVisible, setModalVisible] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    email: '',
    course: '',
    gender: '',
    phone: '',
  });
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const openAddModal = () => {
    setNewStudent({
      id: '',
      name: '',
      email: '',
      course: '',
      gender: '',
      phone: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (student) => {
    setEditStudent(student);
    setNewStudent(student);
    setModalVisible(true);
  };

  const handleAddOrUpdateStudent = () => {
    if (editStudent) {
      setStudents(
        students.map((student) =>
          student.id === editStudent.id ? newStudent : student
        )
      );
    } else {
      setStudents([
        ...students,
        { ...newStudent, id: `S00${students.length + 1}` },
      ]);
    }
    setModalVisible(false);
  };

  const openDeleteModal = (id) => {
    setDeleteStudentId(id);
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        {
          text: 'Cancel',
          onPress: () => setDeleteStudentId(null),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteStudent(id),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
    setDeleteStudentId(null);
  };

  return (
    <View style={styles.container}>
      {isSidebarVisible && <Sidebar onClose={() => setSidebarVisible(false)} />}

      <ImageBackground
        source={require('../assets/images/img/background.jpg')}
        resizeMode="cover"
        style={styles.background}
      >
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => setSidebarVisible(!isSidebarVisible)}
        >
          <FontAwesome5 name="bars" size={24} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Add New Student</Text>
        </TouchableOpacity>

        <View style={styles.cardContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {students.map((student, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{student.name}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{student.email}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Student ID:</Text>
                  <Text style={styles.value}>{student.id}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Course & Section:</Text>
                  <Text style={styles.value}>{student.course}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Gender:</Text>
                  <Text style={styles.value}>{student.gender}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Phone Number:</Text>
                  <Text style={styles.value}>{student.phone}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => openEditModal(student)}>
                    <Text style={styles.edit}>Edit</Text>
                  </TouchableOpacity>
                  <Text style={styles.separator}> | </Text>
                  <TouchableOpacity onPress={() => openDeleteModal(student.id)}>
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>

      {/* Modal for Add/Edit Student */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editStudent ? 'Edit Student' : 'Add New Student'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newStudent.name}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newStudent.email}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Course & Section"
              value={newStudent.course}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, course: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={newStudent.gender}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, gender: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newStudent.phone}
              onChangeText={(text) =>
                setNewStudent({ ...newStudent, phone: text })
              }
            />

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

export default StudentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width,
    height,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  hamburger: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#ffffffcc',
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  infoBlock: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    width: 130,
    color: '#374151',
    fontFamily: 'Poppins-Medium',
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'Poppins-Regular',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  edit: {
    color: '#2563eb',
    fontWeight: '600',
  },
  delete: {
    color: '#dc2626',
    fontWeight: '600',
  },
  separator: {
    marginHorizontal: 8,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
  modalActions: {
    marginTop: 20,
  },
});
