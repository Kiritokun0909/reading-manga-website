import * as Keychain from "react-native-keychain";

// Save tokens to Keychain
export const saveTokens = async (accessToken, refreshToken) => {
  await Keychain.setGenericPassword(
    "auth",
    JSON.stringify({ accessToken, refreshToken })
  );
};

// Retrieve tokens from Keychain
export const getTokens = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? JSON.parse(credentials.auth) : null;
  } catch (error) {
    // console.log("No token found");
    return null;
  }
};

// Delete tokens from Keychain
export const clearTokens = async () => {
  await Keychain.resetGenericPassword();
};
