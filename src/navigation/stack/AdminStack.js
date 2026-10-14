
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../../constants/colors";
import GradientHeader from "../../components/GradientHeader";

import AdminDashboardScreen from "../../screens/admin/AdminDashboardScreen";
import AdminThekaDetailsScreen from "../../screens/admin/AdminThekaDetailScreen";
import AdminUserDetailsScreen from "../../screens/admin/AdminUserDetailsScreen";

const Stack = createNativeStackNavigator();

const adminHeaderOptions = {
  header: (props) => <GradientHeader {...props} />,
  headerTransparent: false,
  headerTintColor: colors.white,
  headerTitleStyle: {
    color: colors.white,
    fontWeight: "700",
  },
};

export default function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Dashboard: preserve the existing custom dashboard header */}
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
      />

      {/* Theka details: use the shared gradient header */}
      <Stack.Screen
        name="AdminThekaDetails"
        component={AdminThekaDetailsScreen}
        options={{
          ...adminHeaderOptions,
          headerShown: true,
          title: "Verify Theka",
        }}
      />

      {/* User details: use the shared gradient header */}
      <Stack.Screen
        name="AdminUserDetails"
        component={AdminUserDetailsScreen}
        options={{
          ...adminHeaderOptions,
          headerShown: true,
          title: "User Details",
        }}
      />
    </Stack.Navigator>
  );
}
