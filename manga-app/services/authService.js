import axios from "axios";
import { saveTokens, clearTokens, getTokens } from "./keychainService";

const API_BASE_URL = "https://your-api-url.com";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    if (
      response.data &&
      response.data.accessToken &&
      response.data.refreshToken
    ) {
      await saveTokens(response.data.accessToken, response.data.refreshToken);
      return { success: true };
    }

    return { success: false, message: "Invalid login response" };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: "Login failed" };
  }
};

export const logout = async () => {
  await clearTokens();
};

export const isLoggedIn = async () => {
  const tokens = await getTokens();

  if (!tokens || !tokens.accessToken) {
    return false;
  }

  return true;
};
