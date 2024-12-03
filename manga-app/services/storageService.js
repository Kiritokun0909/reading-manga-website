import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value.toString());

    // if (Platform.OS === "web") {
    //   await AsyncStorage.setItem(key, value.toString());
    // } else {
    //   // mobile
    //   await SecureStore.setItemAsync(key, value.toString());
    // }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const getItem = async (key) => {
  try {
    const result = await AsyncStorage.getItem(key);
    if (result) {
      return result;
    } else {
      return null;
    }

    // if (Platform.OS === "web") {
    //   const result = await AsyncStorage.getItem(key);
    //   if (result) {
    //     return result;
    //   } else {
    //     return null;
    //   }
    // } else {
    //   const result = await SecureStore.getItemAsync(key);
    //   if (result) {
    //     return result;
    //   } else {
    //     return null;
    //   }
    // }
  } catch (error) {
    // console.error("Error retrieving data:", error);
    return null;
  }
};

export const deleteItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);

    // if (Platform.OS === "web") {
    //   await AsyncStorage.removeItem(key);
    // } else {
    //   await SecureStore.deleteItemAsync(key);
    // }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};
