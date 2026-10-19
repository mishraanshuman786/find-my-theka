
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import colors from "../../../constants/colors";
import { styles } from "./adminStyles";

export function LoadingState() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator
        size="large"
        color={colors.admin.accent}
      />
      <Text style={styles.emptyText}>Loading dashboard...</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{message}</Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

export function EmptyState({ section, filter }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {section === "USERS"
          ? "No users found"
          : `No ${filter.toLowerCase()} Thekas`}
      </Text>

      <Text style={styles.emptyText}>
        Data will appear here when available.
      </Text>
    </View>
  );
}
