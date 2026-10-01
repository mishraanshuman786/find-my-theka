import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import {
  verifyPhoneOTP,
} from "../services/auth/phoneAuthService";

import { useAuth } from "../context/AuthContext";

export default function FirebaseVerifyOTPScreen({
  route,
  navigation,
}) {
  const {
    confirmation,
    phoneNumber,
  } = route.params;

  const { loginWithFirebase } = useAuth();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      setIsLoading(true);

      const result =
        await verifyPhoneOTP(
          confirmation,
          otp
        );

      const loginResult =
        await loginWithFirebase(
          result.firebaseIdToken
        );

      if (!loginResult.success) {
        Alert.alert(
          "Login Failed",
          loginResult.error ||
            "Unable to login."
        );
        return;
      }

      console.log(
        "Phone login successful"
      );
    } catch (error) {
      console.error(
        "OTP verification failed:",
        error
      );

      Alert.alert(
        "Verification Failed",
        error?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Verify your number
      </Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to
      </Text>

      <Text style={styles.phone}>
        {phoneNumber}
      </Text>

      <TextInput
        style={styles.otpInput}
        value={otp}
        onChangeText={(text) => {
          const numbersOnly =
            text.replace(/\D/g, "");

          if (numbersOnly.length <= 6) {
            setOtp(numbersOnly);
          }
        }}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="Enter OTP"
        placeholderTextColor="#B5AFB2"
      />

      <TouchableOpacity
        style={[
          styles.button,
          isLoading &&
            styles.buttonDisabled,
        ]}
        onPress={handleVerifyOTP}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading
            ? "Verifying..."
            : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        disabled={isLoading}
      >
        <Text style={styles.changeNumber}>
          Change number
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#000000",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#777171",
  },

  phone: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
  },

  otpInput: {
    height: 55,
    borderWidth: 1,
    borderColor: "#D5D1D1",
    borderRadius: 10,
    marginTop: 30,
    paddingHorizontal: 16,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: "center",
    color: "#222222",
  },

  button: {
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  changeNumber: {
    textAlign: "center",
    marginTop: 22,
    color: "#F5A900",
    fontSize: 15,
    fontWeight: "700",
  },
});