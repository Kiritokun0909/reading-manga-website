import { RelativePathString } from "expo-router";
import React from "react";
import { FlatList } from "react-native";
import MangaItem from "./MangaItem";

interface Manga {
  mangaId: number;
  mangaName: string;
  newestChapterNumber: string;
  coverImageUrl: string;
}

interface MangaListProps {
  mangaData: Manga[];
  isHorizontal: boolean;
  numColumns?: number;
  handelEndReached: () => void;
}

export default function MangaList({
  mangaData,
  isHorizontal = true,
  numColumns = 1,
  handelEndReached,
}: MangaListProps) {
  return (
    <FlatList
      data={mangaData}
      keyExtractor={(item) => item.mangaId.toString()}
      horizontal={isHorizontal}
      numColumns={isHorizontal ? undefined : numColumns}
      columnWrapperStyle={
        !isHorizontal && numColumns > 1
          ? { justifyContent: "space-around" }
          : undefined
      }
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      renderItem={({ item }) => (
        <MangaItem
          mangaLinkUrl={`/manga/${item.mangaId}` as RelativePathString}
          imageUrl={item.coverImageUrl}
          title={item.mangaName}
          newestChapterNumber={item.newestChapterNumber}
        />
      )}
      onEndReached={handelEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}
