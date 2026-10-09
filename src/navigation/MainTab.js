import React from "react";
import {StyleSheet, View} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import RadialGradient from "react-native-radial-gradient";
import colors from "../constants/colors";
import HomeStack from "./stack/HomeStack";
import HistoryStack from "./stack/HistoryStack";
import ProfileStack from "./stack/ProfileStack";

const Tab=createBottomTabNavigator();

const BottomTabBackground = () => {
  const gradientColors = colors.primaryGradient.map(
    (stop) => stop.color
  );

  const gradientStops = colors.primaryGradient.map(
    (stop) => parseFloat(stop.offset) / 100
  );

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <RadialGradient
        colors={gradientColors}
        stops={gradientStops}
        center={[180, 25]}
        radius={300}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};


const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: 4,
        },

        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          position: "absolute",
        },

        tabBarBackground: () => (
          <BottomTabBackground />
        ),

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused
              ? "home"
              : "home-outline";
          } else if (route.name === "HistoryTab") {
            iconName = focused
              ? "time"
              : "time-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused
              ? "person"
              : "person-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: "Home",
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{
          title: "History",
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;