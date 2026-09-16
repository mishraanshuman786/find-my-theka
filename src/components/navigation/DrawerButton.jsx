import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

const DrawerButton = ({ navigation }) => {
  const openDrawer = () => {
    navigation.getParent()?.openDrawer?.();
  };

  return (
    <TouchableOpacity
      onPress={openDrawer}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>☰</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 0,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 26,
    color: "#fff",
  },
});

export default DrawerButton;
