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
  Image,
} from "react-native";

import colors from "../constants/colors";
import { authAPI } from "../api/client";

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ========================================
  // SEND OTP
  // ========================================

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword(normalizedEmail);

      console.log("Forgot password response:", response.data);

      Alert.alert(
        "OTP Sent",
        "If an account exists with this email, a password reset OTP has been sent to your email.",
        [
          {
            text: "Continue",
            onPress: () => {
              setStep(2);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      const message =
        error?.response?.data?.message ||
        "Unable to send OTP. Please try again.";

      Alert.alert("Forgot Password", message);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // RESET PASSWORD
  // ========================================

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      Alert.alert("Error", "OTP must be a 6-digit number");
      return;
    }

    if (!newPassword) {
      Alert.alert("Error", "Please enter your new password");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters"
      );
      return;
    }

    if (!confirmPassword) {
      Alert.alert("Error", "Please confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      console.log("Reset password response:", response.data);

      Alert.alert(
        "Password Reset",
        "Your password has been reset successfully. You can now login with your new password.",
        [
          {
            text: "Go to Login",
            onPress: () => {
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Reset password error:", error);

      const message =
        error?.response?.data?.message ||
        "Unable to reset password. Please try again.";

      Alert.alert("Reset Password", message);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // BACK TO EMAIL
  // ========================================

  const handleChangeEmail = () => {
    setStep(1);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.appName}>Find My Theka</Text>

          <Text style={styles.tagline}>
            Reset your password securely
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {step === 1 ? (
            <>
              <Text style={styles.formTitle}>
                Forgot Password?
              </Text>

              <Text style={styles.formSubtitle}>
                Enter your email address and we'll send you a
                password reset OTP.
              </Text>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>

              {/* Send OTP */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Text>
              </TouchableOpacity>

              {/* Back to Login */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Remember your password?{" "}
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.footerLink}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.formTitle}>
                Reset Password
              </Text>

              <Text style={styles.formSubtitle}>
                Enter the OTP sent to{" "}
                <Text style={styles.emailText}>
                  {email}
                </Text>
              </Text>

              {/* OTP */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>OTP</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={colors.textLight}
                  value={otp}
                  onChangeText={(value) =>
                    setOtp(value.replace(/[^0-9]/g, ""))
                  }
                  keyboardType="number-pad"
                  maxLength={6}
                  editable={!isLoading}
                />
              </View>

              {/* New Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  New Password
                </Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter new password"
                    placeholderTextColor={colors.textLight}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowNewPassword(!showNewPassword)
                    }
                  >
                    <Text style={styles.eyeText}>
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Confirm Password
                </Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm new password"
                    placeholderTextColor={colors.textLight}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    <Text style={styles.eyeText}>
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Reset Password */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading
                    ? "Resetting Password..."
                    : "Reset Password"}
                </Text>
              </TouchableOpacity>

              {/* Change Email */}
              <TouchableOpacity
                style={styles.changeEmailButton}
                onPress={handleChangeEmail}
                disabled={isLoading}
              >
                <Text style={styles.changeEmailText}>
                  Change Email
                </Text>
              </TouchableOpacity>

              {/* Resend OTP */}
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                <Text style={styles.resendText}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#080808",
    marginBottom: 14,

    elevation: 6,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.textWhite,
    marginBottom: 6,
  },

  tagline: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
  },

  form: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 8,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 6,
  },

  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },

  emailText: {
    fontWeight: "600",
    color: colors.text,
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },

  eyeButton: {
    padding: 12,
  },

  eyeText: {
    fontSize: 20,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: colors.textWhite,
    fontSize: 17,
    fontWeight: "bold",
  },

  changeEmailButton: {
    alignItems: "center",
    marginTop: 16,
  },

  changeEmailText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  resendButton: {
    alignItems: "center",
    marginTop: 14,
  },

  resendText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});
