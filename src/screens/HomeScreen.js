import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { useAuth } from "../context/AuthContext";
import { thekasAPI } from "../api/client";
import colors from "../constants/colors";
import NearbyPlacesSlider from "../components/Home/NearbyPlacesSlider";

const { height } = Dimensions.get("window");

const DEFAULT_LAT = 25.4358;
const DEFAULT_LNG = 82.8534;

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [radius, setRadius] = useState(5000);
  const [markersSettled, setMarkersSettled] = useState(false);

  useEffect(() => {
    requestLocationPermission();
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
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        await getCurrentLocation();
      } else {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find nearby liquor shops. Please enable it in settings.",
          [
            {
              text: "Use Default Location",
              onPress: () => {
                setLocation({
                  latitude: DEFAULT_LAT,
                  longitude: DEFAULT_LNG,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                });

                searchNearby(DEFAULT_LAT, DEFAULT_LNG);
              },
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

      setLocation({
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      searchNearby(DEFAULT_LAT, DEFAULT_LNG);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);

    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      await searchNearby(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);

      setLocation({
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      await searchNearby(DEFAULT_LAT, DEFAULT_LNG);
    } finally {
      setLoading(false);
    }
  };

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

      if (!result.success) {
        setPlaces([]);

        Alert.alert(
          "Search Failed",
          result.message || "Unable to find nearby liquor shops.",
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

      const validPlaces = [
        ...normalizedCustom,
        ...normalizedGoogle,
      ].filter((place) => {
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
      });

      console.log("Registered thekas:", normalizedCustom.length);
      console.log("Google Places:", normalizedGoogle.length);
      console.log("Combined nearby places:", validPlaces.length);

      setPlaces(validPlaces);

      if (validPlaces.length === 0) {
        Alert.alert(
          "No Results",
          "No liquor shops found in this area. Try increasing the search radius.",
        );
      }

      if (combinedData.sourceErrors?.length) {
        console.warn(
          "Some nearby-theka sources failed:",
          combinedData.sourceErrors,
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

  const handlePlacePress = (place) => {
    navigation.navigate("PlaceDetail", { place });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          Getting your location...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={
          location || {
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LNG,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }
        }
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        zoomEnabled
        scrollEnabled
      >
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

        {/* Nearby place markers */}
        {places.map((place, index) => {
          const markerLat =
            place.location?.lat ??
            location?.latitude +
              index * 0.001 * (index % 2 === 0 ? 1 : -1);

          const markerLng =
            place.location?.lng ??
            location?.longitude +
              index * 0.001 * (index % 2 === 0 ? -1 : 1);

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

      {/* Current location button */}
      <TouchableOpacity
        style={styles.locateButton}
        onPress={getCurrentLocation}
        activeOpacity={0.8}
      >
        <Ionicons
          name="locate-outline"
          size={24}
          color={colors.mapUserLocation}
        />
      </TouchableOpacity>

      {/* Nearby places slider */}
      <NearbyPlacesSlider
        places={places}
        searching={searching}
        onPlacePress={handlePlacePress}
        onRetry={getCurrentLocation}
      />
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

  locateButton: {
    position: "absolute",
    top: 16,
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