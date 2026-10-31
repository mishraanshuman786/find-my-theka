import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../../constants/colors";
import GradientHeader from "../../components/GradientHeader";
import ProfileScreen from "../../screens/ProfileScreen";
import EditProfileScreen from "../../screens/profile/EditProfileScreen";
import ThekaIntroScreen from "../../screens/profile/ThekaIntroScreen";
import ThekaRegistrationScreen from "../../screens/profile/ThekaRegistrationScreen";
import MyThekaListScreen from "../../screens/profile/MyThekaListScreen";
import ThekaDetailsScreen from "../../screens/profile/ThekaDetailsScreen";
import PasswordManagementScreen from "../../screens/profile/PasswordManagementScreen";
import AboutScreen from "../../screens/profile/AboutScreen";
import PrivacyPolicyScreen from "../../screens/profile/PrivacyPolicyScreen";

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: (props) => <GradientHeader {...props} />,
          title: "Profile",
          headerTransparent: false,
          headerTintColor: colors.white,
          headerTitleStyle: {
            color: colors.white,
          },
        }}
      />

      {/* Edit Profile Screen */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          header: (props) => <GradientHeader {...props} />,
          headerTintColor: colors.primaryLight,
          headerTitleStyle: {
            color: colors.primaryLight,
          },
        }}
      />

      <Stack.Screen
        name="PasswordManagement"
        component={PasswordManagementScreen}
        options={{
          title: "Password Management",
          header: (props) => <GradientHeader {...props} />,
          headerTintColor: colors.primaryLight,
          headerTitleStyle: {
            color: colors.primaryLight,
          },
        }}
      />

     
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: "Privacy Policy",
          header: (props) => <GradientHeader {...props} />,
          headerTintColor: colors.primaryLight,
          headerTitleStyle: {
            color: colors.primaryLight,
          },
        }}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: "About Find My Theka",
          header: (props) => <GradientHeader {...props} />,
          headerTintColor: colors.primaryLight,
          headerTitleStyle: {
            color: colors.primaryLight,
          },
        }}
      />

      {/* Theka Registration Screens */}
      {/* Theka Intro Screen */}
      <Stack.Screen
        name="CreateThekaIntro"
        component={ThekaIntroScreen}
        options={{
          title: "Become Theka Owner",
          header: (props) => <GradientHeader {...props} />,
          headerTintColor: colors.primaryLight,
          headerTitleStyle: {
            color: colors.primaryLight,
          },
        }}
      />

      {/* Theka Registration Screen */}
      <Stack.Screen
        name="ThekaRegistrationScreen"
        component={ThekaRegistrationScreen}
        options={{ headerShown: false }}
      />

      {/* Dynamic Theka List Screen */}
      <Stack.Screen
        name="ThekaListScreen"
        component={MyThekaListScreen}
        options={{
          title: "Theka List",
          header: (props) => <GradientHeader {...props} />,
          headerTintColor: colors.primaryLight,
          headerTitleStyle: {
            color: colors.primaryLight,
          },
        }}
      />

      {/* Theka Details Screen */}
      <Stack.Screen
        name="ThekaDetailsScreen"
        component={ThekaDetailsScreen}
        options={{
          title: "Theka Details",
          header: (props) => <GradientHeader {...props} />,
          headerTintColor: colors.primaryLight,
          headerTitleStyle: {
            color: colors.primaryLight,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
