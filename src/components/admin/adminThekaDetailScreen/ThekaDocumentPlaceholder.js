
import React from "react";
import { Text, View } from "react-native";
import styles from "./ThekaDetailsStyles";

export default function ThekaDocumentPlaceholder() {
  return (
    <View style={styles.documentPlaceholder}>
      <Text style={styles.documentIcon}>▤</Text>
      <Text style={styles.documentText}>Application details</Text>
    </View>
  );
}
