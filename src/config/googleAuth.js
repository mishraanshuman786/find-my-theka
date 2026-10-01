import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "1032768433679-5c1j3qdv1uvspgijs9tl95mv9o78iche.apps.googleusercontent.com",

  iosClientId:
    "1032768433679-hlosodrjqenrifjfikal3vq71hqm30ro.apps.googleusercontent.com",
});

console.log("Google Sign-In initialized:", !!GoogleSignin);

export default GoogleSignin;