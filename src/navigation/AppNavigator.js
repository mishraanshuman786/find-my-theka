import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import MainDrawer from "./MainDrawer";
import LoadingScreen from "../components/common/LoadingScreen";

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
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
  return (
    <>
      
      <StatusBar
        style="light"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <NavigationContainer>
       
        {isAuthenticated ? <MainDrawer /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
};
export default AppNavigator;
