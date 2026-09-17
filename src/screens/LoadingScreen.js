import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import colors from '../constants/colors';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
       <Image
          source={require("../../assets/splash.png")}
          style={styles.logoImage}
          resizeMode="cover"
        />
        </View>
      <Text style={styles.appName}>FIND MY THEKA</Text>
      <Text style={styles.tagline}>Locate your nearest theka, instantly</Text>
      <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    color: colors.textWhite,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
  },
  loader: {
    marginTop: 10,
  },
});
