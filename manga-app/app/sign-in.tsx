import { registerApi } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { onLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkLoginValidation = () => {
    if (email === "") {
      showToast("error", "Email không được để trống");
      return false;
    }
    if (password === "") {
      showToast("error", "Password không được để trống");
      return false;
    }
    return true;
  };

  const checkRegisterValidation = () => {
    if (email === "") {
      showToast("error", "Email không được để trống");
      return false;
    }
    if (password === "") {
      showToast("error", "Mật khẩu không được để trống");
      return false;
    }
    if (password != confirmPassword) {
      showToast("error", "Mật khẩu không trùng với nhập lại mật khẩu");
      return false;
    }
    return true;
  };

  const loginButtonClick = async () => {
    if (isLogin) {
      if (!checkLoginValidation()) return;
      const success = await onLogin(email, password);
      if (!success) {
        showToast("error", "Đăng nhập thất bại");
        return;
      }
      showToast("success", "Đăng nhập thành công");
      router.replace("/");
    } else {
      if (!checkRegisterValidation()) return;
      const response = await registerApi(email, password);
      if (!response.success) {
        showToast("error", "Đã có lỗi xảy ra.", response.message);
        return;
      }
      showToast(
        "success",
        "Đăng ký thành công!",
        "Bạn có thể sử dụng tài khoản vừa để đăng nhập."
      );
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
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <Text style={styles.headerText}>
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </Text>
        </View>

        {/* Email input field */}
        <View style={{ marginHorizontal: 12 }}>
          <View style={{ marginLeft: 4 }}>
            <Text style={styles.label}>Email: </Text>
          </View>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              placeholderTextColor="#aaa"
              textContentType="emailAddress"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>

        {/* Password input field */}
        <View style={{ marginHorizontal: 12 }}>
          <View style={{ marginLeft: 4 }}>
            <Text style={styles.label}>Mật khẩu: </Text>
          </View>
          <View style={styles.container}>
            <TextInput
              // Set secureTextEntry prop to hide
              //password when showPassword is false
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

        {!isLogin && (
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
        )}

        {/* Button login */}
        <View style={{ marginTop: 20, borderRadius: 8 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => loginButtonClick()}
          >
            <Text style={styles.buttonText}>
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 8, borderRadius: 8 }}>
          <TouchableOpacity
            style={styles.secondButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.secondButtonText}>
              {isLogin ? "Đăng ký" : "Đăng nhập"}
            </Text>
          </TouchableOpacity>
        </View>
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
