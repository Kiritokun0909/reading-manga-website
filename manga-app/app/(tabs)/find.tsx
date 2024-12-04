import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import HandleCode from "@/utils/HandleCode";
import { fetchMangas } from "@/api/mangaApi";
import MangaItem from "@/components/manga/MangaItem";
import { RelativePathString } from "expo-router";

export default function SearchPage() {
  const [searchName, setSearchName] = useState("");
  const [filterCode, setFilterCode] = useState(
    HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mangas, setMangas] = useState<any>([]);

  // Ref for FlatList
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const firstGetMangas = async () => {
      try {
        const data = await fetchMangas(
          1,
          HandleCode.ITEMS_PER_PAGE,
          filterCode,
          searchName
        );
        setMangas(data.mangas);
        setCurrentPage(data.pageNumber);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    setCurrentPage(1);
    firstGetMangas();
  }, [searchName, filterCode]);

  const getMangas = async (pageNumber: number) => {
    try {
      const data = await fetchMangas(
        pageNumber,
        HandleCode.ITEMS_PER_PAGE,
        filterCode,
        searchName
      );

      setMangas([...mangas, ...data.mangas]);
      setCurrentPage(data.pageNumber);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const filterOptions = [
    {
      code: HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC,
      label: "Mới cập nhật",
    },
    {
      code: HandleCode.FILTER_BY_MANGA_LIKE_DESC,
      label: "Được yêu thích nhất",
    },
    {
      code: HandleCode.FILTER_BY_MANGA_VIEW_DESC,
      label: "Được đọc nhiều nhất",
    },
  ];

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleFilterSelection = (code: any) => {
    setFilterCode(code);
    setDropdownVisible(false);
  };

  const handleNextPage = async () => {
    if (currentPage > totalPages) return;
    const nextPage = currentPage + 1;
    await getMangas(nextPage);
    setCurrentPage(nextPage);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tìm kiếm</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên truyện muốn tìm..."
          value={searchName}
          onChangeText={(text) => setSearchName(text)}
        />
      </View>

      {/* Filter Dropdown */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.filterButtonText}>
            Lọc theo:{" "}
            {filterOptions.find((option) => option.code === filterCode)?.label}
          </Text>
        </TouchableOpacity>
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <FlatList
              data={filterOptions}
              keyExtractor={(item) => item.code.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleFilterSelection(item.code)}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Show search result  */}
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          marginTop: 12,
        }}
        style={{ flex: 1, padding: 8 }}
        ref={flatListRef}
        data={mangas}
        keyExtractor={(item: any) => item.mangaId.toString()}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        renderItem={({ item }: any) => (
          <MangaItem
            mangaLinkUrl={`/manga/${item.mangaId}` as RelativePathString}
            imageUrl={item.coverImageUrl}
            title={item.mangaName}
            newestChapterNumber={item.newestChapterNumber}
          />
        )}
        onEndReached={handleNextPage}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  filterContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: "#1004bf",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  filterButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    // marginTop: 2,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  dropdownItemText: {
    fontSize: 16,
  },
});
