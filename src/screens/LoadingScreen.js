import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

import colors from "../constants/colors";
import GradientBackground from "../components/GradientBackground";

export default function LoadingScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>

      {/* Background */}
     <GradientBackground style={styles.background} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.appName}>
          FindMyTheka
        </Text>

        <Text style={styles.tagline}>
          Locate your nearest theka, instantly
        </Text>

        <View style={styles.loader}>
          <Animated.View
            style={[
              styles.loaderProgress,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F070D",
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primaryLight,
    marginBottom: 8,
  },

  tagline: {
    fontSize: 16,
    color: colors.primaryLight,
    textAlign: "center",
    marginBottom: 30,
  },

  loader: {
    width: "80%",
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },

  loaderProgress: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});