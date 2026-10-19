
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../../constants/colors";
import styles from "./ThekaDetailsStyles";

export function ThekaDetailsLoading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator
        size="large"
        color={colors.admin.accent}
      />
      <Text style={styles.stateText}>Loading Theka details...</Text>
    </View>
  );
}

export function ThekaDetailsError({
  message,
  onRetry,
  onBack,
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.stateText}>
        {message || "Theka details are unavailable."}
      </Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
