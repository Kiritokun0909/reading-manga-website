import { Text, View, StyleSheet } from "react-native";

export default function NotificationPage() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông báo</Text>
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
    borderBottomWidth: 3,
    borderBottomColor: "gray",
  },
  headerText: {
    color: "black",
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
  },
});
