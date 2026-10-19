
import React from "react";
import { View } from "react-native";

import colors from "../../../constants/colors";
import StatCard from "./StatCard";
import { styles } from "./adminStyles";

export default function DashboardStats({ stats }) {
  const admin = colors.admin;

  return (
    <View style={styles.statsRow}>
      <StatCard
        count={stats.pending}
        label="PENDING"
        color={admin.orange}
      />
      <StatCard
        count={stats.approved}
        label="APPROVED"
        color={admin.green}
      />
      <StatCard
        count={stats.expired}
        label="EXPIRED"
        color={admin.red}
      />
    </View>
  );
}
