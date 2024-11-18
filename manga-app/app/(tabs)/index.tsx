import { Text, View, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MangaList from "@/components/MangaList"; // Adjust the path based on your project structure
import { globalStyles } from "@/utils/const";

const favoriteManga = [
  {
    id: "1",
    title: "One Piece",
    newChapterNumber: "10",
    image:
      "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg",
  },
  {
    id: "2",
    title: "Naruto",
    newChapterNumber: "10",
    image:
      "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg",
  },
  {
    id: "3",
    title: "Attack on Titan",
    newChapterNumber: "10",
    image:
      "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg",
  },
  {
    id: "4",
    title: "Attack on Titan",
    newChapterNumber: "10",
    image:
      "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg",
  },
  {
    id: "5",
    title: "Attack on Titan 123 333333333333333333",
    newChapterNumber: "10",
    image:
      "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg",
  },
  {
    id: "6",
    title: "Attack on Titan 123 333333333333333333",
    newChapterNumber: "10",
    image:
      "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg",
  },
];

export default function Index() {
  return (
    <ScrollView contentContainerStyle={{ padding: 12 }} style={{ flex: 1 }}>
      {/* Favorite Manga Section */}
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
        <MangaList mangaData={favoriteManga} isHorizontal={true} />
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
          <Text style={[styles.text, globalStyles.globalFont]}>
            Mới cập nhật
          </Text>
        </View>
        <MangaList
          mangaData={favoriteManga}
          isHorizontal={false}
          numColumns={2}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 4,
    color: "dodgerblue",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "OpenSans-Regular",
  },
});
