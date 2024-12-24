import { StyleSheet } from "react-native";

export const OPENSANS_REGULAR = "OpenSans-Regular";
export const OPENSANS_BOLD = "OpenSans-Bold";
export const OPENSANS_MEDIUM = "OpenSans-Medium";
export const OPENSANS_MEDIUM_ITALIC = "OpenSans-Medium-Italic";
export const OPENSANS_SEMIBOLD = "OpenSans-SemiBold";
export const OPENSANS_SEMIBOLD_ITALIC = "OpenSans-SemiBold-Italic";

export const DEFAULT_COVER_IMAGE_URL =
  "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg";

export const DEFAULT_AVATAR_URL =
  "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1";

export const globalStyles = StyleSheet.create({
  globalFont: {
    fontFamily: OPENSANS_REGULAR,
  },
});

export const BASE_URL = "http://10.242.2.24:5000";
export const STRIPE_RETURN_URL = "exp://10.242.2.24:8081";
