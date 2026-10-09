import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { thekasAPI } from "../../api/client";

export default function MyThekaListScreen({ navigation }) {
  const [thekas, setThekas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchThekas = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(false);

      const response = await thekasAPI.getMyThekas();
      const data = response.data;

      setThekas(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.thekas)
              ? data.thekas
              : []
      );
    } catch (err) {
      console.error("Unable to fetch thekas:", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchThekas();
    }, [fetchThekas])
  );

  const renderTheka = ({ item }) => (
    <TouchableOpacity
      style={styles.thekaCard}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("ThekaDetailsScreen", { thekaId: item.id })
      }
    >
      <View style={styles.shopIcon}>
        <Ionicons
          name="storefront-outline"
          size={25}
          color={colors.primary}
        />
      </View>

      <View style={styles.thekaInfo}>
        <Text style={styles.thekaName}>
          {item.name || "Unnamed Theka"}
        </Text>

        <Text style={styles.address} numberOfLines={2}>
          {[item.address, item.city, item.state]
            .filter(Boolean)
            .join(", ") || "Address not available"}
        </Text>

        <Text style={styles.status}>
          Status: {item.status || "Unknown"}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color={colors.primaryGray}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Thekas</Text>
          <Text style={styles.subtitle}>
            {thekas.length} registered{" "}
            {thekas.length === 1 ? "shop" : "shops"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateThekaIntro")}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.primary}
        />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Couldn't load your Thekas</Text>
          <TouchableOpacity onPress={() => fetchThekas()}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={thekas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTheka}
          contentContainerStyle={
            thekas.length === 0 ? styles.emptyList : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchThekas(true)}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="storefront-outline"
                size={48}
                color={colors.primaryGray}
              />
              <Text style={styles.emptyTitle}>
                No Thekas registered yet
              </Text>
              <Text style={styles.emptySubtitle}>
                Add your first shop to get started.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation.navigate("CreateThekaIntro")}
              >
                <Text style={styles.emptyAddButtonText}>
                  Register Theka
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: colors.primaryGray,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  thekaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shopIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  thekaInfo: {
    flex: 1,
  },
  thekaName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: 5,
  },
  address: {
    fontSize: 13,
    color: colors.primaryGray,
    lineHeight: 18,
  },
  status: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  loader: {
    marginTop: 40,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primaryDark,
    textAlign: "center",
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.primaryGray,
    textAlign: "center",
    marginTop: 7,
  },
  emptyAddButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 18,
  },
  emptyAddButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  retryText: {
    color: colors.primary,
    fontWeight: "600",
    marginTop: 12,
  },
});

