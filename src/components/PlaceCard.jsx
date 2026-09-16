import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import colors from '../constants/colors';

export default function PlaceCard({ place, onPress }) {
  const formatDistance = (meters) => {
    if (!meters) return 'N/A';
    if (meters < 1000) {
      return `${meters}m away`;
    }
    return `${(meters / 1000).toFixed(1)} km away`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🍺</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {place.address}
        </Text>
        <View style={styles.footer}>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>
              📍 {formatDistance(place.distance)}
            </Text>
          </View>
          {place.eLoc && (
            <Text style={styles.elocText}>{place.eLoc}</Text>
          )}
        </View>
      </View>
      <View style={styles.chevronContainer}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  distanceText: {
    fontSize: 11,
    color: colors.textWhite,
    fontWeight: '600',
  },
  elocText: {
    fontSize: 11,
    color: colors.textLight,
  },
  chevronContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
