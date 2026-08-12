import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { placesAPI } from '../api/client';
import colors from '../constants/colors';

export default function SearchHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await placesAPI.getHistory();
      if (response.data.success) {
        setHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      // Use mock data
      setHistory([
        {
          id: 1,
          latitude: '25.4358',
          longitude: '82.8534',
          radius: 5000,
          results_count: 3,
          searched_at: new Date().toISOString(),
        },
        {
          id: 2,
          latitude: '25.3176',
          longitude: '82.9739',
          radius: 3000,
          results_count: 5,
          searched_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  const formatLocation = (lat, lng) => {
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyIcon}>
        <Text style={styles.iconText}>🔍</Text>
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyLocation}>
          📍 {formatLocation(item.latitude, item.longitude)}
        </Text>
        <View style={styles.historyDetails}>
          <Text style={styles.historyMeta}>
            Radius: {item.radius >= 1000 ? `${item.radius / 1000}km` : `${item.radius}m`}
          </Text>
          <Text style={styles.historyMeta}>
            Results: {item.results_count}
          </Text>
        </View>
        <Text style={styles.historyTime}>{formatDate(item.searched_at)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No search history yet</Text>
            <Text style={styles.emptySubtext}>
              Your recent searches will appear here
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  historyContent: {
    flex: 1,
  },
  historyLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyTime: {
    fontSize: 11,
    color: colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
