
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import StatusBadge from "./StatusBadge";
import { styles } from "./adminStyles";

export default function UserListItem({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.85}
      onPress={() => onPress(item.id ?? item._id)}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>
            {item.name || "Unnamed User"}
          </Text>

          <Text style={styles.cardSubtitle}>
            {item.email ||
              item.phone ||
              item.contactPhone ||
              "No contact"}
          </Text>
        </View>

        <StatusBadge status={item.role || "USER"} />
      </View>
    </TouchableOpacity>
  );
}
