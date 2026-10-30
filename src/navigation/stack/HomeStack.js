
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../../constants/colors";
import GradientHeader from "../../components/GradientHeader";

import HomeScreen from "../../screens/HomeScreen";
import PlaceDetailScreen from "../../screens/PlaceDetailScreen";
import SearchHistoryScreen from "../../screens/SearchHistoryScreen";
import ProfileScreen from "../../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const mainHeaderOptions = {
  header: (props) => <GradientHeader {...props} />,
  headerTransparent: false,
  headerTintColor: colors.white,
  headerTitleStyle: {
    color: colors.white,
  },
  headerLeftContainerStyle: {
    paddingLeft: 0,
  },
};

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          ...mainHeaderOptions,
          title: "Find My Theka",
        }}
      />

      <Stack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{
          ...mainHeaderOptions,
          title: "Place Details",
        }}
      />

      <Stack.Screen
        name="SearchHistory"
        component={SearchHistoryScreen}
        options={{
          ...mainHeaderOptions,
          title: "Search History",
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          ...mainHeaderOptions,
          title: "Profile",
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
