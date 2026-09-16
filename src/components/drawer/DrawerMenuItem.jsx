import React from "react";
import { DrawerItem } from "@react-navigation/drawer";
const DrawerMenuItem = ({ label, screen, navigation, labelStyle }) => {
  return (
    <DrawerItem
      label={label}
      labelStyle={labelStyle}
      onPress={() => {
        navigation.navigate("HomeStack", { screen });
      }}
    />
  );
};
export default DrawerMenuItem;
