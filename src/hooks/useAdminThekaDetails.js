
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { adminAPI } from "../api/client";

export default function useAdminThekaDetails(thekaId, navigation) {
  const [theka, setTheka] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminAPI.getThekaById(thekaId);
      const result = response.data?.data ?? response.data;
      const details = result?.theka ?? result;

      if (!details || typeof details !== "object") {
        throw new Error("Theka details are unavailable.");
      }

      setTheka(details);
    } catch (err) {
      setTheka(null);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load Theka details."
      );
    } finally {
      setLoading(false);
    }
  }, [thekaId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const performAction = useCallback(
    (action) => {
      const approve = action === "approve";

      Alert.alert(
        approve ? "Approve Theka" : "Reject Theka",
        `Are you sure you want to ${
          approve ? "approve" : "reject"
        } this application?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: approve ? "Approve" : "Reject",
            style: approve ? "default" : "destructive",
            onPress: async () => {
              if (busy) return;

              setBusy(true);

              try {
                if (approve) {
                  await adminAPI.approveTheka(thekaId);
                } else {
                  await adminAPI.rejectTheka(thekaId);
                }

                Alert.alert(
                  "Success",
                  `Theka ${approve ? "approved" : "rejected"}.`,
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              } catch (err) {
                Alert.alert(
                  "Request failed",
                  err.response?.data?.message ||
                    "Please try again."
                );
              } finally {
                setBusy(false);
              }
            },
          },
        ]
      );
    },
    [thekaId, navigation, busy]
  );

  return {
    theka,
    loading,
    busy,
    error,
    loadDetails,
    performAction,
  };
}
