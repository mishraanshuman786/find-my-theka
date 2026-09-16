
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../constants/colors";

import DrawerButton from "../components/navigation/DrawerButton";

import HomeScreen from "../screens/HomeScreen";
import PlaceDetailScreen from "../screens/PlaceDetailScreen";
import SearchHistoryScreen from "../screens/SearchHistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const mainHeaderOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },

  headerTintColor: "#fff",

  headerLeftContainerStyle: {
    paddingLeft: 0,
  },
};

const drawerScreenOptions = ({ navigation }) => ({
  ...mainHeaderOptions,

  headerLeft: () => (
    <DrawerButton navigation={navigation} />
  ),
});

const HomeStack = () => {
  return (
    <Stack.Navigator>
    

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          ...drawerScreenOptions({ navigation }),
          title: "Find My Theka",
        })}
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
        options={({ navigation }) => ({
          ...drawerScreenOptions({ navigation }),
          title: "Search History",
        })}
      />

     

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          ...drawerScreenOptions({ navigation }),
          title: "Profile",
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

