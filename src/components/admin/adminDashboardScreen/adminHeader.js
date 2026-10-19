
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";

import colors from "../../../constants/colors";
import { styles } from "./adminStyles";

export default function AdminHeader({ onLogout }) {
  const admin = colors.admin;

  const confirmLogout = () => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: onLogout,
      },
    ]);
  };

  return (
    <>
      <StatusBar
        backgroundColor={admin.primary}
        barStyle="light-content"
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.adminLabel}>ADMIN PANEL</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Manage Thekas and users
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
