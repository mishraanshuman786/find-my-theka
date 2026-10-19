
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";

import AuthStack from "./stack/AuthStack";
import AdminStack from "./stack/AdminStack";
import MainTabs from "./MainTab";
import LoadingScreen from "../screens/LoadingScreen";


const AppNavigator = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashFinished(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !splashFinished) {
    return <LoadingScreen />;
  }

  const roles = Array.isArray(user?.roles) ? user.roles : [];

  const isAdmin =
    String(user?.role ?? "").toUpperCase() === "ADMIN" ||
    roles.some((role) => String(role).toUpperCase() === "ADMIN");

  return (
    <>
      <StatusBar
        style="light"
        backgroundColor={colors.primary}
        translucent={false}
      />

      <NavigationContainer>
        {!isAuthenticated ? (
          <AuthStack />
        ) : isAdmin ? (
          <AdminStack />
        ) : (
          <MainTabs />
        )}
      </NavigationContainer>
    </>
  );
};


export default AppNavigator;
