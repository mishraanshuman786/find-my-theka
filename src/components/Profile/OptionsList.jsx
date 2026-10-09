import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

const OptionsList = ({ navigation }) => {
  const options = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: "person",
      screen: "EditProfile",
    },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(option.screen)}
        >
          <View style={styles.leftContainer}>
            <Ionicons name={option.icon} size={22} color={colors.primary} />
            <Text style={styles.optionText}>{option.title}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.primaryGray}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OptionsList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primaryDark,
  },
});
