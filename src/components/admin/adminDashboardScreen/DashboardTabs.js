
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./adminStyles";

const TABS = ["THEKAS", "USERS"];

export default function DashboardTabs({ section, onChange }) {
  return (
    <View style={styles.sectionTabs}>
      {TABS.map((tab) => {
        const active = section === tab;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            style={[
              styles.sectionTab,
              active && styles.activeSectionTab,
            ]}
          >
            <Text
              style={[
                styles.sectionTabText,
                active && styles.activeSectionTabText,
              ]}
            >
              {tab === "THEKAS" ? "Thekas" : "Users"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
