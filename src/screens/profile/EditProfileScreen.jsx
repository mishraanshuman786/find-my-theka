import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import colors from "../../constants/colors";

const EditProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit Profile
      </Text>

      <Text>
        Edit profile content goes here.
      </Text>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
});

