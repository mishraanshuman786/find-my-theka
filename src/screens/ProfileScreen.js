import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ThekaSection from "../components/Profile/ThekaSection";
import { useAuth } from "../context/AuthContext";
import colors from "../constants/colors";
import OptionsList from "../components/Profile/OptionsList";

export default function ProfileScreen({navigation}) {
  const { user, fetchProfile, logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        await fetchProfile();
      };

      loadProfile();
    }, [fetchProfile]),
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  console.log("New User", user);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.mobile}>{user?.phone || "Not provided"}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Theka Section */}
      <ThekaSection navigation={navigation} />

{/* Options List */}
      <OptionsList navigation={navigation} user={user} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  header: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    // borderBottomColor:colors.primaryGray,
    // borderBottomWidth:1,
    gap: 10,
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primaryLight,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primaryGray,
  },
  mobile: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primaryGray,
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    padding: 16,
  },
  infoIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginInline: 16,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryLight,
  },
 
});
