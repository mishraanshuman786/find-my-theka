import React, { useEffect, useRef } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
   Easing
} from 'react-native';
import colors from '../constants/colors';

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
      <View style={styles.logoContainer}>
       <Image
          source={require("../../assets/splash.png")}
          style={styles.logoImage}
          resizeMode="cover"
        />
        </View>
      <Text style={styles.appName}>FindMyTheka</Text>
      <Text style={styles.tagline}>Locate your nearest theka, instantly</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
  width: 110,
  height: 110,
  borderRadius: 55,
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.primary,
  marginBottom: 16,

  // Android shadow
  elevation: 6,

  // iOS shadow
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.3,
  shadowRadius: 6,
},
  logoImage: {
  width: '100%',
  height: '100%',

},
  // logoEmoji: {
  //   fontSize: 50,
  // },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.primaryDark,
    marginBottom: 30,
  },
  loader: {
  width: "80%",
  height: 6,
  backgroundColor: "#E5E5E5",
  borderRadius: 3,
  overflow: "hidden",
  alignSelf: "center",
},

loaderProgress: {
  height: "100%",
  backgroundColor: colors.primary, 
  borderRadius: 3,
},
});
