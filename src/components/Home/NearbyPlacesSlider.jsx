import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import colors from "../../constants/colors";

export default function NearbyPlacesSlider({
  places = [],
  searching = false,
  onPlacePress,
  onRetry,
}) {
  const tabBarHeight = useBottomTabBarHeight();

  if (!searching && places.length === 0) {
    return (
      <View style={[styles.sliderContainer, { bottom: tabBarHeight + 10 }]}>
        <Pressable style={styles.emptyCard} onPress={onRetry}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.emptyText}>No shops found. Tap to retry.</Text>
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.sliderContainer, { bottom: tabBarHeight + 10 }]}>
      {searching && places.length === 0 ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Finding nearby places...</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={places}
          keyExtractor={(item, index) =>
            `${item.source || "place"}-${item.id ?? index}`
          }
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sliderList}
          renderItem={({ item }) => {
            const isRegistered =
              item.isRegistered === true || item.source === "custom";

            return (
              <Pressable
                style={styles.placeCard}
                onPress={() => onPlacePress?.(item)}
              >
                <View style={styles.cardContainer}>
                  {/* Place information */}
                  <View style={styles.placeInfo}>
                    <View style={styles.placeIcon}>
                      <Ionicons
                        name="storefront-outline"
                        size={25}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.placeTextContainer}>
                      <Text style={styles.placeName} numberOfLines={1}>
                        {item.name || "Liquor Shop"}
                      </Text>

                      <Text style={styles.placeAddress} numberOfLines={2}>
                        {item.address || "Address unavailable"}
                      </Text>
                    </View>
                  </View>

                  {/* Status badge and View Details in the same row */}
                  <View style={styles.placeBottomRow}>
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
                        size={12}
                        color={isRegistered ? "#FFFFFF" : colors.primary}
                      />

                      <Text
                        style={[
                          styles.sourceBadgeText,
                          isRegistered
                            ? styles.registeredBadgeText
                            : styles.googleBadgeText,
                        ]}
                        numberOfLines={1}
                      >
                        {isRegistered ? "Registered Theka" : "Google Places"}
                      </Text>
                    </View>

                    <Pressable
                      style={styles.placeActionRow}
                      onPress={() => onPlacePress?.(item)}
                      hitSlop={6}
                    >
                      <Text style={styles.placeAction}>View Details</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={13}
                        color={colors.primary}
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 10,
    zIndex: 20,
  },

  sliderList: {
    paddingHorizontal: 12,
    gap: 10,
  },

  placeCard: {
    width: 250,
    minHeight: 125,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    elevation: 3,
    marginVertical: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  cardContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  // Top row: icon + name/address
  placeInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    minWidth: 0,
  },

  placeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F8E9EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    flexShrink: 0,
  },

  placeTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  placeName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  placeAddress: {
    fontSize: 13,
    lineHeight: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Bottom row: status badge + View Details
  placeBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
    width: "100%",
  },

  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: "65%",
  },

  registeredBadge: {
    backgroundColor: "#27763B",
  },

  googleBadge: {
    backgroundColor: colors.primaryLight,
  },

  sourceBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    flexShrink: 1,
  },

  registeredBadgeText: {
    color: "#FFFFFF",
  },

  googleBadgeText: {
    color: colors.primary,
  },

  placeActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flexShrink: 0,
  },

  placeAction: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },

  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 12,
    padding: 16,
    elevation: 3,
  },

  emptyText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },

  loadingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 12,
    padding: 18,
    elevation: 3,
  },

  loadingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
