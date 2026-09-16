import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeStack from "./HomeStack";
import CustomDrawer from "../components/drawer/CustomDrawer";
const Drawer = createDrawerNavigator();
const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: 280 } }}
    >
     
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Home" }}
      />
    </Drawer.Navigator>
  );
};
export default MainDrawer;
