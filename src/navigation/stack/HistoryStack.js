import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../../constants/colors";
import GradientHeader from "../../components/GradientHeader";
import SearchHistoryScreen from "../../screens/SearchHistoryScreen";

const Stack = createNativeStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchHistory"
        component={SearchHistoryScreen}
        options={{
          header: (props) => (
            <GradientHeader {...props} />
          ),
          title: "Search History",
          headerTransparent: false,
          headerTintColor: colors.white,
          headerTitleStyle: {
            color: colors.white,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default HistoryStack;