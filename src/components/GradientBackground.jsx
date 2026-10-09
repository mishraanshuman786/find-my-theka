import React from "react";
import { StyleSheet,Dimensions } from "react-native";
import RadialGradient from "react-native-radial-gradient";
import colors from "../constants/colors";



export default function GradientBackground({ style }) {
  // Extract clean hex values from your configuration structure
  const gradientColors = colors.primaryGradient.map((stop) => stop.color);
  
  // Convert text values like "45%" down into numeric percentages like 0.45
  const colorStops = colors.primaryGradient.map((stop) => parseFloat(stop.offset) / 100);

  // Dynamically catch layout width to anchor the exact absolute visual center coordinates
  const screenWidth = Dimensions.get("window").width;

  return (
    <RadialGradient
      style={[styles.gradient, style]}
      colors={gradientColors}
      stops={colorStops}
      center={[screenWidth / 2, 90]} // Centers perfectly across the horizontal screen axis at half your header layout box height (180 / 2)
      radius={240} // Spreads out just far enough to drop naturally over text margins
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
