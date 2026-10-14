import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../constants/colors";
import { thekasAPI } from "../../api/client";
import GradientBackground from "../../components/GradientBackground";

export default function ThekaDetailsScreen({ route, navigation }) {
  const { thekaId } = route.params || {};

  const [theka, setTheka] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchDetails = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(false);

      const response = await thekasAPI.getDetails(thekaId);
      const data = response.data;

      // Supports common API response shapes.
      const details =
        data?.data && !Array.isArray(data.data)
          ? data.data
          : data?.theka || data;

      setTheka(details);
    } catch (err) {
      console.error(
        "Unable to load Theka details:",
        err.response?.data || err.message
      );
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [thekaId]);

  useFocusEffect(
    useCallback(() => {
      fetchDetails();
    }, [fetchDetails])
  );

 const renderDetail = (label, value, icon) => (
  <View style={styles.detailRow} key={label}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={20} color={colors.primary} />
    </View>

    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>
        {value !== null && value !== undefined && value !== ""
          ? String(value)
          : "Not provided"}
      </Text>
    </View>
  </View>
);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Theka details...</Text>
      </View>
    );
  }

  if (error || !theka) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.primaryGray}
        />
        <Text style={styles.errorTitle}>
          Couldn't load Theka details
        </Text>
        <Text style={styles.errorText}>
          Please check your connection and try again.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchDetails()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const address = [
    theka.address,
    theka.city,
    theka.state,
    theka.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const status = String(theka.status || "UNKNOWN").toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchDetails(true)}
        />
      }
    >
      {/* Theka header */}
      <View style={styles.heroCard}>
        <GradientBackground />
        <View style={styles.heroIcon}>
          <Ionicons
            name="storefront"
            size={38}
            color={colors.primaryLight}
          />
        </View>

        <Text style={styles.thekaName}>
          {theka.name || "Unnamed Theka"}
        </Text>

        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              status === "APPROVED"
                ? styles.approvedDot
                : status === "REJECTED"
                  ? styles.rejectedDot
                  : styles.pendingDot,
            ]}
          />
          <Text style={styles.statusText}>{status}</Text>
        </View>

       
      </View>

      {/* Contact and address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop Information</Text>

        {renderDetail("Shop Name", theka.name, "storefront-outline")}
        {renderDetail(
          "Contact Number",
          theka.contactPhone,
          "call-outline"
        )}
        {renderDetail(
          "Address",
          address,
          "location-outline"
        )}
      </View>

      {/* Registration information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration Information</Text>

        {renderDetail(
          "Aadhaar Number",
          theka.aadhaarNumber,
          "card-outline"
        )}
        {renderDetail(
          "GST Number",
          theka.gstNumber,
          "document-text-outline"
        )}
        {renderDetail(
          "License Number",
          theka.licenseNumber,
          "document-attach-outline"
        )}
      </View>

      {/* Location information */}
      {(theka.latitude != null || theka.longitude != null) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          {renderDetail(
            "Latitude",
            theka.latitude,
            "navigate-outline"
          )}
          {renderDetail(
            "Longitude",
            theka.longitude,
            "compass-outline"
          )}
        </View>
      )}

      {/* Registration timestamps */}
      {(theka.createdAt || theka.updatedAt) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Record Information</Text>

          {renderDetail(
            "Registered On",
            theka.createdAt
              ? new Date(theka.createdAt).toLocaleDateString()
              : null,
            "calendar-outline"
          )}
          {renderDetail(
            "Last Updated",
            theka.updatedAt
              ? new Date(theka.updatedAt).toLocaleDateString()
              : null,
            "time-outline"
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Back to My Thekas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.primaryGray,
    fontSize: 14,
  },
  errorTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "700",
    color: colors.primaryDark,
    textAlign: "center",
  },
  errorText: {
    marginTop: 8,
    color: colors.primaryGray,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  heroCard: {
    alignItems: "center",
    overflow:"hidden",
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    marginBottom: 14,
  },
  thekaName: {
    color: colors.primaryLight,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  approvedDot: {
    backgroundColor: "#86EFAC",
  },
  rejectedDot: {
    backgroundColor: "#FCA5A5",
  },
  pendingDot: {
    backgroundColor: "#FDE68A",
  },
  statusText: {
    color: colors.primaryLight,
    fontWeight: "700",
    fontSize: 12,
  },

  section: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: colors.primaryGray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginTop: 2,
    marginBottom:60
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});

