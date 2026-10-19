
import React from "react";
import { Text, View } from "react-native";
import styles from "./ThekaDetailsStyles";
import { formatDetailValue } from "./utils/thekaDetailsUtils";

export default function ThekaDetailCard({ label, value }) {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>
        {formatDetailValue(value)}
      </Text>
    </View>
  );
}
