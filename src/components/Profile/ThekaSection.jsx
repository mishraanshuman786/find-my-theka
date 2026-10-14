import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GradientBackground from "../GradientBackground";
import colors from "../../constants/colors";
import { thekasAPI } from "../../api/client";

const ThekaSection = ({ navigation }) => {
  const [thekas, setThekas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadThekas = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);

      const response = await thekasAPI.getMyThekas();
      const data = response.data;

      // Supports either a direct array or a wrapped API response.
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.thekas)
            ? data.thekas
            : [];

      setThekas(list);
    } catch (error) {
      console.error(
        "Failed to load user's thekas:",
        error.response?.data || error.message
      );
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh whenever the Profile screen comes into focus.
  useFocusEffect(
    useCallback(() => {
      loadThekas();
    }, [loadThekas])
  );

  const hasThekas = thekas.length > 0;

  const handlePress = () => {
  if (loadError) {
    loadThekas();
    return;
  }

  if (hasThekas) {
    navigation.navigate("ThekaListScreen");
  } else {
    navigation.navigate("CreateThekaIntro");
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={[
          styles.card,
          hasThekas ? styles.myThekasCard : styles.addThekaCard,
        ]}
        activeOpacity={0.85}
        onPress={handlePress}
      >
        <GradientBackground />
        <View style={styles.iconContainer}>
          <Ionicons
            name={hasThekas ? "storefront-outline" : "add-circle-outline"}
            size={30}
            color={colors.primaryLight}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>
            {loadError
              ? "Couldn't Load Thekas"
              : hasThekas
                ? "My Thekas"
                : "Add Your First Theka"}
          </Text>

          <Text style={styles.subheading}>
            {loadError
              ? "Tap to try again"
              : hasThekas
                ? "View and manage your registered shops"
                : "Register your shop to get started"}
          </Text>
        </View>

        {hasThekas && !loadError && (
          <View style={styles.countContainer}>
            <Text style={styles.count}>{thekas.length}</Text>
            <Text style={styles.countLabel}>
              {thekas.length === 1 ? "Registered" : "Registered"}
            </Text>
          </View>
        )}

        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.primaryLight}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ThekaSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  loadingContainer: {
    padding: 28,
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    overflow:"hidden",
    gap: 12,
  },
  myThekasCard: {
    backgroundColor: colors.primary,
  },
  addThekaCard: {
    backgroundColor: colors.primaryDark,
    
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  heading: {
    color: colors.primaryLight,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  subheading: {
    color: colors.primaryLight,
    fontSize: 12,
    lineHeight: 18,
  },
  countContainer: {
    alignItems: "center",
    minWidth: 44,
  },
  count: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primaryLight,
  },
  countLabel: {
    fontSize: 9,
    color: colors.primaryLight,
  },
});

