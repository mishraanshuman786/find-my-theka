
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { adminAPI } from "../../api/client";

const PRIMARY = "#3B0C1B";
const GREEN = "#279F47";
const RED = "#F5222D";

export default function AdminThekaDetailsScreen({
  route,
  navigation,
}) {
  const { thekaId } = route.params;
  const [theka, setTheka] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadDetails = useCallback(async () => {
    try {
      const response = await adminAPI.getThekaById(thekaId);
      const result = response.data?.data ?? response.data;

      setTheka(result?.theka ?? result);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load Theka details."
      );
    } finally {
      setLoading(false);
    }
  }, [thekaId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const performAction = (action) => {
    const approve = action === "approve";

    Alert.alert(
      approve ? "Approve Theka" : "Reject Theka",
      `Are you sure you want to ${
        approve ? "approve" : "reject"
      } this application?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: approve ? "Approve" : "Reject",
          style: approve ? "default" : "destructive",
          onPress: async () => {
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
                [{
                  text: "OK",
                  onPress: () => navigation.goBack(),
                }]
              );
            } catch (error) {
              Alert.alert(
                "Request failed",
                error.response?.data?.message ||
                  "Please try again."
              );
            } finally {
              setBusy(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (!theka) {
    return (
      <View style={styles.center}>
        <Text>Theka details are unavailable.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const details = [
    ["Theka Name", theka.name ?? theka.thekaName],
    ["Owner", theka.ownerName ?? theka.owner?.name],
    ["Phone", theka.contactPhone ?? theka.contact_phone],
    ["GST", theka.gstNumber ?? theka.gst_number],
    ["License", theka.licenseNumber ?? theka.license_number],
    ["License Expiry", theka.licenseExpiryDate],
    ["Address", theka.address],
    ["City", theka.city],
    ["State", theka.state],
    ["Pincode", theka.pincode],
    ["Status", theka.status],

  ];

  return (
    <View style={styles.container}>
      

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.documentPlaceholder}>
          <Text style={styles.documentIcon}>▤</Text>
          <Text style={styles.documentText}>
            Application details
          </Text>
        </View>

        <View style={styles.detailsGrid}>
          {details.map(([label, value]) => (
            <View key={label} style={styles.detailCard}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>
                {value == null || value === "" ? "Not provided" : String(value)}
              </Text>
            </View>
          ))}
        </View>

        {String(theka.status).toUpperCase() === "PENDING" && (
          <View style={styles.actions}>
            <TouchableOpacity
              disabled={busy}
              style={[styles.actionButton, styles.approve]}
              onPress={() => performAction("approve")}
            >
              <Text style={styles.actionText}>
                {busy ? "Please wait..." : "Approve"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={busy}
              style={[styles.actionButton, styles.reject]}
              onPress={() => performAction("reject")}
            >
              <Text style={[styles.actionText, { color: RED }]}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },
  documentPlaceholder: {
    height: 105,
    backgroundColor: "#F0EAED",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  documentIcon: {
    fontSize: 27,
    color: "#AFA4AA",
  },
  documentText: {
    color: "#897D84",
    fontSize: 12,
    marginTop: 5,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  detailCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#FAF7F8",
    borderRadius: 13,
    padding: 13,
    minHeight: 72,
  },
  detailLabel: {
    color: "#89818A",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 8,
  },
  detailValue: {
    color: "#191416",
    fontSize: 14,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  approve: {
    backgroundColor: GREEN,
  },
  reject: {
    borderWidth: 1,
    borderColor: RED,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
