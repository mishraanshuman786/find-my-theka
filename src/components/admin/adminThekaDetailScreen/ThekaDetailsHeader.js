
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./ThekaDetailsStyles";

export default function ThekaDetailsHeader({ onBack }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Theka Details</Text>
          <Text style={styles.headerSubtitle}>
            Review application information
          </Text>
        </View>
      </View>
    </View>
  );
}
