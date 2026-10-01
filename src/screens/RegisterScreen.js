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

import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");

  // =========================
  // Email Validation
  // =========================

  const validateEmail = (value) => {
    const trimmedEmail = value.trim();

    if (!trimmedEmail) {
      return "Please enter your email";
    }

    // Basic and practical email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const handleEmailChange = (text) => {
    setEmail(text);

    // Clear error while user is typing
    if (emailError) {
      setEmailError("");
    }
  };

  // =========================
  // Register
  // =========================

  const handleRegister = async () => {
    const cleanedName = name.trim();
    const cleanedEmail = email.trim();
    const cleanedPhone = phone.replace(/\D/g, "").trim();

    // Name validation
    if (!cleanedName) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    // Email validation
    const emailValidationError =
      validateEmail(cleanedEmail);

    if (emailValidationError) {
      setEmailError(emailValidationError);

      Alert.alert(
        "Invalid Email",
        emailValidationError
      );

      return;
    }

    // Phone validation
    if (!cleanedPhone) {
      Alert.alert(
        "Error",
        "Please enter your mobile number"
      );
      return;
    }

    if (cleanedPhone.length !== 10) {
      Alert.alert(
        "Error",
        "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters"
      );
      return;
    }

    // Add +91 before sending to backend
    const phoneNumber = `+91${cleanedPhone}`;

    setIsLoading(true);

    try {
      const result = await register(
        cleanedName,
        cleanedEmail,
        password,
        phoneNumber
      );

      if (!result.success) {
        Alert.alert(
          "Registration Failed",
          result.error ||
            "Unable to register"
        );
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      Alert.alert(
        "Registration Failed",
        "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Orange Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Create account
          </Text>

          <Text style={styles.headerSubtitle}>
            Take less than a minute
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Full Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Your Name"
              placeholderTextColor="#B7B1B1"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={[
                styles.input,
                emailError &&
                  styles.inputError,
              ]}
              placeholder="Enter Your Email"
              placeholderTextColor="#B7B1B1"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />

            {emailError ? (
              <Text style={styles.errorText}>
                {emailError}
              </Text>
            ) : null}
          </View>

          {/* Mobile Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Mobile Number
            </Text>

            <View
              style={
                styles.phoneInputContainer
              }
            >
              <Text
                style={styles.countryCode}
              >
                +91
              </Text>

              <TextInput
                style={styles.phoneInput}
                placeholder="98xxxxxx21"
                placeholderTextColor="#B7B1B1"
                value={phone}
                onChangeText={(text) => {
                  const numbersOnly =
                    text.replace(
                      /\D/g,
                      ""
                    );

                  if (
                    numbersOnly.length <=
                    10
                  ) {
                    setPhone(numbersOnly);
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
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
                placeholder="Enter Your Password"
                placeholderTextColor="#B7B1B1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={
                  !showPassword
                }
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
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

          {/* Create Account Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading &&
                styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.registerButtonText
              }
            >
              {isLoading
                ? "Creating Account..."
                : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an Account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Login"
                )
              }
            >
              <Text
                style={styles.footerLink}
              >
                {" "}
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },

  // =========================
  // Header
  // =========================

  header: {
    height: 200,
    backgroundColor: "#F8A807",
    paddingHorizontal: 24,
    paddingTop: 104,
    justifyContent: "flex-start",
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 38,
  },

  headerSubtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#000000",
    marginTop: 4,
  },

  // =========================
  // Form
  // =========================

  form: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 25,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B5AEAE",
    marginBottom: 7,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#D4D0D0",
    borderRadius: 10,
    paddingHorizontal: 9,
    fontSize: 17,
    fontWeight: "500",
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },

  inputError: {
    borderColor: "#D32F2F",
  },

  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 5,
  },

  // =========================
  // Phone
  // =========================

  phoneInputContainer: {
    height: 45,
    borderWidth: 1,
    borderColor: "#D4D0D0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    backgroundColor: "#FFFFFF",
  },

  countryCode: {
    fontSize: 17,
    fontWeight: "500",
    color: "#B5AEAE",
    marginRight: 6,
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    fontSize: 17,
    fontWeight: "500",
    color: "#333333",
  },

  // =========================
  // Password
  // =========================

  passwordContainer: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4D0D0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 9,
    fontSize: 17,
    fontWeight: "500",
    color: "#333333",
  },

  eyeButton: {
    paddingHorizontal: 12,
  },

  eyeText: {
    fontSize: 16,
    color: "#999999",
  },

  // =========================
  // Button
  // =========================

  registerButton: {
    height: 45,
    backgroundColor: "#000000",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  // =========================
  // Footer
  // =========================

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },

  footerText: {
    color: "#777777",
    fontSize: 14,
    fontWeight: "600",
  },

  footerLink: {
    color: "#F8A807",
    fontSize: 14,
    fontWeight: "700",
  },
});