import {
  getAuth,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";

const firebaseAuth = getAuth();

export const sendPhoneOTP = async (phoneNumber) => {
  const confirmation = await signInWithPhoneNumber(
    firebaseAuth,
    phoneNumber
  );

  return confirmation;
};

export const verifyPhoneOTP = async (
  confirmation,
  otp
) => {
  const userCredential = await confirmation.confirm(otp);

  const firebaseIdToken =
    await userCredential.user.getIdToken();

  return {
    user: userCredential.user,
    firebaseIdToken,
  };
};