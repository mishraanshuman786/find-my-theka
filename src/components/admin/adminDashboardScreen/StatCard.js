
import React from "react";
import { View, Text } from "react-native";
import { styles } from "./adminStyles";

export default function StatCard({ count, label, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNumber, { color }]}>
        {count ?? 0}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
