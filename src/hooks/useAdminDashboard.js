
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { adminAPI } from "../api/client";

import { unwrap, getList } from "../components/admin/adminDashboardScreen/utils/adminDashboardUtils";

export default function useAdminDashboard(section, filter) {
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
                status:
                  filter === "APPROVED"
                    ? "VERIFIED"
                    : "PENDING",
                page: 1,
                limit: 50,
              };

        const response = await adminAPI.getThekas(params);

        setThekas(
          getList(response, ["data", "thekas", "items"])
        );
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
    setLoading(true);
    loadDashboard();
  }, [loadDashboard]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard();
  }, [loadDashboard]);

  const updateTheka = useCallback(
    (id, action) => {
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
    },
    [loadDashboard]
  );

  const deleteTheka = useCallback(
    (id) => {
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
    },
    [loadDashboard]
  );

  return {
    stats,
    thekas,
    users,
    loading,
    refreshing,
    busyId,
    error,
    loadDashboard,
    refresh,
    updateTheka,
    deleteTheka,
  };
}
