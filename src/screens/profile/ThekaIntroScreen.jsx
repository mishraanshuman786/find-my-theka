
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

const benefits = [
  {
    id: "discover",
    title: "Get discovered nearby",
    description: "Help customers find your shop on the map.",
    icon: "location-outline" ,
  },
  {
    id: "manage",
    title: "Manage your shop",
    description: "Keep your shop details and license information updated.",
    icon: "storefront-outline",
  },
  {
    id: "secure",
    title: "Verified registration",
    description: "Verify your GSTIN before submitting your application.",
    icon: "shield-checkmark-outline",
  },
];

const steps = [
  { number: "01", title: "Verify GSTIN" },
  { number: "02", title: "Add shop details" },
  { number: "03", title: "Complete payment" },
];

const ThekaIntroScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={colors.primaryDark}
        barStyle="light-content"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="storefront-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.eyebrow}>
            <Ionicons
              name="business-outline"
              size={14}
              color="#FFD5E5"
            />
            <Text style={styles.eyebrowText}>
              FOR SHOP OWNERS
            </Text>
          </View>

          <Text style={styles.title}>
            Bring your Theka{"\n"}
            <Text style={styles.titleAccent}>online.</Text>
          </Text>

          <Text style={styles.subtitle}>
            Register your liquor shop on FindMyTheka and help
            customers discover you nearby.
          </Text>

          <View style={styles.heroFooter}>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.heroFooterText}>
              Simple, guided registration
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            Why list your shop?
          </Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need to get started.
          </Text>

          <View style={styles.benefits}>
            {benefits.map((item) => (
              <View key={item.id} style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <Ionicons
                    name={item.icon}
                    size={23}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.benefitDescription}>
                    {item.description}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#B6A6AD"
                />
              </View>
            ))}
          </View>

          <View style={styles.processCard}>
            <Text style={styles.processTitle}>
              How it works
            </Text>

            {steps.map((item, index) => (
              <View key={item.number} style={styles.processRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>
                    {item.number}
                  </Text>
                </View>

                <Text style={styles.stepTitle}>
                  {item.title}
                </Text>

                {index !== steps.length - 1 && (
                  <View style={styles.stepConnector} />
                )}
              </View>
            ))}

            <Text style={styles.processNote}>
              Your application can be reviewed after the required
              registration and payment steps are completed.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("ThekaRegistrationScreen")
            }
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              Register My Theka
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>
              Maybe later
            </Text>
          </TouchableOpacity>

          <View style={styles.footerNote}>
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color="#887781"
            />
            <Text style={styles.footerNoteText}>
              Your registration details are submitted securely.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ThekaIntroScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  hero: {
    backgroundColor: "#3B0C1B",
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    marginBottom: 22,
  },
  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  eyebrowText: {
    color: "#FFD5E5",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  titleAccent: {
    color: "#F20A75",
  },
  subtitle: {
    color: "#F0DDE5",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 340,
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 22,
  },
  heroFooterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 27,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.primaryGray,
    marginTop: 5,
    marginBottom: 17,
  },
  benefits: {
    gap: 12,
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F0E6EB",
    backgroundColor: "#FFFFFF",
  },
  benefitIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F6",
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "700",
  },
  benefitDescription: {
    color: "#80717A",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  processCard: {
    marginTop: 25,
    padding: 18,
    borderRadius: 17,
    backgroundColor: "#FBF7F9",
    borderWidth: 1,
    borderColor: "#F0E6EB",
  },
  processTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryDark,
    marginBottom: 17,
  },
  processRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 42,
    marginBottom: 9,
    gap: 12,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#FCE3EE",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  stepTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "600",
  },
  stepConnector: {
    position: "absolute",
    left: 17,
    top: 36,
    width: 2,
    height: 15,
    backgroundColor: "#E8C9D6",
  },
  processNote: {
    color: "#80717A",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  primaryButton: {
    minHeight: 54,
    backgroundColor: "#F20A75",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 25,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    padding: 15,
    marginTop: 3,
  },
  secondaryButtonText: {
    color: colors.primaryGray,
    fontSize: 14,
    fontWeight: "700",
  },
  footerNote: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  footerNoteText: {
    color: "#887781",
    fontSize: 11,
  },
});
