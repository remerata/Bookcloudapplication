import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router"; // Use useRouter for Expo Router

const Home = () => {
  const router = useRouter(); // Initialize router
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <ImageBackground
      source={require("../assets/images/img/home.webp")} // Your background image
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.logo}>
          <Image
            source={require("../assets/images/img/loho.png")}
            style={styles.logoImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>

        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                router.push("/Dashboard"); // Navigate to Dashboard screen
              }}
              style={styles.menuItem}
            >
              <Text>Login as Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleMenu}
              style={styles.closeMenuButton}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>BOOK CLOUD</Text>
        <Text style={styles.heroSubtitle}>MANAGE YOUR LIBRARY BOOKS</Text>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push("/Login")} // Navigate to Login screen
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: "rgba(238, 139, 10, 0.34)",
    width: "100%",
    marginTop: -175, // Adjust this as needed
  },
  logo: {
    flex: 1,
  },
  logoImage: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  hamburgerButton: {
    padding: 10,
  },
  hamburgerText: {
    fontSize: 30,
    color: "white",
  },
  menu: {
    position: "absolute",
    top: 60,
    right: 0,
    backgroundColor: "#fff",
    width: 200,
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  menuItem: {
    marginBottom: 10,
  },
  closeMenuButton: {
    marginTop: 10,
  },
  heroSection: {
    height: 300,
    width: width - 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 19, 81, 0.52)",
    padding: 30,
    marginTop: 150,
    borderRadius: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 20,
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
  getStartedButton: {
    padding: 15,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Home;
