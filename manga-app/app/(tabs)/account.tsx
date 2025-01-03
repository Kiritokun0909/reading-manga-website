import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { fetchProfile } from "@/api/accountApi";
import { DEFAULT_AVATAR_URL } from "@/utils/const";
import Toast from "react-native-toast-message";

type User = {
  avatar: string | null;
  username: string;
  email: string;
};

export default function AccountPage() {
  const { authState, onLogout } = useAuth();
  const [pressedButtons, setPressedButtons] = useState<Record<string, boolean>>(
    {}
  );
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (authState?.authenticated) {
        getUserInfo();
      }
    }, [])
  );

  useEffect(() => {
    if (authState?.authenticated) {
      getUserInfo();
    }
  }, [authState]);

  const getUserInfo = async () => {
    try {
      const data = await fetchProfile();
      setUserInfo(data);
    } catch (error) {
      console.log("Failed to get user info:", error);
    }
  };

  const handlePressIn = (button: string) => {
    setPressedButtons((prev) => ({ ...prev, [button]: true }));
  };

  const handlePressOut = (button: string) => {
    setPressedButtons((prev) => ({ ...prev, [button]: false }));
  };

  const handleLogoutButton = async () => {
    await onLogout();
    showToast("success", "Đăng xuất thành công");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tài khoản</Text>
      </View>

      {authState?.authenticated ? (
        <View>
          {/* Authenticated Content */}
          <View style={styles.infoCard}>
            {/* User information */}
            <View style={styles.userDetails}>
              <Image
                source={{ uri: userInfo?.avatar || DEFAULT_AVATAR_URL }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{userInfo?.username}</Text>
                <Text style={styles.email}>{userInfo?.email}</Text>
              </View>
            </View>

            {/* Like list */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/like-follow-list",
                  params: { type: "like" },
                })
              }
              onPressIn={() => handlePressIn("likeList")}
              onPressOut={() => handlePressOut("likeList")}
              style={[
                styles.button,
                pressedButtons.likeList && styles.isPressed,
              ]}
            >
              <Text style={styles.buttonText}>Danh sách yêu thích</Text>
            </Pressable>

            {/* Follow list */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/like-follow-list",
                  params: { type: "follow" },
                })
              }
              onPressIn={() => handlePressIn("followList")}
              onPressOut={() => handlePressOut("followList")}
              style={[
                styles.button,
                pressedButtons.followList && styles.isPressed,
              ]}
            >
              <Text style={styles.buttonText}>Danh sách theo dõi</Text>
            </Pressable>

            {/* Purchased plan list */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/plan",
                })
              }
              onPressIn={() => handlePressIn("planList")}
              onPressOut={() => handlePressOut("planList")}
              style={[
                styles.button,
                pressedButtons.planList && styles.isPressed,
              ]}
            >
              <Text style={styles.buttonText}>Danh sách các gói đã mua</Text>
            </Pressable>

            {/* Update profile */}
            <Pressable
              onPress={() => router.push("/profile")}
              onPressIn={() => handlePressIn("updateInfo")}
              onPressOut={() => handlePressOut("updateInfo")}
              style={[
                styles.button,
                pressedButtons.updateInfo && styles.isPressed,
              ]}
            >
              <Text style={styles.buttonText}>Cập nhật thông tin</Text>
            </Pressable>

            {/* Change password */}
            <Pressable
              onPress={() => router.push("/password")}
              onPressIn={() => handlePressIn("changePassword")}
              onPressOut={() => handlePressOut("changePassword")}
              style={[
                styles.button,
                pressedButtons.changePassword && styles.isPressed,
              ]}
            >
              <Text style={styles.buttonText}>Đổi mật khẩu</Text>
            </Pressable>
          </View>

          {/* Logout button */}
          <View style={{ paddingHorizontal: 120, alignItems: "center" }}>
            <Pressable
              onPress={handleLogoutButton}
              onPressIn={() => handlePressIn("logout")}
              onPressOut={() => handlePressOut("logout")}
              style={[styles.button, pressedButtons.logout && styles.isPressed]}
            >
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.unauthenticated}>
          <Text>Bạn chưa đăng nhập</Text>
          <Pressable
            onPress={() => router.push(`/sign-in`)}
            onPressIn={() => handlePressIn("login")}
            onPressOut={() => handlePressOut("login")}
            style={[styles.button, pressedButtons.login && styles.isPressed]}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </Pressable>
        </View>
      )}

      {/* Footer Links */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/privacy")}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>Chính sách và điều khoản</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/about")}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>Giới thiệu ứng dụng</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 8,
    paddingTop: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  headerText: {
    color: "black",
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
  },
  infoCard: {
    flexDirection: "column",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    margin: 8,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 16,
    paddingBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "darkorchid",
    marginTop: 8,
    backgroundColor: "darkorchid",
    alignItems: "center",
  },
  isPressed: {
    backgroundColor: "darkmagenta",
  },
  buttonText: {
    fontFamily: "OpenSans-Bold",
    color: "white",
  },
  unauthenticated: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    // borderTopWidth: 1,
    // borderTopColor: "gray",
  },
  link: {
    paddingVertical: 8,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});
