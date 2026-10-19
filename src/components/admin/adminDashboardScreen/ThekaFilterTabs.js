
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { FILTERS } from "./utils/adminDashboardUtils";
import { styles } from "./adminStyles";

export default function ThekaFilterTabs({ filter, onChange }) {
  return (
    <View style={styles.filterRow}>
      {FILTERS.map((status) => {
        const active = filter === status;

        return (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              active && styles.activeFilter,
            ]}
            onPress={() => onChange(status)}
          >
            <Text
              style={[
                styles.filterText,
                active && styles.activeFilterText,
              ]}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
