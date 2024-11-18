import React from "react";
import { FlatList, View, Text, Image, StyleSheet } from "react-native";

interface Manga {
  id: string;
  title: string;
  newChapterNumber: string;
  image: string;
}

interface MangaListProps {
  mangaData: Manga[];
  isHorizontal: boolean;
  numColumns?: number; // Optional property
}

export default function MangaList({
  mangaData,
  isHorizontal,
  numColumns = 1,
}: MangaListProps) {
  return (
    <FlatList
      data={mangaData}
      keyExtractor={(item) => item.id}
      horizontal={isHorizontal}
      numColumns={isHorizontal ? undefined : numColumns}
      columnWrapperStyle={
        !isHorizontal && numColumns > 1
          ? { justifyContent: "space-around" }
          : undefined
      }
      showsHorizontalScrollIndicator={false}
      scrollEnabled={isHorizontal}
      renderItem={({ item }) => (
        <View style={styles.mangaCard}>
          <Image source={{ uri: item.image }} style={styles.mangaImage} />
          <Text
            style={styles.mangaTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text style={styles.mangaChapter}>
            Chapter {item.newChapterNumber}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  mangaCard: {
    width: 150,
    height: 220,
    alignItems: "center",
    marginBottom: 12,
  },
  mangaImage: {
    width: 140,
    height: 180,
    borderRadius: 4,
  },
  mangaTitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  mangaChapter: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
});
