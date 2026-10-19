
import React from "react";
import { View } from "react-native";
import ThekaDetailCard from "./ThekaDetailCard";
import styles from "./ThekaDetailsStyles";
import { getThekaDetails } from "./utils/thekaDetailsUtils";

export default function ThekaDetailsGrid({ theka }) {
  return (
    <View style={styles.detailsGrid}>
      {getThekaDetails(theka).map(([label, value]) => (
        <ThekaDetailCard
          key={label}
          label={label}
          value={value}
        />
      ))}
    </View>
  );
}
