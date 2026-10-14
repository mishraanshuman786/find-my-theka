import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { adminAPI } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const COLORS = {
  primary: "#3B0C1B",
  accent: "#F20A75",
  background: "#FFFFFF",
  surface: "#FAF7F8",
  border: "#EDE4E7",
  text: "#191416",
  muted: "#89818A",
  green: "#279F47",
  orange: "#F28C00",
  red: "#F5222D",
};

const FILTERS = ["PENDING", "APPROVED", "EXPIRED"];

const unwrap = (response) =>
  response?.data?.data ?? response?.data ?? {};

const getList = (response, keys = []) => {
  const result = unwrap(response);

  if (Array.isArray(result)) return result;

  for (const key of keys) {
    if (Array.isArray(result?.[key])) return result[key];
  }

  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.rows)) return result.rows;

  return [];
};

const getStatusColor = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "APPROVED":
      return { bg: "#E3F7E9", text: COLORS.green };
    case "EXPIRED":
      return { bg: "#FFE5E6", text: COLORS.red };
    default:
      return { bg: "#FFF0DC", text: COLORS.orange };
  }
};

function StatCard({ count, label, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNumber, { color }]}>{count ?? 0}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatusBadge({ status }) {
  const colors = getStatusColor(status);

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>
        {status || "PENDING"}
      </Text>
    </View>
  );
}

export default function AdminDashboardScreen({ navigation }) {
  const { logout } = useAuth();

  const [section, setSection] = useState("THEKAS");
  const [filter, setFilter] = useState("PENDING");

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    expired: 0,
    users: 0,
  });

  const [thekas, setThekas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setError("");

    try {
      const statsResponse = await adminAPI.getStats();
      const data = unwrap(statsResponse);

      setStats({
        pending:
          data.pending ??
          data.pendingThekas ??
          data.pendingCount ??
          0,
        approved:
          data.approved ??
          data.approvedThekas ??
          data.approvedCount ??
          0,
        expired:
          data.expired ??
          data.expiredThekas ??
          data.expiredCount ??
          0,
        users: data.users ?? data.totalUsers ?? 0,
      });

      if (section === "USERS") {
        const response = await adminAPI.getUsers({
          page: 1,
          limit: 50,
        });

        setUsers(getList(response, ["users", "data"]));
      } else {
         const params =
    filter === "EXPIRED"
      ? {
          filter: "expired",
          page: 1,
          limit: 50,
        }
      : {
          status: filter === "APPROVED" ? "VERIFIED" : "PENDING",
          page: 1,
          limit: 50,
        };

  const response = await adminAPI.getThekas(params);

  setThekas(getList(response, ["data", "thekas", "items"]));
      }
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [section, filter]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const refresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const updateTheka = (id, action) => {
    const isApprove = action === "approve";

    Alert.alert(
      isApprove ? "Approve Theka?" : "Reject Theka?",
      isApprove
        ? "This listing will be approved."
        : "This application will be rejected.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isApprove ? "Approve" : "Reject",
          style: isApprove ? "default" : "destructive",
          onPress: async () => {
            setBusyId(id);

            try {
              if (isApprove) {
                await adminAPI.approveTheka(id);
              } else {
                await adminAPI.rejectTheka(id);
              }

              Alert.alert(
                "Success",
                isApprove
                  ? "Theka approved successfully."
                  : "Theka rejected successfully."
              );

              await loadDashboard();
            } catch (err) {
              Alert.alert(
                "Action failed",
                err.response?.data?.message ||
                  "Unable to update this Theka."
              );
            } finally {
              setBusyId(null);
            }
          },
        },
      ]
    );
  };

  const deleteTheka = (id) => {
    Alert.alert(
      "Delete expired listing?",
      "This action may permanently remove this listing.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setBusyId(id);

            try {
              await adminAPI.deleteExpiredTheka(id);
              await loadDashboard();
            } catch (err) {
              Alert.alert(
                "Delete failed",
                err.response?.data?.message ||
                  "Unable to delete this listing."
              );
            } finally {
              setBusyId(null);
            }
          },
        },
      ]
    );
  };

  const renderTheka = ({ item }) => {
    const id = item.id ?? item._id;
    const actualStatus = String(item.status || "").toUpperCase();

const expired =
  filter === "EXPIRED" || actualStatus === "EXPIRED";

const status = expired
  ? "EXPIRED"
  : filter === "APPROVED" && actualStatus === "VERIFIED"
    ? "APPROVED"
    : actualStatus || filter;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.listCard}
        onPress={() =>
          navigation.navigate("AdminThekaDetails", {
            thekaId: id,
          })
        }
      >
        <View style={styles.cardTop}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>
              {item.name || item.thekaName || "Unnamed Theka"}
            </Text>

            <Text style={styles.cardSubtitle}>
              {expired
                ? item.licenseExpiry
                  ? `License expired: ${item.licenseExpiry}`
                  : "License expired"
                : `${
                    item.ownerName || item.owner?.name || "Owner"
                  } · ${
                    item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "Recently submitted"
                  }`}
            </Text>
          </View>

          <StatusBadge status={status} />
        </View>

        {expired ? (
          <TouchableOpacity
            style={styles.deleteButton}
            disabled={busyId === id}
            onPress={() => deleteTheka(id)}
          >
            <Text style={styles.deleteText}>
              {busyId === id ? "Please wait..." : "Delete listing"}
            </Text>
          </TouchableOpacity>
        ) : status === "PENDING" ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              disabled={busyId === id}
              onPress={() => updateTheka(id, "approve")}
            >
              <Text style={styles.approveText}>
                {busyId === id ? "Please wait..." : "Approve"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              disabled={busyId === id}
              onPress={() => updateTheka(id, "reject")}
            >
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.cardSubtitle}>
            {item.contactPhone || item.contact_phone || ""}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("AdminUserDetails", {
          userId: item.id ?? item._id,
        })
      }
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

  const displayedList = section === "USERS" ? users : thekas;

  return (
    <View style={styles.safeArea}>
      <StatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.adminLabel}>ADMIN PANEL</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Manage Thekas and users
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() =>
            Alert.alert("Logout", "Do you want to logout?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: logout,
              },
            ])
          }
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionTabs}>
          {["THEKAS", "USERS"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSection(tab)}
              style={[
                styles.sectionTab,
                section === tab && styles.activeSectionTab,
              ]}
            >
              <Text
                style={[
                  styles.sectionTabText,
                  section === tab && styles.activeSectionTabText,
                ]}
              >
                {tab === "THEKAS" ? "Thekas" : "Users"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <StatCard
            count={stats.pending}
            label="PENDING"
            color={COLORS.orange}
          />
          <StatCard
            count={stats.approved}
            label="APPROVED"
            color={COLORS.green}
          />
          <StatCard
            count={stats.expired}
            label="EXPIRED"
            color={COLORS.red}
          />
        </View>

        {section === "THEKAS" && (
          <View style={styles.filterRow}>
            {FILTERS.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filter === status && styles.activeFilter,
                ]}
                onPress={() => setFilter(status)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === status && styles.activeFilterText,
                  ]}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.centered}>
            <ActivityIndicator
              size="large"
              color={COLORS.accent}
            />
            <Text style={styles.emptyText}>
              Loading dashboard...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refresh}
            >
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key={section}
            style={styles.list}
            data={displayedList}
            renderItem={
              section === "USERS" ? renderUser : renderTheka
            }
            keyExtractor={(item, index) =>
              String(item.id ?? item._id ?? index)
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={COLORS.accent}
              />
            }
            ListEmptyComponent={
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
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  adminLabel: {
    color: COLORS.accent,
    backgroundColor: "#54162D",
    overflow: "hidden",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontWeight: "800",
    fontSize: 11,
    marginBottom: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "#D4C2C9",
    fontSize: 12,
    marginTop: 4,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#805466",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionTabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  sectionTab: {
    backgroundColor: "#F0E9EC",
    borderRadius: 24,
    paddingHorizontal: 19,
    paddingVertical: 10,
  },
  activeSectionTab: {
    backgroundColor: "#211A1D",
  },
  sectionTabText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  activeSectionTabText: {
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    height: 76,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  statNumber: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.muted,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: "#F0E9EC",
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  activeFilter: {
    backgroundColor: "#211A1D",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  list: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 16,
    flexGrow: 1,
  },
  listCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.muted,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: COLORS.green,
  },
  approveText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: COLORS.red,
    backgroundColor: "#FFFFFF",
  },
  rejectText: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: "700",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 12,
    height: 42,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 25,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  errorText: {
    color: COLORS.red,
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
