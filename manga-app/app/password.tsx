import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { updatePassword } from "@/api/accountApi";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPassword = () => {
    if (oldPassword === "" || password === "" || confirmPassword === "") {
      showToast("error", "Không được để trống mật khẩu");
      return false;
    }

    if (password !== confirmPassword) {
      showToast("error", "Mật khẩu không trùng khớp");
      return false;
    }
    return true;
  };

  const handleUpdateButton = async () => {
    if (!checkPassword()) return;
    setIsLoading(true);
    try {
      const response = await updatePassword(oldPassword, password);
      if (!response.success) {
        showToast("error", "Cập nhật thất bại", response.message);
      } else {
        showToast("success", "Cập nhật mật khẩu mới thành công");
        router.push("/account?refresh=true");
      }
    } catch (error) {
      console.error("Failed to update user password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: 8,
          marginTop: 60,
          marginHorizontal: 12,
          backgroundColor: "white",
          borderRadius: 8,
        }}
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <Text style={styles.headerText}>Đổi mật khẩu</Text>
        </View>

        {/* Old password */}
        <View style={{ marginHorizontal: 12 }}>
          <View style={{ marginLeft: 4 }}>
            <Text style={styles.label}>Mật khẩu cũ: </Text>
          </View>
          <View style={styles.container}>
            <TextInput
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
              style={styles.input}
              placeholder="Nhập mật khẩu cũ"
              placeholderTextColor="#aaa"
            />
            <MaterialCommunityIcons
              name={showOldPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowOldPassword}
            />
          </View>
        </View>

        {/* Password */}
        <View style={{ marginHorizontal: 12 }}>
          <View style={{ marginLeft: 4 }}>
            <Text style={styles.label}>Mật khẩu: </Text>
          </View>
          <View style={styles.container}>
            <TextInput
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#aaa"
            />
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowPassword}
            />
          </View>
        </View>

        {/* Confirm password */}
        <View style={{ marginHorizontal: 12 }}>
          <View style={{ marginLeft: 4 }}>
            <Text style={styles.label}>Nhập lại mật khẩu: </Text>
          </View>
          <View style={styles.container}>
            <TextInput
              // Set secureTextEntry prop to hide
              //password when showPassword is false
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#aaa"
            />
            <MaterialCommunityIcons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowConfirmPassword}
            />
          </View>
        </View>

        {/* Button login */}
        <View style={{ marginTop: 20, borderRadius: 8 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUpdateButton()}
          >
            <Text style={styles.buttonText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>

        {isLoading && <ActivityIndicator size="large" color="darkorchid" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 70,
    margin: 40,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  headerText: {
    color: "black",
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
  },
  label: {
    fontFamily: "OpenSans-SemiBold",
  },
  input: {
    flex: 1,
    color: "#333",
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  heading: {
    alignItems: "center",
    fontSize: 20,
    color: "green",
    marginBottom: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
  },
  secondButton: {
    alignItems: "center",
    backgroundColor: "#bec1c4",
    padding: 10,
    borderRadius: 8,
  },
  secondButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "OpenSans-Bold",
  },
});
