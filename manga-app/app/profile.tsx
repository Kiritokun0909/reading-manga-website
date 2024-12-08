import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchProfile, updateProfile, updateEmail } from "@/api/accountApi";
import { DEFAULT_AVATAR_URL } from "@/utils/const";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

type User = {
  avatar: string | null;
  username: string;
  email: string;
};

type Avatar = {
  uri: string;
  type: string;
  name: string;
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [newAvatar, setNewAvatar] = useState<Avatar | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const data = await fetchProfile();
      setUserInfo(data);
      setNewUsername(data.username);
      setNewEmail(data.email);
    } catch (error) {
      console.error("Failed to get user info:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "You need to grant permission to access your photos.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const pickedAsset = result.assets[0]; // Get the first selected asset
      console.log(">>> Picked asset:", pickedAsset);
      setNewAvatar({
        uri: pickedAsset.uri,
        type: pickedAsset.type || "image/jpeg", // Default to 'image/jpeg' if type is undefined
        name: pickedAsset.fileName || "avatar.jpg", // Default to 'avatar.jpg' if fileName is undefined
      });
    }
  };

  const checkUpdateInfo = () => {
    if (newUsername === "") {
      showToast("error", "Không được để trống username");
      return false;
    }

    if (newEmail === "") {
      showToast("error", "Không được để trống email");
      return false;
    }
    return true;
  };

  const handleUpdateButton = async () => {
    if (!checkUpdateInfo()) return;
    setIsLoading(true); // Start loading
    try {
      const fileAvatar = newAvatar
        ? {
            uri: newAvatar.uri, // File URI
            type: newAvatar.type, // MIME type (e.g., 'image/jpeg')
            name: new Date().getTime() || "avatar.jpg", // File name
          }
        : null;

      if (newUsername !== userInfo?.username || newAvatar) {
        const response = await updateProfile(newUsername, fileAvatar);

        if (!response.success) {
          showToast("error", "Cập nhật thất bại", response.message);
        } else {
          showToast(
            "success",
            "Cập nhật thành công",
            "Cập nhật username, avatar thành công."
          );
        }
      }

      // Update email if changed
      if (newEmail !== userInfo?.email) {
        const response = await updateEmail(newEmail);
        if (!response.success) {
          showToast("error", "Cập nhật thất bại", response.message);
        } else {
          showToast(
            "success",
            "Cập nhật thành công",
            "Cập nhật email thành công."
          );
        }
      }

      // Refresh user info
      router.push("/account?refresh=true");
    } catch (error) {
      console.error("Failed to update user info:", error);
      // Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        {/* Avatar */}
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri: newAvatar?.uri || userInfo?.avatar || DEFAULT_AVATAR_URL,
            }}
            style={styles.avatar}
          />
          <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
        </TouchableOpacity>

        {/* Username */}
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={newUsername}
          onChangeText={setNewUsername}
          placeholder="Enter new username"
        />

        {/* Email */}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="Enter new email"
          keyboardType="email-address"
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="darkorchid" />
        ) : (
          <Button
            title="Cập nhật"
            onPress={handleUpdateButton}
            color="darkorchid"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 8,
  },
  changeAvatarText: {
    textAlign: "center",
    color: "blue",
    fontSize: 14,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
});
