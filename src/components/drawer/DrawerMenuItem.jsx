import { DrawerItem } from "@react-navigation/drawer";
const DrawerMenuItem = ({ label, screen, navigation, labelStyle }) => {

    const handlePress = () => {
        // close the drawer
        navigation.closeDrawer();

        // Navigate to the selected screen
        navigation.navigate("HomeStack", { screen });


    }

    return (
        <DrawerItem
            label={label}
            labelStyle={labelStyle}
            onPress={handlePress}
        />)


};
export default DrawerMenuItem;
