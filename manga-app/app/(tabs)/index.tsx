import { Text, View, StyleSheet, ScrollView, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MangaList from "@/components/manga/MangaList";
import { globalStyles } from "@/utils/const";
import { useEffect, useState } from "react";
import { fetchMangas } from "@/api/mangaApi";
import HandleCode from "@/utils/HandleCode";
import MangaItem from "@/components/manga/MangaItem";
import { RelativePathString } from "expo-router";

export default function HomePage() {
  const [mostViewedManga, setMostViewedManga] = useState<any>([]);
  const [mostFavoriteManga, setMostFavoriteManga] = useState<any>([]);
  const [recentlyUpdatedManga, setRecentlyUpdatedManga] = useState<any>([]);
  const PAGE_NUMBER = 1;

  useEffect(() => {
    getMostViewedManga();
    getMostFavoriteManga();
    getRecentlyUpdatedManga();
  }, []);

  const getMostViewedManga = async () => {
    try {
      const data = await fetchMangas(
        PAGE_NUMBER,
        HandleCode.ITEMS_PER_PAGE,
        HandleCode.FILTER_BY_MANGA_VIEW_DESC
      );
      setMostViewedManga(data.mangas);
    } catch (error) {
      console.log(error);
    }
  };

  const getMostFavoriteManga = async () => {
    try {
      const data = await fetchMangas(
        PAGE_NUMBER,
        HandleCode.ITEMS_PER_PAGE,
        HandleCode.FILTER_BY_MANGA_LIKE_DESC
      );
      setMostFavoriteManga(data.mangas);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentlyUpdatedManga = async () => {
    try {
      const data = await fetchMangas(
        PAGE_NUMBER,
        HandleCode.ITEMS_PER_PAGE,
        HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC
      );
      setRecentlyUpdatedManga(data.mangas);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Trang chủ</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{ padding: 12 }}
        style={{ flex: 1 }}
      >
        {/* Most Viewed Manga Section */}
        <View style={{ height: 260 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <MaterialIcons
              name="align-vertical-bottom"
              size={20}
              color="dodgerblue"
            />
            <Text style={styles.text}>Được xem nhiều</Text>
          </View>
          <MangaList
            mangaData={mostViewedManga}
            isHorizontal={true}
            handelEndReached={() => {}}
          />
        </View>

        {/* Most Favorite Manga Section */}
        <View style={{ height: 260 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <MaterialIcons name="favorite" size={20} color="dodgerblue" />
            <Text style={styles.text}>Được yêu thích</Text>
          </View>
          <MangaList
            mangaData={mostFavoriteManga}
            isHorizontal={true}
            handelEndReached={() => {}}
          />
        </View>

        {/* Recently Updated Section */}
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <MaterialIcons name="update" size={20} color="dodgerblue" />
            <Text style={[styles.text]}>Mới cập nhật</Text>
          </View>
          <FlatList
            data={recentlyUpdatedManga}
            keyExtractor={(item: any) => item.mangaId.toString()}
            horizontal={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }: any) => (
              <MangaItem
                mangaLinkUrl={`/manga/${item.mangaId}` as RelativePathString}
                imageUrl={item.coverImageUrl}
                title={item.mangaName}
                newestChapterNumber={item.newestChapterNumber}
              />
            )}
          />
        </View>
      </ScrollView>
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
    fontWeight: "900",
    fontFamily: "OpenSans-Bold",
  },
  text: {
    marginLeft: 4,
    color: "dodgerblue",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "OpenSans-SemiBold",
  },
});
