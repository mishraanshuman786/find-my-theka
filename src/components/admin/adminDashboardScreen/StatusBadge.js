
import React from "react";
import { View, Text } from "react-native";

import { getStatusColor } from "./utils/adminDashboardUtils";
import { styles } from "./adminStyles";

export default function StatusBadge({ status }) {
  const badgeColors = getStatusColor(status);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: badgeColors.bg },
      ]}
    >
      <Text style={[styles.badgeText, { color: badgeColors.text }]}>
        {status || "PENDING"}
      </Text>
    </View>
  );
}
