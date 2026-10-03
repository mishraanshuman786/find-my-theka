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

import { signInWithGoogle } from "../services/auth/googleAuthService";
import { useAuth } from "../context/AuthContext";
import colors from "../constants/colors";

export default function LoginScreen({ navigation }) {
  const {
    login,
    loginWithFirebase,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailLoading, setIsEmailLoading] =
    useState(false);

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  // --------------------------------------------------
  // Google Login
  // --------------------------------------------------

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      clearError();

      const result = await signInWithGoogle();

      const loginResult =
        await loginWithFirebase(
          result.firebaseIdToken
        );

      if (!loginResult.success) {
        Alert.alert(
          "Google Login Failed",
          loginResult.error ||
            "Unable to login with Google."
        );

        return;
      }

      console.log(
        "Google login successful"
      );
    } catch (error) {
      console.error(
        "Google login failed:",
        error
      );

      Alert.alert(
        "Google Login Failed",
        error?.message ||
          "Unable to login with Google."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // --------------------------------------------------
  // Email Login
  // --------------------------------------------------

  const handleEmailLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        "Error",
        "Please enter your email."
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Error",
        "Please enter your password."
      );
      return;
    }

    try {
      setIsEmailLoading(true);
      clearError();

      const result = await login(
        trimmedEmail,
        password
      );

      if (!result.success) {
        Alert.alert(
          "Login Failed",
          result.error ||
            "Unable to login. Please try again."
        );
      }
    } finally {
      setIsEmailLoading(false);
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
        contentContainerStyle={
          styles.scrollContent
        }
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
          {/* ================= EMAIL FORM ================= */}

          <View style={styles.formSection}>
            {/* Email */}

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
              editable={!isEmailLoading}
            />

            {/* Password */}

            <View
              style={styles.passwordSection}
            >
              <Text style={styles.label}>
                Password
              </Text>

              <View
                style={
                  styles.passwordContainer
                }
              >
                <TextInput
                  style={
                    styles.passwordInput
                  }
                  placeholder="Enter your password"
                  placeholderTextColor="#B5AFB2"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={
                    !showPassword
                  }
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!isEmailLoading}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={
                    isEmailLoading
                  }
                >
                  <Text
                    style={styles.eyeText}
                  >
                    {showPassword
                      ? "👁️"
                      : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() =>
                navigation.navigate(
                  "ForgotPassword"
                )
              }
              disabled={
                isEmailLoading ||
                isGoogleLoading
              }
            >
              <Text
                style={styles.forgotText}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                isEmailLoading &&
                  styles.buttonDisabled,
              ]}
              onPress={handleEmailLogin}
              disabled={
                isEmailLoading ||
                isGoogleLoading
              }
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                {isEmailLoading
                  ? "Logging in..."
                  : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ================= DIVIDER ================= */}

          <View
            style={
              styles.dividerContainer
            }
          >
            <View style={styles.divider} />

            <Text
              style={styles.dividerText}
            >
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
            disabled={
              isGoogleLoading ||
              isEmailLoading
            }
          >
            <View
              style={
                styles.googleIconContainer
              }
            >
              <Text
                style={styles.googleIcon}
              >
                G
              </Text>
            </View>

            <Text
              style={
                styles.googleButtonText
              }
            >
              {isGoogleLoading
                ? "Signing in..."
                : "Continue With Google"}
            </Text>
          </TouchableOpacity>

          {/* ================= REGISTER ================= */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              New here?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Register"
                )
              }
              disabled={
                isEmailLoading ||
                isGoogleLoading
              }
            >
              <Text
                style={styles.footerLink}
              >
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

