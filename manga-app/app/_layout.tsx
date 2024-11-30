import { Stack } from "expo-router";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import {
  OPENSANS_BOLD,
  OPENSANS_MEDIUM,
  OPENSANS_MEDIUM_ITALIC,
  OPENSANS_REGULAR,
  OPENSANS_SEMIBOLD,
  OPENSANS_SEMIBOLD_ITALIC,
} from "../utils/const";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [OPENSANS_REGULAR]: require("../assets/fonts/OpenSans-Regular.ttf"),
    [OPENSANS_BOLD]: require("../assets/fonts/OpenSans-Bold.ttf"),
    [OPENSANS_MEDIUM]: require("../assets/fonts/OpenSans-Medium.ttf"),
    [OPENSANS_MEDIUM_ITALIC]: require("../assets/fonts/OpenSans-MediumItalic.ttf"),
    [OPENSANS_SEMIBOLD]: require("../assets/fonts/OpenSans-SemiBold.ttf"),
    [OPENSANS_SEMIBOLD_ITALIC]: require("../assets/fonts/OpenSans-SemiBoldItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, headerTitle: "" }}
      />
      <Stack.Screen
        name="genre/[id]"
        options={({ route }: any) => ({
          headerShown: true,
          headerTitle: `Thể loại: ${route.params?.genreName || "Loading..."}`,
        })}
      />
      <Stack.Screen
        name="manga/[id]"
        options={{
          headerShown: true,
          headerTitle: "Chi tiết truyện",
        }}
      />
      <Stack.Screen
        name="chapter/[id]"
        options={{
          headerShown: true,
          headerTitle: "Chi tiết chương",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
