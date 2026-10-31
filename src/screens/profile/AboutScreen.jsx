import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import colors from "../../constants/colors";

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>FT</Text>
      </View>

      <Text style={styles.title}>Find My Theka</Text>

      <Text style={styles.description}>
        Find My Theka helps users discover nearby registered shops
        and explore location-based information.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Application</Text>
        <Text style={styles.value}>Find My Theka</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Version</Text>
        <Text style={styles.value}>1.0.0</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Platform</Text>
        <Text style={styles.value}>Android / iOS</Text>
      </View>

      <Text style={styles.footer}>
        Made with ❤️ in India
      </Text>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    padding: 24,
    alignItems: "center",
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primaryLight,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  description: {
    fontSize: 14,
    color: colors.primaryGray,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 30,
  },
  infoCard: {
    width: "100%",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 18,
  },
  label: {
    fontSize: 12,
    color: colors.primaryGray,
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  footer: {
    marginTop: 30,
    fontSize: 13,
    color: colors.primaryGray,
  },
});