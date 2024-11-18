import { Text, View, StyleSheet } from "react-native";

export default function Notification() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thông báo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "black",
  },
});
