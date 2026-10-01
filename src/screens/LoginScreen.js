import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { sendPhoneOTP } from "../services/auth/phoneAuthService";
import { signInWithGoogle } from "../services/auth/googleAuthService";
import { useAuth } from "../context/AuthContext";
import colors from "../constants/colors";

export default function LoginScreen({ navigation }) {
  const {
    login,
    loginWithFirebase,
    error,
    clearError,
  } = useAuth();

  const [loginType, setLoginType] = useState("mobile");

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const [isEmailLoading, setIsEmailLoading] = useState(false);
const [isOtpLoading, setIsOtpLoading] = useState(false);
const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // Google Login
  // --------------------------------------------------

  const handleGoogleLogin = async () => {
  try {
    setIsGoogleLoading(true);
    clearError();

    const result = await signInWithGoogle();

    const loginResult = await loginWithFirebase(
      result.firebaseIdToken
    );

    if (!loginResult.success) {
      Alert.alert(
        "Google Login Failed",
        loginResult.error
      );
      return;
    }

    console.log("Google login successful");
  } catch (error) {
    console.error(
      "Google login failed:",
      error.message
    );

    Alert.alert(
      "Google Login Failed",
      error.message ||
        "Unable to login with Google"
    );
  } finally {
    setIsGoogleLoading(false);
  }
};

  // --------------------------------------------------
  // Email Login
  // --------------------------------------------------

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Error",
        "Please enter your email"
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Error",
        "Please enter your password"
      );
      return;
    }

    try {
     setIsEmailLoading(true);
      clearError();

      const result = await login(
        email.trim(),
        password
      );

      if (!result.success) {
        Alert.alert(
          "Login Failed",
          result.error
        );
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  // --------------------------------------------------
  // Phone OTP
  // --------------------------------------------------

  const handleSendOTP = async () => {
  const cleanedMobile = mobile
    .replace(/\D/g, "")
    .trim();

  if (!cleanedMobile) {
    Alert.alert(
      "Invalid Mobile Number",
      "Please enter your mobile number."
    );
    return;
  }

  if (cleanedMobile.length !== 10) {
    Alert.alert(
      "Invalid Mobile Number",
      "Please enter a valid 10-digit mobile number."
    );
    return;
  }

  try {
    setIsOtpLoading(true);
    clearError();

    const phoneNumber = `+91${cleanedMobile}`;

    const confirmation =
      await sendPhoneOTP(phoneNumber);

    navigation.navigate("VerifyFirebaseOtp", {
      confirmation,
      phoneNumber,
    });
  } catch (error) {
    console.error(
      "Send phone OTP failed:",
      error
    );

    Alert.alert(
      "OTP Failed",
      error?.message ||
        "Unable to send OTP. Please try again."
    );
  } finally {
    setIsOtpLoading(false);
  }
};

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Welcome Back
          </Text>

          <Text style={styles.headerSubtitle}>
            Sign in to find shops near you
          </Text>
        </View>

        {/* ================= CONTENT ================= */}

        <View style={styles.content}>
          {/* Login Type Toggle */}

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                loginType === "mobile" &&
                  styles.activeToggle,
              ]}
              onPress={() => {
                setLoginType("mobile");
                clearError();
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  loginType === "mobile" &&
                    styles.activeToggleText,
                ]}
              >
                Mobile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                loginType === "email" &&
                  styles.activeToggle,
              ]}
              onPress={() => {
                setLoginType("email");
                clearError();
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  loginType === "email" &&
                    styles.activeToggleText,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* ================= MOBILE ================= */}

          {loginType === "mobile" && (
            <View style={styles.formSection}>
              <Text style={styles.label}>
                Mobile Number
              </Text>

              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>
                  +91
                </Text>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="98xxxxxx21"
                  placeholderTextColor="#B5AFB2"
                  value={mobile}
                  onChangeText={(text) => {
                    const numbersOnly =
                      text.replace(/\D/g, "");

                    if (
                      numbersOnly.length <= 10
                    ) {
                      setMobile(numbersOnly);
                    }
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <Text style={styles.helperText}>
                We'll text you a 6-digit code to
                verify
              </Text>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isOtpLoading &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSendOTP}
                disabled={isOtpLoading || isEmailLoading || isGoogleLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isOtpLoading
                    ? "Sending OTP..."
                    : "Send OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================= EMAIL ================= */}

          {loginType === "email" && (
            <View style={styles.formSection}>
              <Text style={styles.label}>
                Email
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#B5AFB2"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <View style={styles.passwordSection}>
                <Text style={styles.label}>
                  Password
                </Text>

                <View
                  style={styles.passwordContainer}
                >
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#B5AFB2"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    <Text style={styles.eyeText}>
                      {showPassword
                        ? "👁️"
                        : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.forgotButton}
                onPress={() =>
                  navigation.navigate(
                    "ForgotPassword"
                  )
                }
              >
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isEmailLoading &&
                    styles.buttonDisabled,
                ]}
                onPress={handleEmailLogin}
                disabled={isOtpLoading || isEmailLoading || isGoogleLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isEmailLoading
                    ? "Logging in..."
                    : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================= DIVIDER ================= */}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>
              or continue with
            </Text>

            <View style={styles.divider} />
          </View>

          {/* ================= GOOGLE ================= */}

          <TouchableOpacity
            style={[
              styles.googleButton,
              isGoogleLoading &&
                styles.buttonDisabled,
            ]}
            onPress={handleGoogleLogin}
            disabled={isOtpLoading || isEmailLoading || isGoogleLoading}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIcon}>
                G
              </Text>
            </View>

            <Text style={styles.googleButtonText}>
              Continue With Google
            </Text>
          </TouchableOpacity>

          {/* ================= REGISTER ================= */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              New here?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register")
              }
            >
              <Text style={styles.footerLink}>
                Create An Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },

  // ------------------------------------------------
  // Header
  // ------------------------------------------------

  header: {
    backgroundColor: "#FFB20A",
    minHeight: 201,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 28,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "400",
  },

  // ------------------------------------------------
  // Content
  // ------------------------------------------------

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 37,
    paddingBottom: 28,
  },

  // ------------------------------------------------
  // Toggle
  // ------------------------------------------------

  toggleContainer: {
    alignSelf: "center",
    width: 207,
    height: 56,
    backgroundColor: "#F8D58F",
    borderRadius: 10,
    padding: 6,
    flexDirection: "row",
    marginBottom: 44,
  },

  toggleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },

  activeToggle: {
    backgroundColor: "#000000",
  },

  toggleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#8F8A88",
  },

  activeToggleText: {
    color: "#FFFFFF",
  },

  // ------------------------------------------------
  // Form
  // ------------------------------------------------

  formSection: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B7AFB1",
    marginBottom: 8,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#D5D1D1",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 17,
    color: "#222222",
  },

  phoneInputContainer: {
    height: 46,
    borderWidth: 1,
    borderColor: "#D5D1D1",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  countryCode: {
    fontSize: 17,
    color: "#B5AFB2",
    fontWeight: "600",
    marginRight: 6,
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    fontSize: 17,
    color: "#222222",
  },

  helperText: {
    fontSize: 15,
    color: "#8E898A",
    marginTop: 10,
  },

  // ------------------------------------------------
  // Password
  // ------------------------------------------------

  passwordSection: {
    marginTop: 18,
  },

  passwordContainer: {
    height: 46,
    borderWidth: 1,
    borderColor: "#D5D1D1",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#222222",
  },

  eyeButton: {
    paddingHorizontal: 12,
  },

  eyeText: {
    fontSize: 18,
  },

  // ------------------------------------------------
  // Forgot Password
  // ------------------------------------------------

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 9,
  },

  forgotText: {
    color: "#F5A900",
    fontSize: 14,
    fontWeight: "600",
  },

  // ------------------------------------------------
  // Primary Button
  // ------------------------------------------------

  primaryButton: {
    height: 45,
    backgroundColor: "#000000",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  // ------------------------------------------------
  // Divider
  // ------------------------------------------------

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 27,
    marginBottom: 26,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#969191",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#777171",
  },

  // ------------------------------------------------
  // Google
  // ------------------------------------------------

  googleButton: {
    height: 45,
    borderWidth: 1,
    borderColor: "#D2CECE",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  googleIconContainer: {
    width: 27,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  googleIcon: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4285F4",
  },

  googleButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
  },

  // ------------------------------------------------
  // Footer
  // ------------------------------------------------

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 105,
  },

  footerText: {
    color: "#777171",
    fontSize: 14,
    fontWeight: "600",
  },

  footerLink: {
    color: "#F5A900",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
});