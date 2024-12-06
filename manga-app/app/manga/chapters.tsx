import { fetchMangaChapters } from "@/api/mangaApi";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Chapter = {
  chapterId: number;
  volumeNumber: number;
  chapterNumber: number;
  chapterName: string;
  updateAt: any;
};

export default function ChaptersPage() {
  const { mangaId } = useLocalSearchParams();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pressed, setPressed] = useState<number | null>(null);

  useEffect(() => {
    getMangaChapters();
  }, []);

  const getMangaChapters = async () => {
    try {
      const data = await fetchMangaChapters(mangaId);
      setChapters(data.chapters);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {chapters.length > 0 && (
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}
        >
          <TouchableOpacity
            style={[
              styles.likeButton,
              { backgroundColor: "crimson", borderColor: "crimson" },
            ]}
            onPress={() =>
              router.push({
                pathname: `/chapter/[id]`,
                params: {
                  id: chapters[chapters.length - 1].chapterId,
                },
              })
            }
          >
            <Text style={styles.likeButtonText}>Đọc từ đầu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.likeButton,
              { backgroundColor: "blueviolet", borderColor: "blueviolet" },
            ]}
            onPress={() =>
              router.push({
                pathname: `/chapter/[id]`,
                params: {
                  id: chapters[0].chapterId,
                },
              })
            }
          >
            <Text style={styles.likeButtonText}>Đọc mới nhất</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView>
        <View style={styles.genreList}>
          <FlatList
            data={chapters}
            keyExtractor={(item) => item.chapterId.toString()}
            horizontal={false}
            showsHorizontalScrollIndicator={true}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isPressed = pressed === item.chapterId;
              return (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: `/chapter/[id]`,
                      params: {
                        id: item.chapterId,
                      },
                    })
                  }
                  onPressIn={() => setPressed(item.chapterId)}
                  onPressOut={() => setPressed(null)}
                  style={[
                    styles.genreItem,
                    isPressed && styles.pressedGenreItem, // Apply pressed style conditionally
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.genreName}>
                      Vol {item.volumeNumber} - Chapter {item.chapterNumber}
                    </Text>
                    <Text>
                      <Text>{new Date(item.updateAt).toLocaleString()}</Text>
                    </Text>
                  </View>
                </Pressable>
              );
            }}
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
  genreList: {},
  genreItem: {
    padding: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  pressedGenreItem: {
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Slightly darkened background
  },
  genreName: {
    marginLeft: 8,
    color: "black",
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
  },

  likeButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 8,
  },
  likeButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
  },
});
