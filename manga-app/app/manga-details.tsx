import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function MangaDetails({ route }: any) {
  const { manga } = route.params; // Receive manga details as parameters

  return (
    <View style={styles.container}>
      <Image source={{ uri: manga.image }} style={styles.mangaImage} />
      <Text style={styles.title}>{manga.title}</Text>
      <Text style={styles.chapter}>Chapter {manga.newChapterNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  mangaImage: {
    width: 200,
    height: 300,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  chapter: {
    fontSize: 18,
    color: "gray",
    marginTop: 8,
  },
});
