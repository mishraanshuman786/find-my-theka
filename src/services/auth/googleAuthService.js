import GoogleSignin from "../../config/googleAuth";

import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { auth } from "../../config/firebase";

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Clear the previously selected Google account
    // so the account picker appears again.
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      // Ignore this if no Google account is currently signed in.
      console.log(
        "Google sign-out before login skipped"
      );
    }

    const response =
      await GoogleSignin.signIn();

    const googleIdToken =
      response?.data?.idToken;

    if (!googleIdToken) {
      throw new Error(
        "Google ID token was not returned"
      );
    }

    const credential =
      GoogleAuthProvider.credential(
        googleIdToken
      );

    const userCredential =
      await signInWithCredential(
        auth,
        credential
      );

    const firebaseIdToken =
      await userCredential.user.getIdToken();

    return {
      user: userCredential.user,
      firebaseIdToken,
    };
  } catch (error) {
    console.error(
      "Google Sign-In failed:",
      error
    );

    throw error;
  }
};