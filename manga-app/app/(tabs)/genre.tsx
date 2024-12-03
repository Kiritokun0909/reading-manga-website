import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { fetchGenres } from "../../api/genreApi";
import { router } from "expo-router";

type Genre = {
  genreId: number;
  genreName: string;
};

export default function GenrePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pressedGenre, setPressedGenre] = useState<number | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data: Genre[] = await fetchGenres();
        setGenres(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách thể loại</Text>
      </View>
      <ScrollView>
        <View style={styles.genreList}>
          <FlatList
            data={genres}
            keyExtractor={(item) => item.genreId.toString()}
            horizontal={false}
            showsHorizontalScrollIndicator={true}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isPressed = pressedGenre === item.genreId; // Check if the item is being held
              return (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: `/genre/[id]`,
                      params: {
                        id: item.genreId,
                        genreName: item.genreName,
                      },
                    })
                  }
                  onPressIn={() => setPressedGenre(item.genreId)} // Mark item as pressed
                  onPressOut={() => setPressedGenre(null)} // Reset when released
                  style={[
                    styles.genreItem,
                    isPressed && styles.pressedGenreItem, // Apply pressed style conditionally
                  ]}
                >
                  <Text style={styles.genreName}>{item.genreName}</Text>
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
});
