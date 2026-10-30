import React, { useState, useEffect, useRef } from "react";

import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { useAuth } from "../context/AuthContext";
import { thekasAPI, placesAPI } from "../api/client";
import colors from "../constants/colors";
import NearbyPlacesSlider from "../components/Home/NearbyPlacesSlider";

const { height } = Dimensions.get("window");

const DEFAULT_LAT = 25.4358;
const DEFAULT_LNG = 82.8534;

const DEFAULT_REGION = {
  latitude: DEFAULT_LAT,
  longitude: DEFAULT_LNG,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function HomeScreen({ navigation, route }) {
  const { user, logout } = useAuth();

  const mapRef = useRef(null);

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [newLocationLabel, setNewLocationLabel] = useState("");
  const [pendingCoordinates, setPendingCoordinates] = useState(null);

  const [location, setLocation] = useState(null);
  const [locationTitle, setLocationTitle] = useState("You are here");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [radius, setRadius] = useState(5000);
  const [markersSettled, setMarkersSettled] = useState(false);

  // Get the device location when Home first opens, unless a saved
  // location was passed from the Saved Locations screen.
  useEffect(() => {
    // If a saved location was passed, use it instead of requesting
    // the device's current location on initial mount.
    if (route?.params?.savedLocation) {
      return;
    }

    requestLocationPermission();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Allow custom map markers to render, then freeze their view updates.
  useEffect(() => {
    if (places.length > 0) {
      setMarkersSettled(false);

      const timer = setTimeout(() => {
        setMarkersSettled(true);
      }, 500);

      return () => clearTimeout(timer);
    }

    setMarkersSettled(false);
  }, [places]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        await getCurrentLocation();
      } else {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find nearby liquor shops. You can use the default location instead.",
          [
            {
              text: "Use Default Location",
              onPress: async () => {
                const defaultLocation = {
                  ...DEFAULT_REGION,
                };

                setLocation(defaultLocation);
                setLocationTitle("Default location");

                await searchNearby(DEFAULT_LAT, DEFAULT_LNG);
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
        );
      }
    } catch (error) {
      console.error("Location permission error:", error);

      setLocation({ ...DEFAULT_REGION });
      setLocationTitle("Default location");

      await searchNearby(DEFAULT_LAT, DEFAULT_LNG);
    }
  };

  // Get the current device GPS location and search nearby thekas.
  const getCurrentLocation = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access to find nearby liquor shops.",
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      const currentRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setLocation(currentRegion);
      setLocationTitle("You are here");

      mapRef.current?.animateToRegion(currentRegion, 700);

      await searchNearby(latitude, longitude);
    } catch (error) {
      console.error("Error getting current location:", error);

      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby thekas around the supplied coordinates.
  const searchNearby = async (lat, lng, selectedRadius = radius) => {
    setSearching(true);

    try {
      const response = await thekasAPI.getNearbyCombined({
        lat,
        lng,
        radius: selectedRadius,
        limit: 20,
      });

      const result = response.data;

      if (!result?.success) {
        setPlaces([]);

        Alert.alert(
          "Search Failed",
          result?.message || "Unable to find nearby liquor shops.",
        );

        return;
      }

      const combinedData = result.data || {};

      const customThekas = Array.isArray(combinedData.custom)
        ? combinedData.custom
        : [];

      const googlePlaces = Array.isArray(combinedData.google)
        ? combinedData.google
        : [];

      const normalizedCustom = customThekas.map((theka) => ({
        ...theka,
        id: theka.id,
        name: theka.name,
        address: theka.address || "Address unavailable",
        location: {
          lat: Number(theka.latitude),
          lng: Number(theka.longitude),
        },
        distanceMeters: theka.distanceMeters,
        source: "custom",
        isRegistered: true,
      }));

      const normalizedGoogle = googlePlaces.map((place) => ({
        ...place,
        location: {
          lat: Number(place.location?.lat),
          lng: Number(place.location?.lng),
        },
        distanceMeters: place.distanceMeters ?? place.distance,
        source: "google",
        isRegistered: false,
      }));

      const validPlaces = [...normalizedCustom, ...normalizedGoogle].filter(
        (place) => {
          const latValue = place.location?.lat;
          const lngValue = place.location?.lng;

          return (
            Number.isFinite(latValue) &&
            Number.isFinite(lngValue) &&
            latValue >= -90 &&
            latValue <= 90 &&
            lngValue >= -180 &&
            lngValue <= 180 &&
            !(latValue === 0 && lngValue === 0)
          );
        },
      );

      console.log("Registered thekas:", normalizedCustom.length);
      console.log("Google Places:", normalizedGoogle.length);
      console.log("Combined nearby places:", validPlaces.length);

      setPlaces(validPlaces);

      if (combinedData.sourceErrors?.length) {
        console.warn(
          "Some nearby-theka sources failed:",
          combinedData.sourceErrors,
        );
      }

      if (validPlaces.length === 0) {
        Alert.alert(
          "No Results",
          "No liquor shops found in this area. Try increasing the search radius.",
        );
      }
    } catch (error) {
      console.error(
        "Error searching nearby thekas:",
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

  useEffect(() => {
    const savedLocation = route?.params?.savedLocation;

    if (!savedLocation) {
      return;
    }

    const latitude = Number(savedLocation.latitude);
    const longitude = Number(savedLocation.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      Alert.alert(
        "Invalid Location",
        "The saved location has invalid coordinates.",
      );

      navigation.setParams({ savedLocation: undefined });
      return;
    }

    const savedRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    console.log("Opening saved location on map:", {
      label: savedLocation.label,
      latitude,
      longitude,
    });

    setLocation(savedRegion);
    setLocationTitle(savedLocation.label || "Saved location");

    // Animate the map if its ref is already available.
    mapRef.current?.animateToRegion(savedRegion, 700);

    // Fetch nearby thekas around the saved coordinates.
    searchNearby(latitude, longitude, 5000);

    // Prevent the same saved location from being processed again.
    navigation.setParams({ savedLocation: undefined });

    // searchNearby and mapRef are assumed to be defined in this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.savedLocation, navigation]);

  // Handle a saved location passed from the Saved Locations screen.
  useEffect(() => {
    const savedLocation = route?.params?.savedLocation;

    if (!savedLocation) {
      return;
    }

    const latitude = Number(savedLocation.latitude);
    const longitude = Number(savedLocation.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      Alert.alert(
        "Invalid Location",
        "The saved location has invalid coordinates.",
      );

      navigation.setParams({ savedLocation: undefined });
      return;
    }

    const savedRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    setLocation(savedRegion);
    setLocationTitle(savedLocation.label || "Saved location");

    mapRef.current?.animateToRegion(savedRegion, 700);

    searchNearby(latitude, longitude, 5000);

    // Clear the parameter so returning to Home does not repeatedly
    // trigger the same saved-location search.
    navigation.setParams({ savedLocation: undefined });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.savedLocation]);

  // Save the device's current GPS coordinates to the backend.
  const saveCurrentLocation = async () => {
    if (savingLocation) return;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Allow location access before saving your current location.",
        );
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentPosition.coords;

      setPendingCoordinates({ latitude, longitude });
      setNewLocationLabel("");
      setSaveModalVisible(true);
    } catch (error) {
      console.error("Error getting location to save:", error);

      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please try again.",
      );
    }
  };

  const confirmSaveLocation = async () => {
    const label = newLocationLabel.trim();

    if (!label) {
      Alert.alert("Label Required", "Please enter a name for this location.");
      return;
    }

    if (label.length > 100) {
      Alert.alert("Label Too Long", "The label cannot exceed 100 characters.");
      return;
    }

    if (!pendingCoordinates || savingLocation) return;

    setSavingLocation(true);

    try {
      const response = await placesAPI.saveLocation({
        label,
        latitude: pendingCoordinates.latitude,
        longitude: pendingCoordinates.longitude,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to save this location.",
        );
      }

      setSaveModalVisible(false);
      setNewLocationLabel("");
      setPendingCoordinates(null);

      Alert.alert("Location Saved", `"${label}" has been saved successfully.`);
    } catch (error) {
      console.error(
        "Error saving location:",
        error?.response?.data || error.message,
      );

      Alert.alert(
        "Unable to Save",
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong while saving your location.",
      );
    } finally {
      setSavingLocation(false);
    }
  };
  const handlePlacePress = (place) => {
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
        ref={mapRef}
        style={styles.map}
        initialRegion={location || DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        zoomEnabled
        scrollEnabled
      >
        {/* Selected location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={locationTitle}
            pinColor={colors.mapUserLocation}
          />
        )}

        {/* Nearby theka markers */}
        {places.map((place, index) => {
          const markerLat =
            place.location?.lat ??
            location?.latitude + index * 0.001 * (index % 2 === 0 ? 1 : -1);

          const markerLng =
            place.location?.lng ??
            location?.longitude + index * 0.001 * (index % 2 === 0 ? -1 : 1);

          return (
            <Marker
              key={`${place.source || "place"}-${place.id ?? index}`}
              coordinate={{
                latitude: Number(markerLat),
                longitude: Number(markerLng),
              }}
              title={place.name}
              description={place.address}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={!markersSettled}
              onPress={() => handlePlacePress(place)}
            >
              <View style={styles.customMarker}>
                <Image
                  source={require("../../assets/splash.png")}
                  style={styles.markerImage}
                  resizeMode="contain"
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Save current GPS location */}
      <TouchableOpacity
        style={[styles.actionButton, styles.saveLocationButton]}
        onPress={saveCurrentLocation}
        activeOpacity={0.8}
        disabled={savingLocation}
        accessibilityLabel="Save current location"
      >
        {savingLocation ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="bookmark-outline" size={23} color={colors.primary} />
        )}
      </TouchableOpacity>

      {/* Return to the device's current location */}
      <TouchableOpacity
        style={[styles.actionButton, styles.locateButton]}
        onPress={getCurrentLocation}
        activeOpacity={0.8}
        accessibilityLabel="Go to current location"
      >
        <Ionicons
          name="locate-outline"
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>

      {/* Nearby places slider */}
      <NearbyPlacesSlider
        places={places}
        searching={searching}
        onPlacePress={handlePlacePress}
        onRetry={getCurrentLocation}
      />

      {/* Modal for giving the label to saved screen */}
      <Modal
        visible={saveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!savingLocation) setSaveModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 22,
            backgroundColor: "rgba(0,0,0,0.48)",
          }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 22,
              borderRadius: 18,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#1B4332",
              }}
            >
              Save Location
            </Text>

            <Text
              style={{
                marginTop: 8,
                marginBottom: 16,
                color: "#6B7280",
                lineHeight: 20,
              }}
            >
              Give this location a memorable name.
            </Text>

            <TextInput
              value={newLocationLabel}
              onChangeText={setNewLocationLabel}
              placeholder="e.g. Home, Office, Favourite Shop"
              placeholderTextColor="#9CA3AF"
              maxLength={100}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={confirmSaveLocation}
              editable={!savingLocation}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 10,
                paddingHorizontal: 13,
                paddingVertical: 12,
                fontSize: 15,
                color: "#111827",
              }}
            />

            <Text
              style={{
                textAlign: "right",
                color: "#9CA3AF",
                fontSize: 11,
                marginTop: 5,
              }}
            >
              {newLocationLabel.length}/100
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setSaveModalVisible(false)}
                disabled={savingLocation}
                style={{
                  flex: 1,
                  padding: 13,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#F3F4F6",
                }}
              >
                <Text style={{ color: "#374151", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmSaveLocation}
                disabled={savingLocation}
                style={{
                  flex: 1,
                  padding: 13,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#1B4332",
                  opacity: savingLocation ? 0.65 : 1,
                }}
              >
                {savingLocation ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    Save Location
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  actionButton: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  saveLocationButton: {
    top: 16,
    backgroundColor:colors.primaryLight,
  },

  locateButton: {
    top: 70,
    backgroundColor:colors.primaryLight,
  },

  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  markerImage: {
    width: 26,
    height: 26,
  },
});
