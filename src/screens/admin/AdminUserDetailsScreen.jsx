
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { adminAPI } from "../../api/client";

export default function AdminUserDetailsScreen({ route }) {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    adminAPI
      .getUserById(userId)
      .then((response) => {
        const data = response.data?.data ?? response.data;
        if (active) setUser(data?.user ?? data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to load user."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F20A75" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.center}>
        <Text>{error || "User not found."}</Text>
      </View>
    );
  }

  const fields = [
    ["Name", user.name],
    ["Email", user.email],
    ["Phone", user.phone],
    ["Role", user.role],
    ["User ID", user.id ?? user._id],
    ["Created", user.createdAt],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    

      {fields.map(([label, value]) => (
        <View key={label} style={styles.card}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {value == null || value === "" ? "Not provided" : String(value)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingBlock: 40, paddingInline:20 },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#3B0C1B",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 13,
    backgroundColor: "#FAF7F8",
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    color: "#89818A",
    marginBottom: 7,
  },
  value: {
    fontSize: 15,
    color: "#191416",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
