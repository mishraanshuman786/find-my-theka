
import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";

import { useAuth } from "../../context/AuthContext";
import colors from "../../constants/colors";
import DrawerMenuItem from "./DrawerMenuItem";

const CustomDrawer = (props) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.appName}>
          Find My Theka
        </Text>

        {user?.email && (
          <Text style={styles.email}>
            {user.email}
          </Text>
        )}
      </View>

      {/* MENU */}

      <DrawerMenuItem
        label="Home"
        screen="Home"
        navigation={props.navigation}
        labelStyle={styles.label}
      />

      <DrawerMenuItem
        label="Search History"
        screen="SearchHistory"
        navigation={props.navigation}
        labelStyle={styles.label}
      />

      <DrawerMenuItem
        label="Profile"
        screen="Profile"
        navigation={props.navigation}
        labelStyle={styles.label}
      />

      {/* LOGOUT */}

      <DrawerItem
        label="Logout"
        labelStyle={[
          styles.label,
          styles.logout,
        ]}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 25,
    backgroundColor: colors.primary,
    marginBottom: 10,
    borderRadius: 10,
  },

  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },

  email: {
    fontSize: 13,
    color: colors.textWhite,
  },

  label: {
    fontSize: 16,
    color: "#333",
  },

  logout: {
    color: "#d00000",
  },
});

export default CustomDrawer;
