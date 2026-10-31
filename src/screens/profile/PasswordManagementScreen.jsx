
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { authAPI } from "../../api/client";

const PasswordManagementScreen = ({ route, navigation }) => {
  const hasPassword = route.params?.hasPassword === true;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (hasPassword && !currentPassword.trim()) {
      Alert.alert("Validation", "Please enter your current password.");
      return;
    }

    if (!newPassword) {
      Alert.alert("Validation", "Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Validation",
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validation", "New passwords do not match.");
      return;
    }

    if (hasPassword && currentPassword === newPassword) {
      Alert.alert(
        "Validation",
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      if (hasPassword) {
        await authAPI.changePassword({
          currentPassword,
          newPassword,
        });
      } else {
        await authAPI.setPassword(newPassword);
      }

      Alert.alert(
        "Success",
        hasPassword
          ? "Your password has been changed successfully."
          : "Your password has been set successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      Alert.alert("Password Error", message);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    label,
    value,
    onChangeText,
    visible,
    setVisible,
    placeholder
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.primaryGray}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={21}
            color={colors.primaryGray}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={34}
            color={colors.primaryLight}
          />
        </View>

        <Text style={styles.heading}>
          {hasPassword ? "Change Your Password" : "Set Your Password"}
        </Text>

        <Text style={styles.description}>
          {hasPassword
            ? "Enter your current password and choose a new secure password."
            : "Create a password to enable email and password login alongside Google login."}
        </Text>

        {hasPassword &&
          renderPasswordInput(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            showCurrentPassword,
            setShowCurrentPassword,
            "Enter current password"
          )}

        {renderPasswordInput(
          "New Password",
          newPassword,
          setNewPassword,
          showNewPassword,
          setShowNewPassword,
          "Enter new password"
        )}

        {renderPasswordInput(
          "Confirm New Password",
          confirmPassword,
          setConfirmPassword,
          showConfirmPassword,
          setShowConfirmPassword,
          "Confirm new password"
        )}

        <Text style={styles.helperText}>
          Password must contain at least 8 characters.
        </Text>

        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryLight} />
          ) : (
            <Text style={styles.submitButtonText}>
              {hasPassword ? "Change Password" : "Set Password"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PasswordManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primaryDark,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.primaryGray,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryDark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.primaryLight,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.primaryDark,
  },
  helperText: {
    fontSize: 12,
    color: colors.primaryGray,
    marginTop: -5,
    marginBottom: 22,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryLight,
  },
});
