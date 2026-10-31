
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/client";
import colors from "../../constants/colors";

const EditProfileScreen = () => {
  const { user, fetchProfile } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
  }, [user?.name, user?.phone]);

  const handleUpdateProfile = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      Alert.alert("Validation", "Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      await authAPI.updateProfile({
        name: trimmedName,
        phone: trimmedPhone,
      });

      await fetchProfile();

      Alert.alert(
        "Success",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Personal Information</Text>

      <Text style={styles.description}>
        Update your personal details below.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.primaryGray}
          autoCapitalize="words"
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>

        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.email || ""}
          editable={false}
        />

        <Text style={styles.helperText}>
          Email address cannot be changed here.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile Number</Text>

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter mobile number"
          placeholderTextColor={colors.primaryGray}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <Text style={styles.helperText}>
          Adding a phone number does not verify it.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleUpdateProfile}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryLight} />
        ) : (
          <Text style={styles.saveButtonText}>
            Save Changes
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.primaryGray,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryDark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
  },
  disabledInput: {
    backgroundColor: colors.background || "#F3F3F3",
    opacity: 0.75,
  },
  helperText: {
    fontSize: 12,
    color: colors.primaryGray,
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.primaryLight,
    fontSize: 16,
    fontWeight: "bold",
  },
});
