import { Stack } from "expo-router";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  OPENSANS_BOLD,
  OPENSANS_MEDIUM,
  OPENSANS_MEDIUM_ITALIC,
  OPENSANS_REGULAR,
  OPENSANS_SEMIBOLD,
  OPENSANS_SEMIBOLD_ITALIC,
} from "../utils/const";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { StripeProvider } from "@stripe/stripe-react-native";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const publishableKey =
    "pk_test_51QTGMMGfsVFLJH4QrL7XKlNqRvgFtvKf6XwqzlwikV0CKNCXagayi8x6QowQ0xXBIKgqaPvQpfIRB3eD2P3nc6E60073X1ifev";

  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <StripeProvider publishableKey={publishableKey}>
          <RootLayout />
        </StripeProvider>
      </AuthProvider>
      <Toast visibilityTime={2000} />
    </GestureHandlerRootView>
  );
}

export function RootLayout() {
  const { authState } = useAuth();

  // Font config
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
    <>
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

        {/* Manga detail route */}
        <Stack.Screen
          name="manga/chapters"
          options={{
            headerShown: true,
            headerTitle: "Danh sách các chương",
          }}
        />
        <Stack.Screen
          name="manga/[id]"
          options={{
            headerShown: true,
            headerTitle: "Chi tiết truyện",
          }}
        />

        {/* Chapter detail route */}
        <Stack.Screen
          name="chapter/[id]"
          options={{
            headerShown: true,
            headerTitle: "Chi tiết chương",
          }}
        />

        {/* Privacy and about route */}
        <Stack.Screen
          name="privacy"
          options={{
            headerShown: true,
            headerTitle: "Chính sách và điều khoản",
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerShown: true,
            headerTitle: "Giới thiệu ứng dụng",
          }}
        />

        {/* Account route */}
        {!authState?.authenticated && (
          <Stack.Screen
            name="sign-in"
            options={{
              headerShown: true,
              headerTitle: "Trang đăng nhập",
            }}
          />
        )}
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            headerTitle: "Cập nhật thông tin",
          }}
        />
        <Stack.Screen
          name="password"
          options={{
            headerShown: true,
            headerTitle: "Đổi mật khẩu",
          }}
        />
        <Stack.Screen
          name="like-follow-list"
          options={({ route }: any) => ({
            headerShown: true,
            headerTitle: `Danh sách truyện ${
              route.params?.type === "like"
                ? "yêu thích"
                : route.params?.type === "follow"
                ? "theo dõi"
                : "Loading..."
            }`,
          })}
        />
        <Stack.Screen
          name="plan"
          options={{
            headerShown: true,
            headerTitle: "Các gói đã mua",
          }}
        />

        <Stack.Screen
          name="confirm-payment"
          options={{
            headerShown: true,
            headerTitle: "Xác nhận thanh toán gói",
          }}
        />

        {/* NotFound route */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
