
import React, { useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import colors from "../../constants/colors";

import useAdminDashboard from "../../hooks/useAdminDashboard";

import AdminHeader from "../../components/admin/adminDashboardScreen/adminHeader";
import DashboardTabs from "../../components/admin/adminDashboardScreen/DashboardTabs";
import DashboardStats from "../../components/admin/adminDashboardScreen/DashboardStats";
import ThekaFilterTabs from "../../components/admin/adminDashboardScreen/ThekaFilterTabs";
import ThekaListItem from "../../components/admin/adminDashboardScreen/ThekaListItem";
import UserListItem from "../../components/admin/adminDashboardScreen/UserListItem";

import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/admin/adminDashboardScreen/DashboardState";

import { styles } from "../../components/admin/adminDashboardScreen/adminStyles";

export default function AdminDashboardScreen({ navigation }) {
  const { logout } = useAuth();

  const [section, setSection] = useState("THEKAS");
  const [filter, setFilter] = useState("PENDING");

  const {
    stats,
    thekas,
    users,
    loading,
    refreshing,
    busyId,
    error,
    refresh,
    updateTheka,
    deleteTheka,
  } = useAdminDashboard(section, filter);

  const displayedList =
    section === "USERS" ? users : thekas;

  const handleThekaPress = (thekaId) => {
    navigation.navigate("AdminThekaDetails", {
      thekaId,
    });
  };

  const handleUserPress = (userId) => {
    navigation.navigate("AdminUserDetails", {
      userId,
    });
  };

  const renderItem = ({ item }) => {
    if (section === "USERS") {
      return (
        <UserListItem
          item={item}
          onPress={handleUserPress}
        />
      );
    }

    return (
      <ThekaListItem
        item={item}
        filter={filter}
        busyId={busyId}
        onPress={handleThekaPress}
        onApprove={(id) => updateTheka(id, "approve")}
        onReject={(id) => updateTheka(id, "reject")}
        onDelete={deleteTheka}
      />
    );
  };

  return (
    <View style={styles.safeArea}>
      <AdminHeader onLogout={logout} />

      <View style={styles.content}>
        <DashboardTabs
          section={section}
          onChange={setSection}
        />

        <DashboardStats stats={stats} />

        {section === "THEKAS" && (
          <ThekaFilterTabs
            filter={filter}
            onChange={setFilter}
          />
        )}

        {loading && !refreshing ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={refresh}
          />
        ) : (
          <FlatList
            key={section}
            style={styles.list}
            data={displayedList}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              String(item.id ?? item._id ?? index)
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={colors.admin.accent}
              />
            }
            ListEmptyComponent={
              <EmptyState
                section={section}
                filter={filter}
              />
            }
          />
        )}
      </View>
    </View>
  );
}
