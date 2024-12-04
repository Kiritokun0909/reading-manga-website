import { ITEMS_PER_PAGE } from "@/utils/HandleCode";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetchFollowList, fetchLikeList } from "@/api/accountApi";
import MangaList from "@/components/manga/MangaList";

export default function LikeFollowList() {
  const { type } = useLocalSearchParams();

  const [mangas, setMangas] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getMangas(currentPage);
  }, [type]);

  const getMangas = async (pageNumber: number) => {
    try {
      if (type === "like") {
        const data = await fetchLikeList(pageNumber, ITEMS_PER_PAGE);
        setMangas([...mangas, ...data.mangas]);
        setTotalPages(data.totalPages);
      } else {
        const data = await fetchFollowList(pageNumber, ITEMS_PER_PAGE);
        setMangas([...mangas, ...data.mangas]);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextPage = async () => {
    if (currentPage > totalPages) return;
    const nextPage = currentPage + 1;
    await getMangas(nextPage);
    setCurrentPage(nextPage);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {mangas.length === 0 && (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text>Chưa có manga nào</Text>
        </View>
      )}
      <MangaList
        mangaData={mangas}
        isHorizontal={false}
        numColumns={2}
        handelEndReached={handleNextPage}
      />
    </View>
  );
}
