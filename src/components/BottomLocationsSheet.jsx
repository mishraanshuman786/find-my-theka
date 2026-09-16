
import React, { useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import colors from "../constants/colors";
import PlaceCard from "./PlaceCard";

const { height } = Dimensions.get("window");

// Sheet heights
const COLLAPSED_HEIGHT = 85;
const EXPANDED_HEIGHT = height * 0.65;

const BottomLocationsSheet = ({
  places,
  searching,
  showPlaceList,
  onToggle,
  onPlacePress,
  onRetry,
}) => {
  const collapsedPosition =
    EXPANDED_HEIGHT - COLLAPSED_HEIGHT;

  const translateY = useSharedValue(
    showPlaceList ? 0 : collapsedPosition
  );

  const startY = useSharedValue(0);

  /*
   * Keep parent state synchronized
   */
  const updateParentState = useCallback(
    (expanded) => {
      if (expanded !== showPlaceList) {
        onToggle();
      }
    },
    [showPlaceList, onToggle]
  );

  /*
   * Bottom sheet gesture
   *
   * Gesture is attached only to the handle,
   * so FlatList scrolling works normally.
   */
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newPosition =
        startY.value + event.translationY;

      translateY.value = Math.max(
        0,
        Math.min(collapsedPosition, newPosition)
      );
    })
    .onEnd((event) => {
      const currentPosition = translateY.value;

      const shouldExpand =
        currentPosition < collapsedPosition / 2 ||
        event.velocityY < -500;

      const targetPosition = shouldExpand
        ? 0
        : collapsedPosition;

      translateY.value = withSpring(targetPosition, {
        damping: 20,
        stiffness: 180,
        mass: 0.8,
      });

      runOnJS(updateParentState)(shouldExpand);
    });

  /*
   * Animated sheet
   */
  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  /*
   * Header toggle
   */
  const handleToggle = () => {
    const expanded = !showPlaceList;

    translateY.value = withSpring(
      expanded ? 0 : collapsedPosition,
      {
        damping: 20,
        stiffness: 180,
        mass: 0.8,
      }
    );

    onToggle();
  };

  /*
   * Drag handle
   */
  const renderHandle = () => (
    <GestureDetector gesture={panGesture}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
    </GestureDetector>
  );

  /*
   * Location card
   */
  const renderPlace = ({ item }) => (
    <PlaceCard
      place={item}
      onPress={() => onPlacePress(item)}
    />
  );

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        animatedSheetStyle,
      ]}
    >
      {/* DRAG HANDLE */}
      {renderHandle()}

      {searching ? (
        <View style={styles.loadingContent}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.searchingText}>
            Searching nearby thekas...
          </Text>
        </View>
      ) : (
        <>
          {/* HEADER */}
        <TouchableOpacity
  activeOpacity={0.8}
  onPress={handleToggle}
  style={[
    styles.bottomSheetHeader,
    !showPlaceList && styles.collapsedHeader,
  ]}
>
            <Text style={styles.bottomSheetTitle}>
              🍺 Nearby Liquor Shops ({places.length})
            </Text>

            <Text style={styles.expandText}>
              {showPlaceList ? "▼" : "▲"}
            </Text>
          </TouchableOpacity>

          {/* 
            ONLY SHOW LOCATIONS WHEN EXPANDED

            When collapsed:
            Handle
            +
            Header

            When expanded:
            Handle
            +
            Header
            +
            Scrollable location list
          */}
          {showPlaceList && (
            <FlatList
              data={places}
              keyExtractor={(item, index) =>
                item.id
                  ? item.id.toString()
                  : index.toString()
              }
              renderItem={renderPlace}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={
                styles.placesListContent
              }
              style={styles.placesList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No liquor shops found nearby
                  </Text>

                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={onRetry}
                  >
                    <Text style={styles.retryButtonText}>
                      Retry
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </>
      )}
    </Animated.View>
  );
};

export default BottomLocationsSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    // Sheet always has expanded height.
    // translateY moves it up/down.
    height: EXPANDED_HEIGHT,

    backgroundColor: colors.cardBackground,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    elevation: 8,
    zIndex: 10,

    overflow: "hidden",
  },

  handleContainer: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
  },

  handle: {
    width: 45,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },

  loadingContent: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  searchingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
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
    paddingHorizontal: 8,
  },

  /*
   * Expanded location list
   */
  placesList: {
    flex: 1,
  },

  placesListContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 30,
  },

  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
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
  collapsedHeader: {
  borderBottomWidth: 0,
},
});
