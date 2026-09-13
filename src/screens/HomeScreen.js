import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import MapView, { Marker, Callout, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth } from "../context/AuthContext";
import { placesAPI } from "../api/client";
import colors from "../constants/colors";
import PlaceCard from "../components/PlaceCard";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [radius, setRadius] = useState(5000);

  // Request location permission on mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        getCurrentLocation();
      } else {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find nearby liquor shops. Please enable it in settings.",
          [
            {
              text: "Use Default Location",
              onPress: () => searchNearby(25.4358, 82.8534),
            },
            {
              text: "Open Settings",
              onPress: () => Location.getForegroundPermissionsAsync(),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Location permission error:", error);
      // Use default location (Varanasi)
      searchNearby(25.4358, 82.8534);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      searchNearby(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
      );
    } catch (error) {
      console.error("Error getting location:", error);
      // Use default location
      setLocation({
        latitude: 25.4358,
        longitude: 82.8534,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      searchNearby(25.4358, 82.8534);
    } finally {
      setLoading(false);
    }
  };

  const searchNearby = async (lat, lng, selectedRadius = radius) => {
    setSearching(true);

    try {
      const response = await placesAPI.getNearby({
        lat,
        lng,
        radius: selectedRadius,
      });

      const result = response.data;

      if (result.success) {
        const nearbyPlaces = result.data?.places || [];

        setPlaces(nearbyPlaces);

        if (nearbyPlaces.length === 0) {
          Alert.alert(
            "No Results",
            "No liquor shops found in this area. Try increasing the search radius.",
          );
        }
      } else {
        setPlaces([]);
        Alert.alert(
          "Search Failed",
          result.message || "Unable to find nearby liquor shops.",
        );
      }
    } catch (error) {
      console.error(
        "Error searching nearby:",
        error.response?.data || error.message,
      );

      setPlaces([]);

      Alert.alert(
        "Error",
        "Unable to find nearby liquor shops. Please try again.",
      );
    } finally {
      setSearching(false);
    }
  };

  const handlePlacePress = (place) => {
    setSelectedPlace(place);
    navigation.navigate("PlaceDetail", { place });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        mapType="none"
        initialRegion={
          location || {
            latitude: 25.4358,
            longitude: 82.8534,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }
        }
        showsUserLocation
        showsMyLocationButton
        showsCompass
        zoomEnabled
        scrollEnabled
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {/* User location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            pinColor={colors.mapUserLocation}
          />
        )}

        {/* Place markers */}
        {places.map((place, index) => {
          const markerLat =
            place.location?.lat ||
            location?.latitude + index * 0.001 * (index % 2 === 0 ? 1 : -1);
          const markerLng =
            place.location?.lng ||
            location?.longitude + index * 0.001 * (index % 2 === 0 ? -1 : 1);

          return (
            <Marker
              key={place.id || index}
              coordinate={{
                latitude: parseFloat(markerLat),
                longitude: parseFloat(markerLng),
              }}
              title={place.name}
              description={place.address}
              onPress={() => handlePlacePress(place)}
            >
              <View style={styles.customMarker}>
                <Text style={styles.markerText}>🍺</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer?.()}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.locateButton}
          onPress={getCurrentLocation}
        >
          <Text style={styles.locateButtonText}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Radius Selector */}
      <View style={styles.radiusContainer}>
        <Text style={styles.radiusLabel}>Radius: </Text>
        {[1000, 3000, 5000, 10000].map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.radiusButton,
              radius === r && styles.radiusButtonActive,
            ]}
            onPress={() => {
              setRadius(r);

              if (location) {
                searchNearby(location.latitude, location.longitude, r);
              }
            }}
          >
            <Text
              style={[
                styles.radiusButtonText,
                radius === r && styles.radiusButtonTextActive,
              ]}
            >
              {r >= 1000 ? `${r / 1000}km` : `${r}m`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Sheet - Places List */}
      {searching ? (
        <View style={styles.bottomSheet}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.searchingText}>Searching nearby thekas...</Text>
        </View>
      ) : (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              🍺 Nearby Liquor Shops ({places.length})
            </Text>
            <TouchableOpacity onPress={() => setShowPlaceList(!showPlaceList)}>
              <Text style={styles.expandText}>{showPlaceList ? "▼" : "▲"}</Text>
            </TouchableOpacity>
          </View>

          {showPlaceList ? (
            <FlatList
              data={places}
              keyExtractor={(item) => item.id || Math.random().toString()}
              renderItem={({ item }) => (
                <PlaceCard
                  place={item}
                  onPress={() => handlePlacePress(item)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No liquor shops found nearby
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={getCurrentLocation}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              }
              style={styles.placesList}
            />
          ) : (
            <FlatList
              data={places.slice(0, 2)}
              keyExtractor={(item) => item.id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <PlaceCard
                  place={item}
                  onPress={() => handlePlacePress(item)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              }
            />
          )}
        </View>
      )}

      {/* Header Menu */}
      <View style={styles.headerMenu}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("SearchHistory")}
        >
          <Text style={styles.headerIcon}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.headerIcon}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={logout}>
          <Text style={styles.headerIcon}>🚪</Text>
        </TouchableOpacity>
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
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  topControls: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButtonText: {
    fontSize: 20,
  },
  locateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  locateButtonText: {
    fontSize: 20,
  },
  radiusContainer: {
    position: "absolute",
    top: 104,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginRight: 4,
  },
  radiusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginHorizontal: 2,
  },
  radiusButtonActive: {
    backgroundColor: colors.primary,
  },
  radiusButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  radiusButtonTextActive: {
    color: colors.textWhite,
    fontWeight: "600",
  },
  headerMenu: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 11,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerIcon: {
    fontSize: 18,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  expandText: {
    fontSize: 18,
    color: colors.primary,
  },
  horizontalList: {
    padding: 12,
  },
  placesList: {
    maxHeight: 300,
  },
  searchingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.textWhite,
    fontWeight: "600",
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  markerText: {
    fontSize: 20,
  },
});
