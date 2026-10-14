import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { thekasAPI } from "../../api/client";
import {
  thekaStep1Schema,
  thekaStep2Schema,
} from "../../validation/ThekaValidation";

const initialForm = {
  name: "",
  ownerName: "",
  contact_phone: "",
  gst_number: "",
  aadhaar_number: "",
  license_number: "",
  license_expiry_date: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
};

export default function ThekaRegistrationScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submittedTheka, setSubmittedTheka] = useState(null);
  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const validateFields = (schema, fields) => {
    const result = schema.safeParse(fields);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = {};

    result.error.issues.forEach((issue) => {
      const key = issue.path[0];

      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    });

    setErrors(fieldErrors);
    return false;
  };

  const validateStep1 = () => {
    if (!validateFields(thekaStep1Schema, form)) {
      return false;
    }

    setStep(2);
    return true;
  };

  const validateStep2 = () => {
    return validateFields(thekaStep2Schema, form);
  };

  const submitRegistration = async () => {
    if (!validateStep2()) return;

    setLoading(true);

    try {
     const payload = {
  name: form.name.trim(),
  contactPhone: form.contact_phone.trim(),
  gstNumber: form.gst_number.trim().toUpperCase(),
  aadhaarNumber: form.aadhaar_number.trim(),
  licenseNumber: form.license_number.trim(),
  licenseExpiryDate: form.license_expiry_date.trim(),
  address: form.address.trim(),
  city: form.city.trim(),
  state: form.state.trim(),
  pincode: form.pincode.trim(),
  latitude: Number(form.latitude),
  longitude: Number(form.longitude),
};

      const response = await thekasAPI.register(payload);
      const result = response.data;

      if (!result?.success) {
        throw new Error(result?.message || "Theka registration failed.");
      }

      setSubmittedTheka(result.data ?? payload);
      setStep(3);
    } catch (error) {
      console.error("Theka registration failed:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Please check your internet connection and try again.";

      Alert.alert("Registration failed", message);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, key, placeholder, options = {}) => (
    <View style={styles.field} key={key}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          options.multiline && styles.multilineInput,
          errors[key] && styles.inputError,
        ]}
        value={form[key]}
        onChangeText={(value) => {
          const nextValue =
            key === "contact_phone"
              ? value.replace(/\D/g, "").slice(0, 10)
              : value;

          updateField(key, nextValue);

          setErrors((previous) => ({
            ...previous,
            [key]: undefined,
          }));
        }}
        placeholder={placeholder}
        placeholderTextColor="#B5A9A9"
        keyboardType={options.keyboardType || "default"}
        autoCapitalize={options.autoCapitalize || "sentences"}
        maxLength={options.maxLength}
        multiline={options.multiline || false}
        textAlignVertical={options.multiline ? "top" : "center"}
      />

      {errors[key] ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color="#DC2626" />
          <Text style={styles.errorText}>{errors[key]}</Text>
        </View>
      ) : null}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {" "}
      <Text style={styles.headerTitle}>Theka Registration</Text>{" "}
      <Text style={styles.headerSubtitle}>
        {step === 1
          ? "Step 1 of 2 — Shop & owner details"
          : "Step 2 of 2 — License & location"}{" "}
      </Text>
      {step < 3 && (
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressSegment, step === 1 && styles.activeSegment]}
          />
          <View
            style={[styles.progressSegment, step === 2 && styles.activeSegment]}
          />
        </View>
      )}
    </View>
  );

  if (step === 3) {
    return (
      <View style={styles.successScreen}>
        <ScrollView
          contentContainerStyle={styles.successScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Gradient Success Header */}
          <View style={styles.header}>
            <View style={styles.successHeader}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark" size={42} color="#FFFFFF" />
              </View>

              <Text style={styles.headerTitle}>Registration Submitted!</Text>

              <View style={styles.successBadge}>
                <Ionicons name="time-outline" size={15} color="#FFFFFF" />
                <Text style={styles.successBadgeText}>Pending Review</Text>
              </View>
            </View>
          </View>

          {/* Shop Summary */}
          <View style={styles.successContent}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeaderRow}>
                <View style={styles.summaryHeadingIcon}>
                  <Ionicons
                    name="storefront-outline"
                    size={21}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.summaryHeadingContent}>
                  <Text style={styles.summaryHeading}>Shop Details</Text>
                  <Text style={styles.summarySubheading}>
                    Registration information
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <SummaryRow
                label="Theka name"
                value={submittedTheka?.name || form.name}
              />

              <SummaryRow
                label="License number"
                value={submittedTheka?.licenseNumber || form.license_number}
              />

              <SummaryRow
                label="City"
                value={submittedTheka?.city || form.city}
              />

              <SummaryRow
                label="State"
                value={submittedTheka?.state || form.state}
              />

              <SummaryRow
                label="PIN code"
                value={submittedTheka?.pincode || form.pincode}
              />

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Application status</Text>

                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusValue}>
                    {submittedTheka?.status || "PENDING"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.successInfo}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.primary}
              />

              <Text style={styles.successInfoText}>
                Your registration will be reviewed by the concerned team. You
                can check your profile for further updates.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation?.navigate?.("Profile")}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Continue to Profile</Text>

              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {" "}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}

        <View style={styles.formContainer}>
          {step === 1 ? (
            <>
              {renderInput("THEKA NAME", "name", "Royal Wine Shop", {
                maxLength: 150,
              })}

              {renderInput("OWNER NAME", "ownerName", "Owner's Full Name", {
                maxLength: 150,
              })}

              {renderInput(
                "PHONE NUMBER",
                "contact_phone",
                "Enter 10-digit mobile number",
                {
                  keyboardType: "number-pad",
                  maxLength: 10,
                },
              )}

              {renderInput(
                "GST NUMBER",
                "gst_number",
                "15-character GST number",
                {
                  autoCapitalize: "characters",
                  maxLength: 15,
                },
              )}

              {renderInput(
                "AADHAAR NUMBER",
                "aadhaar_number",
                "12-digit Aadhaar number",
                {
                  keyboardType: "number-pad",
                  maxLength: 12,
                },
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={validateStep1}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {renderInput(
                "LICENSE NUMBER",
                "license_number",
                "UP-EXC-2026-XXXXX",
                {
                  autoCapitalize: "characters",
                  maxLength: 100,
                },
              )}

              {renderInput(
                "LICENSE EXPIRY DATE",
                "license_expiry_date",
                "YYYY-MM-DD (e.g. 2027-03-31)",
                {
                  maxLength: 10,
                },
              )}

              <Text style={styles.sectionTitle}>SHOP ADDRESS</Text>

              {renderInput(
                "FULL ADDRESS",
                "address",
                "Shop number, street, locality",
                { multiline: true, maxLength: 500 },
              )}

              {renderInput("CITY", "city", "Enter city", {
                maxLength: 100,
              })}

              {renderInput("STATE", "state", "Enter state", {
                maxLength: 100,
              })}

              {renderInput("PIN CODE", "pincode", "6-digit PIN code", {
                keyboardType: "number-pad",
                maxLength: 6,
              })}

              <Text style={styles.sectionTitle}>SHOP LOCATION</Text>

              <View style={styles.locationCard}>
                <Ionicons name="location" size={34} color={colors.primary} />
                <Text style={styles.locationHint}>
                  Enter the shop's map coordinates below.
                </Text>
              </View>

              {renderInput("LATITUDE", "latitude", "e.g. 25.4358", {
                keyboardType: "decimal-pad",
              })}

              {renderInput("LONGITUDE", "longitude", "e.g. 82.8534", {
                keyboardType: "decimal-pad",
              })}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={submitRegistration}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    Submit for review
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
                disabled={loading}
              >
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color={colors.primaryDark}
                />
                <Text style={styles.backButtonText}>Back to shop details</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SummaryRow({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      {" "}
      <Text style={styles.summaryLabel}>{label}</Text>{" "}
      <Text style={styles.summaryValue}>{value || "—"}</Text>{" "}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 190,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: "flex-end",
    backgroundColor: "#3B0C1B",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 7,
  },
  headerSubtitle: {
    color: colors.primaryLight,
  },
  progressTrack: {
    flexDirection: "row",
    gap: 8,
    marginTop: 17,
  },
  progressSegment: {
    flex: 1,
    height: 5,
    backgroundColor: "#6A5360",
  },
  activeSegment: {
    backgroundColor: "#F20A75",
  },
  formContainer: {
    paddingHorizontal: 15,
    paddingTop: 17,
    paddingBottom: 28,
  },
  field: {
    marginBottom: 17,
  },
  label: {
    color: "#AFA4A4",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#DAD5D5",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: "#261D21",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
  },
  multilineInput: {
    minHeight: 90,
  },
  sectionTitle: {
    color: "#AFA4A4",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
    marginBottom: 13,
  },
  locationCard: {
    minHeight: 105,
    borderRadius: 16,
    backgroundColor: "#090909",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
    padding: 12,
  },
  locationHint: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    padding: 14,
  },
  backButtonText: {
    color: colors.primaryDark,
    fontWeight: "600",
  },
  successContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  successIcon: {
    alignItems: "center",
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primaryDark,
    textAlign: "center",
  },
  successDescription: {
    color: "#766B70",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    marginBottom: 24,
  },

  // ====================

  successScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  successScrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  successHeader: {
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },

  successDescription: {
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 330,
  },

  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 18,
  },

  successBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  successContent: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F0E5EA",
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 16,
    shadowColor: "#3B0C1B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  summaryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  summaryHeadingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF0F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryHeadingContent: {
    flex: 1,
  },

  summaryHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryDark,
  },

  summarySubheading: {
    color: "#96868D",
    fontSize: 12,
    marginTop: 4,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#F0E5EA",
    marginBottom: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F1F4",
  },

  summaryLabel: {
    flex: 0.9,
    color: "#8D8187",
    fontSize: 13,
  },

  summaryValue: {
    flex: 1.1,
    textAlign: "right",
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "600",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 8,
  },

  statusLabel: {
    color: "#8D8187",
    fontSize: 13,
    flex: 1,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF7E8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D97706",
  },

  statusValue: {
    color: "#B76B08",
    fontSize: 11,
    fontWeight: "800",
  },

  successInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFF5F8",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },

  successInfoText: {
    flex: 1,
    color: "#69545E",
    fontSize: 12,
    lineHeight: 19,
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#F20A75",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 65,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FFF8F8",
  },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },

  errorText: {
    flex: 1,
    color: "#DC2626",
    fontSize: 12,
    lineHeight: 17,
  },
});
