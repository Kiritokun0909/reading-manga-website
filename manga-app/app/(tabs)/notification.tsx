import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function NotificationPage() {
  const { authState } = useAuth();
  const [pressButton, setPressButton] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông báo</Text>
      </View>

      {/* Unauthenticated Content */}
      {authState?.authenticated ? (
        <View>
          <Text>Trang thông báo</Text>
        </View>
      ) : (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text>Bạn chưa đăng nhập</Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/sign-in`,
                params: {},
              })
            }
            onPressIn={() => setPressButton(true)}
            onPressOut={() => setPressButton(false)}
            style={[styles.button, pressButton && styles.isPressed]}
          >
            <Text style={{ fontFamily: "OpenSans-Bold", color: "white" }}>
              Đăng nhập
            </Text>
          </Pressable>
        </View>
      )}
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
    borderBottomWidth: 3,
    borderBottomColor: "gray",
  },
  headerText: {
    color: "black",
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "darkorchid",
    marginTop: 8,
    backgroundColor: "darkorchid",
  },
  isPressed: {
    backgroundColor: "darkmagenta",
  },
});
