
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

const ThekaIntroScreen = ({navigation}) => {
  const listThekaAdvantages = [
    {
      id: 1,
      title: "Appear on the map for nearby searches",
      icon: "location-outline",
    },
    {
      id: 2,
      title: "Manage your shop details anytime",
      icon: "storefront-outline",
    },
    {
      id: 3,
      title: "Free to list - Verified in 24-48 hours",
      icon: "checkmark-circle-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Own a liquor shop?
      </Text>

      <Text style={styles.subtitle}>
        List your Theka on FindMyTheka and get discovered
        by customers searching nearby.
      </Text>

      {/* Theka Registration Advantages */}
      <View style={styles.advantageContainer}>
        {listThekaAdvantages.map((advantage) => (
          <View
            key={advantage.id}
            style={styles.advantageCard}
          >
            <Ionicons
              name={advantage.icon}
              size={24}
              color={colors.primary}
            />

            <Text style={styles.advantageTitle}>
              {advantage.title}
            </Text>
          </View>
        ))}
      </View>

       {/* Theka Registration Button */}
            <TouchableOpacity style={styles.registerThekaButton} onPress={()=>navigation.navigate("ThekaRegistrationScreen")}>
              <Text style={styles.registerThekaButtonText}>Register My Theka</Text>
            </TouchableOpacity>

              <TouchableOpacity>
                          <Text style={styles.skipRegistration}>Maybe Later</Text>
                        </TouchableOpacity>
    </View>
  );
};

export default ThekaIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 20,
    lineHeight: 23,
    color: colors.primaryGray,
  },

 advantageContainer: {
  marginVertical: 30,
  gap: 20,
},

advantageCard: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
  width: "100%",
  paddingVertical: 2,
 
},

advantageTitle: {
  flex: 1,
  flexShrink: 1,
  fontSize: 20,
  lineHeight: 23,
  color: colors.primaryDark,
},
registerThekaButton: {
   
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",

  },
  registerThekaButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryLight,
  },
  skipRegistration:{
      color: colors.primaryGray,
      fontSize: 14,
      fontWeight: "700",
      margin: "auto",
      marginTop:25
    },
});

