import { fetchMangasByGenre } from "@/api/mangaApi";
import MangaItem from "@/components/manga/MangaItem";
import MangaList from "@/components/manga/MangaList";
import { RelativePathString, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, View } from "react-native";

export default function GenrePage() {
  const { id } = useLocalSearchParams();
  const [mangas, setMangas] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMangaByGenre(currentPage);
  }, [id]);

  const getMangaByGenre = async (pageNumber: number) => {
    try {
      setLoading(true);
      const data = await fetchMangasByGenre(id, pageNumber);
      setMangas([...mangas, ...data.mangas]);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = async () => {
    // console.log("currentPage", currentPage);
    // console.log("handleEndReached");
    if (currentPage > totalPages) return;
    const nextPage = currentPage + 1;
    await getMangaByGenre(nextPage);
    setCurrentPage(nextPage);
    // console.log("currentPage", currentPage);
    // console.log("mangas", mangas);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <MangaList
        mangaData={mangas}
        isHorizontal={false}
        numColumns={2}
        handelEndReached={handleNextPage}
      />
    </View>
  );
}
