import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../screens/LoadingScreen";
import colors from "../constants/colors";
// Auth screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Main screens
import HomeScreen from "../screens/HomeScreen";
import PlaceDetailScreen from "../screens/PlaceDetailScreen";
import SearchHistoryScreen from "../screens/SearchHistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main Stack
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
             

              <Text style={styles.logoText}>Find My Theka</Text>
            </View>
          ),
          headerRight: () => null,
        }}
      />

      <Stack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{
          title: "Place Details",
        }}
      />

      <Stack.Screen
        name="SearchHistory"
        component={SearchHistoryScreen}
        options={{
          title: "Search History",
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Stack.Navigator>
  );
}

// Loading screen while checking auth
function LoadingWrapper() {
  return <LoadingScreen />;
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingWrapper />;
  }

  return isAuthenticated ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8,
  },
});