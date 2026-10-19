
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./ThekaDetailsStyles";

export default function ThekaActionButtons({
  busy,
  onApprove,
  onReject,
}) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.approveButton,
          busy && styles.disabledButton,
        ]}
        onPress={onApprove}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.actionText}>
          {busy ? "Processing..." : "Approve"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.rejectButton,
          busy && styles.disabledButton,
        ]}
        onPress={onReject}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={[styles.actionText, styles.rejectText]}>
          Reject
        </Text>
      </TouchableOpacity>
    </View>
  );
}
