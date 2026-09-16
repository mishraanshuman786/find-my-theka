import React from "react";
import { View, Text, StyleSheet } from "react-native";
const LoadingScreen = () => {
  return (
    <View style={styles.container}>
     
      <Text style={styles.title}> Find My Theka </Text>
      <Text style={styles.subtitle}> Finding nearby thekas... </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B4332",
  },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#fff" },
});
export default LoadingScreen;
