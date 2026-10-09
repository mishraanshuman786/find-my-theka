import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import RadialGradient from "react-native-radial-gradient";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const GradientHeader = ({
  navigation,
  options,
  back,
}) => {
  const { width } = Dimensions.get("window");

  const gradientColors = colors.primaryGradient.map(
    (stop) => stop.color
  );

  const gradientStops = colors.primaryGradient.map(
    (stop) => parseFloat(stop.offset) / 100
  );

  const title =
    options?.title ||
    options?.headerTitle ||
    "";

  return (
    <View style={styles.wrapper}>
      <RadialGradient
        colors={gradientColors}
        stops={gradientStops}
        center={[width / 2, 35]}
        radius={width}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        {back ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.white}
            />
          </Pressable>
        ) : (
          <View style={styles.leftSpacer} />
        )}

        <Text
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </Text>

        <View style={styles.rightSpacer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height:
      Platform.OS === "ios"
        ? 44
        : 56 + (StatusBar.currentHeight || 0),
    overflow: "hidden",
  },

  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight || 0
        : 0,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  leftSpacer: {
    width: 40,
    height: 40,
  },

  rightSpacer: {
    width: 40,
    height: 40,
  },

  title: {
    flex: 1,
    color: colors.white,
    textAlign: "left",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default GradientHeader;