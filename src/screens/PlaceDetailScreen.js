import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import colors from '../constants/colors';

export default function PlaceDetailScreen({ route, navigation }) {
  const { place } = route.params;

  const formatDistance = (meters) => {
    if (!meters) return 'N/A';
    if (meters < 1000) return `${meters} meters`;
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const openInGoogleMaps = () => {
    const lat = place.location?.lat || '25.4358';
    const lng = place.location?.lng || '82.8534';
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const openInMappls = () => {
    if (place.eLoc) {
      const url = `https://mappls.com/${place.eLoc}`;
      Linking.openURL(url);
    }
  };

  const callShop = () => {
    // If phone number is available, open dialer
    Alert?.alert('Call', 'Phone number not available for this shop');
  };

  return (
    <View style={styles.container}>
      {/* Map at top */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(place.location?.lat) || 25.4358,
          longitude: parseFloat(place.location?.lng) || 82.8534,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(place.location?.lat) || 25.4358,
            longitude: parseFloat(place.location?.lng) || 82.8534,
          }}
          title={place.name}
          pinColor={colors.primary}
        />
      </MapView>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.shopIcon}>🍺</Text>
            <Text style={styles.name}>{place.name}</Text>
          </View>

          {/* Info Cards */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{formatDistance(place.distance)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🏷️</Text>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{place.type || 'POI'}</Text>
            </View>
          </View>

          {place.eLoc && (
            <View style={styles.infoCardFull}>
              <Text style={styles.infoIcon}>🗺️</Text>
              <Text style={styles.infoLabel}>Mappls eLoc</Text>
              <Text style={styles.infoValue}>{place.eLoc}</Text>
            </View>
          )}

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Address</Text>
            <Text style={styles.address}>{place.address}</Text>
          </View>

          {/* Keywords */}
          {place.keywords && place.keywords.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏷️ Keywords</Text>
              <View style={styles.keywordsContainer}>
                {place.keywords.map((kw, index) => (
                  <View key={index} style={styles.keywordBadge}>
                    <Text style={styles.keywordText}>{kw}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={openInGoogleMaps}
            >
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionButtonText}>Open in Maps</Text>
            </TouchableOpacity>

            {place.eLoc && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={openInMappls}
              >
                <Text style={styles.actionIcon}>📌</Text>
                <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
                  Open in Mappls
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
  infoCardFull: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
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
  secondaryActionText: {
    color: colors.primary,
  },
});
