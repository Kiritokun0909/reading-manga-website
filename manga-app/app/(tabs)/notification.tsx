import { fetchNotifications, readNotification } from "@/api/accountApi";
import { useAuth } from "@/context/AuthContext";
import { ITEMS_PER_PAGE } from "@/utils/HandleCode";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";

export default function NotificationPage() {
  const { authState } = useAuth();
  const [pressButton, setPressButton] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setNotifications([]);
      if (!authState?.authenticated) return;
      firstGetNotifications();
    }, [])
  );

  useEffect(() => {
    setNotifications([]);
    if (!authState?.authenticated) return;
    firstGetNotifications();
  }, [authState]);

  const firstGetNotifications = async () => {
    try {
      const data = await fetchNotifications(1, ITEMS_PER_PAGE);
      setNotifications(data.notifications);
      setCurrentPage(1);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getNotifications = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await fetchNotifications(pageNumber, ITEMS_PER_PAGE);
      setNotifications([...notifications, ...data.notifications]);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = async () => {
    if (currentPage > totalPages) return;
    const nextPage = currentPage + 1;
    await getNotifications(nextPage);
    setCurrentPage(nextPage);
  };

  const handleNotificationClick = async (notification: any) => {
    if (notification.isRead === 0) {
      await readNotification(notification.notificationId);
    }
    router.push(`/manga/${notification.mangaId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông báo</Text>
      </View>

      {/* Authenticated Content */}
      {authState?.authenticated ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.notificationId.toString()}
          horizontal={false}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                handleNotificationClick(item);
              }}
              style={[
                styles.notificationItem,
                { backgroundColor: item.isRead === 0 ? "white" : "lightgrey" },
              ]}
            >
              <Image
                source={{ uri: item.coverImageUrl }}
                style={{ width: 100, height: 120 }}
              />
              <View style={styles.notificationContent}>
                <Text
                  style={styles.notificationTitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.mangaName} vừa đăng chương mới
                </Text>
                <Text style={styles.notificationDate}>
                  Ngày đăng: {item.createAt}
                </Text>
              </View>
            </Pressable>
          )}
          onEndReached={handleNextPage}
          onEndReachedThreshold={1}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="small" /> : null
          }
        />
      ) : (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text>Đăng nhập để nhận thông báo các truyện theo dõi</Text>
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
    borderBottomWidth: 1,
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

  notificationItem: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  notificationContent: {
    flex: 1, // Allows content to take up remaining space
    flexDirection: "column",
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  notificationDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
});
