import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  Pressable,
} from "react-native";
import colors from "../../constants/colors";

const SUPPORT_EMAIL = "supportalokyadav2026@gmail.com";

const PrivacyPolicyScreen = () => {
  const openEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  const openWebsite = () => {
    Linking.openURL("https://findmythekaa.com/");
  };

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const Paragraph = ({ children }) => (
    <Text style={styles.paragraph}>{children}</Text>
  );

  const Bullet = ({ children }) => (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>{"\u2022"}</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Privacy Policy</Text>
        <Text style={styles.appName}>Find My Thekaa</Text>
        <Text style={styles.date}>
          Effective Date: 26 October 2026
        </Text>
        <Text style={styles.date}>
          Last Updated: 26 October 2026
        </Text>
      </View>

      <View style={styles.ageNotice}>
        <Text style={styles.ageNoticeTitle}>
          Strictly 21+ Legal Drinking Age
        </Text>
        <Text style={styles.ageNoticeText}>
          This application is intended only for adults who have attained
          the applicable legal drinking age in their jurisdiction.
        </Text>
      </View>

      <Paragraph>
        Welcome to Find My Thekaa ("we," "our," or "us"). We respect your
        privacy and are committed to protecting it through transparent
        data practices. This Privacy Policy explains the information we
        may collect when you use our mobile application and how that
        information is used, shared, and protected.
      </Paragraph>

      <Section title="1. Age Restriction (Strictly 21+ / Legal Drinking Age)">
        <Paragraph>
          Find My Thekaa is designed and intended solely for adult users
          who have attained the legal drinking age in their respective
          jurisdiction (such as 21 years or older under applicable Indian
          state excise laws).
        </Paragraph>
        <Paragraph>
          We do not knowingly market to, target, or collect personal
          information from individuals below the legal age. If we learn
          or receive notice that a user under the legal drinking age has
          provided information, we will take steps to delete that
          information and revoke application access, subject to
          applicable legal requirements.
        </Paragraph>
      </Section>

      <Section title="2. Information We Collect">
        <Text style={styles.subTitle}>A. Location Information</Text>
        <Paragraph>
          With your permission, our application may collect precise
          location data (GPS coordinates) and approximate location data
          (network-based) while the application is in active use. This
          information helps us find and list verified licensed stores
          in your vicinity and calculate distances and routes.
        </Paragraph>

        <Text style={styles.subTitle}>
          B. Device and Technical Information
        </Text>
        <Paragraph>
          We may collect technical diagnostic information, including
          device model, operating system version, unique device
          identifiers, network state, and application crash diagnostics.
          This information helps us improve performance and troubleshoot
          issues.
        </Paragraph>

        <Text style={styles.subTitle}>
          C. Optional Contact & Support Information
        </Text>
        <Paragraph>
          If you contact our team for customer support or feedback, we
          may collect your email address, name, and any contextual
          information you provide so that we can respond to your inquiry.
        </Paragraph>
      </Section>

      <Section title="3. How We Use Your Information">
        <Paragraph>
          We use collected information for legitimate operational
          purposes, including:
        </Paragraph>
        <Bullet>
          Core App Functionality: Displaying nearby licensed outlets,
          rendering map markers, and determining distances.
        </Bullet>
        <Bullet>
          App Stability & Optimization: Troubleshooting crashes,
          improving load times, and updating store inventory metadata.
        </Bullet>
        <Bullet>
          Legal & Regulatory Compliance: Supporting store discovery in
          accordance with applicable regional alcohol retail regulations
          and local excise guidelines.
        </Bullet>
      </Section>

      <Section title="4. Data Sharing and Third-Party Services">
        <Paragraph>
          We do not sell, monetize, rent, or lease your personal
          information. We may use third-party services to support
          mapping, navigation, and diagnostics:
        </Paragraph>
        <Bullet>
          Mapping Providers: Google Maps SDK / Mapbox, for rendering maps,
          route computation, and geolocation queries.
        </Bullet>
        <Bullet>
          Crash Reporting & Diagnostics: Firebase Crashlytics, for
          application bug tracking and stability monitoring.
        </Bullet>
      </Section>

      <Section title="5. Data Retention and Deletion Rights">
        <Paragraph>
          Real-time GPS location coordinates are processed dynamically
          to query nearby outlets and are not retained as identifiable
          personal records in our permanent databases.
        </Paragraph>
        <Paragraph>
          You may request access to or deletion of stored support tickets,
          account data, or interaction records. To initiate a data
          deletion request, contact us at:
        </Paragraph>
        <Pressable onPress={openEmail}>
          <Text style={styles.link}>{SUPPORT_EMAIL}</Text>
        </Pressable>
      </Section>

      <Section title="6. Application Permissions Required">
        <Paragraph>
          The application may request the following Android permissions:
        </Paragraph>
        <Bullet>
          ACCESS_FINE_LOCATION: To identify your precise geographic
          position and locate nearby stores.
        </Bullet>
        <Bullet>
          ACCESS_COARSE_LOCATION: To identify your general area when
          high-accuracy GPS is unavailable.
        </Bullet>
        <Bullet>
          INTERNET: To load map data, synchronize store locations, and
          retrieve application updates.
        </Bullet>
        <Bullet>
          ACCESS_NETWORK_STATE: To monitor network connectivity and
          manage network requests.
        </Bullet>
      </Section>

      <Section title="7. Changes to This Privacy Policy">
        <Paragraph>
          We may update this policy periodically to reflect changes in
          legal requirements, application features, or platform
          guidelines. Updates will be published on our website with a
          revised effective date.
        </Paragraph>
      </Section>

      <Section title="8. Contact Information">
        <Text style={styles.detailLabel}>App Name</Text>
        <Paragraph>Find My Thekaa</Paragraph>

        <Text style={styles.detailLabel}>Developer / Entity</Text>
        <Paragraph>Alok Kumar Yadav</Paragraph>

        <Text style={styles.detailLabel}>Support Email</Text>
        <Pressable onPress={openEmail}>
          <Text style={styles.link}>{SUPPORT_EMAIL}</Text>
        </Pressable>

        <Text style={styles.detailLabel}>Website / Hosting Domain</Text>
        <Pressable onPress={openWebsite}>
          <Text style={styles.link}>https://findmythekaa.com/</Text>
        </Pressable>
      </Section>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 Find My Thekaa. All rights reserved.
        </Text>
        <Text style={styles.footerText}>
          Developed by Alok Kumar Yadav.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },
  header: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: 5,
  },
  appName: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: colors.primaryGray,
    marginTop: 3,
  },
  ageNotice: {
    backgroundColor: "#FFF1F3",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  ageNoticeTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  ageNoticeText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  subTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 6,
  },
  paragraph: {
    color: colors.primaryGray,
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 10,
    textAlign: "left",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 9,
    paddingRight: 4,
  },
  bullet: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 21,
    marginRight: 9,
  },
  bulletText: {
    flex: 1,
    color: colors.primaryGray,
    fontSize: 13,
    lineHeight: 21,
  },
  detailLabel: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  link: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 25,
    paddingTop: 16,
    alignItems: "center",
  },
  footerText: {
    color: colors.primaryGray,
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
  },
});

export default PrivacyPolicyScreen;