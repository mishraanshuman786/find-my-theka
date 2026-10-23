
import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import colors from "../constants/colors";

export default function PlaceDetailScreen({ route, navigation }) {
  const { place } = route.params;

  // Supports registered thekas and Google Places.
  const isRegistered =
    place.isRegistered === true || place.source === "custom";

  const latitude = Number(place.location?.lat ?? place.latitude);
  const longitude = Number(place.location?.lng ?? place.longitude);

  const hasValidCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0);

  const distanceMeters = place.distanceMeters ?? place.distance;

  const phone = place.contactPhone ?? place.contact_phone ?? place.phone;

  const formatDistance = (meters) => {
    if (
      meters === null ||
      meters === undefined ||
      !Number.isFinite(Number(meters))
    ) {
      return "N/A";
    }

    const distance = Number(meters);

    if (distance < 1000) {
      return `${Math.round(distance)} meters`;
    }

    return `${(distance / 1000).toFixed(2)} km`;
  };

  const getPlaceType = () => {
    if (isRegistered) {
      return "Registered Theka";
    }

    if (!Array.isArray(place.types) || place.types.length === 0) {
      return "Liquor Shop";
    }

    if (place.types.includes("liquor_store")) {
      return "Liquor Shop";
    }

    return place.types[0]
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getOpeningHours = () => {
    const hours = place.openingHours;

    if (Array.isArray(hours)) {
      return hours;
    }

    if (Array.isArray(hours?.weekdayDescriptions)) {
      return hours.weekdayDescriptions;
    }

    if (
      Array.isArray(place.currentOpeningHours?.weekdayDescriptions)
    ) {
      return place.currentOpeningHours.weekdayDescriptions;
    }

    return [];
  };

  const openInGoogleMaps = async () => {
    if (!hasValidCoordinates) {
      Alert.alert(
        "Location unavailable",
        "Location information is not available for this shop."
      );
      return;
    }

    const query = encodeURIComponent(`${latitude},${longitude}`);

    const url =
      `https://www.google.com/maps/search/?api=1&query=${query}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to open Google Maps.");
    }
  };

  const callShop = async () => {
    if (!phone) {
      Alert.alert(
        "Phone unavailable",
        "No contact number is available for this shop."
      );
      return;
    }

    try {
      await Linking.openURL(`tel:${phone}`);
    } catch (error) {
      Alert.alert("Error", "Unable to make a phone call.");
    }
  };

  const openingHours = getOpeningHours();

  const isOpen =
    place.isOpen ??
    place.currentOpeningHours?.openNow ??
    place.openingHours?.openNow;

  const statusIcon = isRegistered
    ? "shield-checkmark-outline"
    : isOpen === true
      ? "checkmark-circle-outline"
      : isOpen === false
        ? "close-circle-outline"
        : "help-circle-outline";

  const statusColor =
    isRegistered || isOpen === true
      ? "#2E7D32"
      : isOpen === false
        ? "#C62828"
        : colors.primary;

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: hasValidCoordinates ? latitude : 25.4358,
          longitude: hasValidCoordinates ? longitude : 82.8534,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {hasValidCoordinates && (
          <Marker
            coordinate={{ latitude, longitude }}
            title={place.name || "Liquor Shop"}
            description={place.address || "Address unavailable"}
            pinColor={colors.primary}
          />
        )}
      </MapView>

      {/* Details */}
      <View style={styles.detailsCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons
              name="beer-outline"
              size={32}
              color={colors.primary}
              style={styles.shopIcon}
            />

            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {place.name || "Liquor Shop"}
              </Text>

              <View
                style={[
                  styles.sourceBadge,
                  isRegistered
                    ? styles.registeredBadge
                    : styles.googleBadge,
                ]}
              >
                <Ionicons
                  name={
                    isRegistered
                      ? "shield-checkmark-outline"
                      : "location-outline"
                  }
                  size={13}
                  color={isRegistered ? "#FFFFFF" : colors.primary}
                />

                <Text
                  style={[
                    styles.sourceBadgeText,
                    isRegistered
                      ? styles.registeredBadgeText
                      : styles.googleBadgeText,
                  ]}
                >
                  {isRegistered ? "Registered Theka" : "Google Places"}
                </Text>
              </View>
            </View>
          </View>

          {/* Distance and Type */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Ionicons
                name="resize-outline"
                size={22}
                color={colors.primary}
                style={styles.infoIcon}
              />

              <Text style={styles.infoLabel}>Distance</Text>

              <Text style={styles.infoValue}>
                {formatDistance(distanceMeters)}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons
                name="pricetag-outline"
                size={22}
                color={colors.primary}
                style={styles.infoIcon}
              />

              <Text style={styles.infoLabel}>Type</Text>

              <Text style={styles.infoValue}>{getPlaceType()}</Text>
            </View>
          </View>

          {/* Rating and Status */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Ionicons
                name="star-outline"
                size={22}
                color={colors.primary}
                style={styles.infoIcon}
              />

              <Text style={styles.infoLabel}>Rating</Text>

              <Text style={styles.infoValue}>
                {place.rating !== null && place.rating !== undefined
                  ? place.rating
                  : "N/A"}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons
                name={statusIcon}
                size={22}
                color={statusColor}
                style={styles.infoIcon}
              />

              <Text style={styles.infoLabel}>Status</Text>

              <Text
                style={[
                  styles.infoValue,
                  isRegistered
                    ? styles.registeredText
                    : isOpen === true
                      ? styles.openText
                      : isOpen === false
                        ? styles.closedText
                        : null,
                ]}
              >
                {isRegistered
                  ? "Registered"
                  : isOpen === true
                    ? "Open"
                    : isOpen === false
                      ? "Closed"
                      : "Unknown"}
              </Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="home-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.sectionTitle}>Address</Text>
            </View>

            <Text style={styles.address}>
              {place.address || "Address unavailable"}
            </Text>

            {!!place.city && (
              <Text style={styles.address}>
                {[place.city, place.state, place.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            )}
          </View>

          {/* Contact */}
          {phone && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Contact</Text>
              </View>

              <Text style={styles.address}>{phone}</Text>
            </View>
          )}

          {/* License details */}
          {isRegistered && place.licenseNumber && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>License Number</Text>
              </View>

              <Text style={styles.address}>{place.licenseNumber}</Text>
            </View>
          )}

          {/* Categories */}
          {Array.isArray(place.types) && place.types.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="pricetags-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Categories</Text>
              </View>

              <View style={styles.keywordsContainer}>
                {place.types.map((type, index) => (
                  <View
                    key={`${type}-${index}`}
                    style={styles.keywordBadge}
                  >
                    <Text style={styles.keywordText}>
                      {type.replace(/_/g, " ")}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Opening Hours */}
          {openingHours.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Opening Hours</Text>
              </View>

              {openingHours.map((hours, index) => (
                <Text
                  key={`${index}-${hours}`}
                  style={styles.hoursText}
                >
                  {hours}
                </Text>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={openInGoogleMaps}
              activeOpacity={0.8}
            >
              <Ionicons
                name="navigate-outline"
                size={21}
                color={colors.textWhite}
                style={styles.actionIcon}
              />

              <Text style={styles.actionButtonText}>
                Open in Google Maps
              </Text>
            </TouchableOpacity>

            {phone && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={callShop}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.actionIcon}
                />

                <Text style={styles.secondaryButtonText}>
                  Call Shop
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  map: {
    width: "100%",
    height: 250,
  },

  detailsCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  shopIcon: {
    marginRight: 12,
  },

  nameContainer: {
    flex: 1,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },

  sourceBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
  },

  registeredBadge: {
    backgroundColor: "#27763B",
  },

  googleBadge: {
    backgroundColor: colors.primaryLight,
  },

  sourceBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  registeredBadgeText: {
    color: "#FFFFFF",
  },

  googleBadgeText: {
    color: colors.primary,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  infoCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: "center",
  },

  infoIcon: {
    marginBottom: 4,
  },

  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },

  openText: {
    color: "#2E7D32",
  },

  closedText: {
    color: "#C62828",
  },

  registeredText: {
    color: "#2E7D32",
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },

  address: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },

  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  keywordBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  keywordText: {
    fontSize: 12,
    color: colors.textWhite,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  hoursText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },

  actions: {
    marginTop: 10,
    marginBottom: 100,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  primaryButton: {
    backgroundColor: colors.primary,
  },

  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  actionIcon: {
    marginRight: 8,
    color: colors.primaryLight
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryLight,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
});
