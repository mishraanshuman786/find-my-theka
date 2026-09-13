import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import colors from '../constants/colors';

export default function PlaceDetailScreen({
  route,
  navigation,
}) {
  const { place } = route.params;

  const latitude = Number(place.location?.lat);
  const longitude = Number(place.location?.lng);

  const formatDistance = (meters) => {
    if (meters === null || meters === undefined) {
      return 'N/A';
    }

    if (meters < 1000) {
      return `${Math.round(meters)} meters`;
    }

    return `${(meters / 1000).toFixed(2)} km`;
  };

  const getPlaceType = () => {
    if (!place.types || place.types.length === 0) {
      return 'Liquor Shop';
    }

    if (place.types.includes('liquor_store')) {
      return 'Liquor Shop';
    }

    return place.types[0]
      ?.replace(/_/g, ' ')
      ?.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const openInGoogleMaps = async () => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert(
        'Location unavailable',
        'Location information is not available for this shop.'
      );

      return;
    }

    const url =
      `https://www.google.com/maps/search/?api=1` +
      `&query=${latitude},${longitude}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to open Google Maps.'
      );
    }
  };

  return (
    <View style={styles.container}>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Number.isFinite(latitude)
            ? latitude
            : 25.4358,

          longitude: Number.isFinite(longitude)
            ? longitude
            : 82.8534,

          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {Number.isFinite(latitude) &&
          Number.isFinite(longitude) && (
            <Marker
              coordinate={{
                latitude,
                longitude,
              }}
              title={place.name}
              description={place.address}
              pinColor={colors.primary}
            />
          )}
      </MapView>

      {/* Details */}
      <View style={styles.detailsCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.shopIcon}>
              🍺
            </Text>

            <Text style={styles.name}>
              {place.name}
            </Text>
          </View>

          {/* Information */}
          <View style={styles.infoRow}>

            {/* Distance */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>
                📍
              </Text>

              <Text style={styles.infoLabel}>
                Distance
              </Text>

              <Text style={styles.infoValue}>
                {formatDistance(place.distance)}
              </Text>
            </View>

            {/* Type */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>
                🏷️
              </Text>

              <Text style={styles.infoLabel}>
                Type
              </Text>

              <Text style={styles.infoValue}>
                {getPlaceType()}
              </Text>
            </View>
          </View>

          {/* Rating + Status */}
          <View style={styles.infoRow}>

            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>
                ⭐
              </Text>

              <Text style={styles.infoLabel}>
                Rating
              </Text>

              <Text style={styles.infoValue}>
                {place.rating !== null &&
                place.rating !== undefined
                  ? place.rating
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>
                🟢
              </Text>

              <Text style={styles.infoLabel}>
                Status
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  place.isOpen === true
                    ? styles.openText
                    : place.isOpen === false
                    ? styles.closedText
                    : null,
                ]}
              >
                {place.isOpen === true
                  ? 'Open'
                  : place.isOpen === false
                  ? 'Closed'
                  : 'Unknown'}
              </Text>
            </View>

          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📍 Address
            </Text>

            <Text style={styles.address}>
              {place.address || 'Address unavailable'}
            </Text>
          </View>

          {/* Types */}
          {place.types &&
            place.types.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🏷️ Categories
                </Text>

                <View style={styles.keywordsContainer}>
                  {place.types.map((type, index) => (
                    <View
                      key={`${type}-${index}`}
                      style={styles.keywordBadge}
                    >
                      <Text style={styles.keywordText}>
                        {type.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Opening Hours */}
          {place.openingHours &&
            place.openingHours.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🕐 Opening Hours
                </Text>

                {place.openingHours.map(
                  (hours, index) => (
                    <Text
                      key={index}
                      style={styles.hoursText}
                    >
                      {hours}
                    </Text>
                  )
                )}
              </View>
            )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.primaryButton,
              ]}
              onPress={openInGoogleMaps}
            >
              <Text style={styles.actionIcon}>
                🗺️
              </Text>

              <Text style={styles.actionButtonText}>
                Open in Google Maps
              </Text>
            </TouchableOpacity>
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
    width: '100%',
    height: 250,
  },

  detailsCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  shopIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  infoCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },

  openText: {
    color: '#2E7D32',
  },

  closedText: {
    color: '#C62828',
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },

  address: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  hoursText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },

  actions: {
    marginTop: 10,
    marginBottom: 30,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  primaryButton: {
    backgroundColor: colors.primary,
  },

  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});