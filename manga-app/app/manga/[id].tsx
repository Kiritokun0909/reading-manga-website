import {
  checkUserFollowManga,
  checkUserLikeManga,
  followManga,
  likeManga,
  postReview,
} from "@/api/accountApi";
import { fetchMangaInfo, fetchMangaReviews } from "@/api/mangaApi";
import PlanList from "@/components/plan/PlanList";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_COVER_IMAGE_URL } from "@/utils/const";
import { ITEMS_PER_PAGE } from "@/utils/HandleCode";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function MangaPage() {
  const { id } = useLocalSearchParams();

  const { authState } = useAuth();

  const [manga, setManga] = useState<any>({});
  const [mangaGenres, setMangaGenres] = useState<any>([]);

  const [isLike, setIsLike] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  const [newReview, setNewReview] = useState<string>("");
  const [reviews, setReviews] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 25; // Maximum characters to show when collapsed

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  // Fetch manga info, list chapter and first review page
  useEffect(() => {
    getMangaInfo();
    getReviews(1);

    if (!authState?.authenticated) return;
    getLikeStatus();
    getFollowStatus();
  }, [id]);

  const getMangaInfo = async () => {
    try {
      const data = await fetchMangaInfo(id);
      setManga(data.mangaInfo);
      setMangaGenres(data.mangaInfo.genres);
    } catch (error) {
      console.log(error);
    }
  };

  const getLikeStatus = async () => {
    const checked = await checkUserLikeManga(id);
    setIsLike(checked);
  };

  const getFollowStatus = async () => {
    const checked = await checkUserFollowManga(id);
    setIsFollow(checked);
  };

  const getReviews = async (pageNumber: number) => {
    try {
      const data = await fetchMangaReviews(id, pageNumber, ITEMS_PER_PAGE);
      if (pageNumber === 1) setReviews(data.reviews);
      else setReviews([...reviews, ...data.reviews]);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const checkIsSignIn = () => {
    if (!authState?.authenticated) {
      showToast("error", "Vui lòng đăng nhập để sử dụng!");
      return false;
    }
    return true;
  };

  const handleLikeClick = async () => {
    if (!checkIsSignIn()) return;
    try {
      await likeManga(id, !isLike);
      setIsLike(!isLike);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowClick = async () => {
    if (!checkIsSignIn()) return;
    try {
      await followManga(id, !isFollow);
      setIsFollow(!isFollow);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNextReviewPage = async () => {
    if (currentPage > totalPages) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    getReviews(nextPage);
  };

  const validateReview = () => {
    if (newReview === "") {
      showToast("error", "Vui lòng nhập đánh giá trước khi gửi!");
      return false;
    }

    return true;
  };

  const handleSubmitReview = async () => {
    if (!checkIsSignIn() || !validateReview()) return;
    try {
      const success = await postReview(id, newReview);
      if (success) showToast("success", "Gửi đánh giá thành công!");
      setNewReview("");
      getReviews(1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.mangaInfo}>
        {/* Display manga cover image and manga name in the center */}
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: manga.coverImageUrl || DEFAULT_COVER_IMAGE_URL }}
            style={{ width: 180, height: 250, marginTop: 10 }}
          />
          <Text style={styles.mangaName}>{manga.mangaName}</Text>
        </View>

        {/* Like and Follow */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <TouchableOpacity
            style={[
              styles.likeButton,
              { backgroundColor: "crimson", borderColor: "crimson" },
            ]}
            onPress={() => handleLikeClick()}
          >
            <Text style={styles.likeButtonText}>
              {isLike ? "Huỷ thích" : "Yêu thích"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.likeButton,
              { backgroundColor: "blueviolet", borderColor: "blueviolet" },
            ]}
            onPress={() => handleFollowClick()}
          >
            <Text style={styles.likeButtonText}>
              {isFollow ? "Huỷ theo dõi" : "Theo dõi"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manga info (other name, author, etc...) */}
        <View style={styles.infoSection}>
          <View style={[styles.infoRow, { width: "85%" }]}>
            <View>
              <Text style={styles.infoLabel}>Tên khác:</Text>
            </View>
            <Text style={styles.infoText}>{manga.otherName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tác giả:</Text>
            <Text style={styles.infoText}>
              {manga.authorName ? manga.authorName : "Đang cập nhật"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loại truyện:</Text>
            <Text style={styles.infoText}>
              {manga.isManga ? "Tiểu thuyết (Novel)" : "Truyện tranh (Manga)"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Năm phát hành:</Text>
            <Text style={styles.infoText}>
              {!manga.publishedYear ? "Đang cập nhật" : manga.publishedYear}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Độ tuổi:</Text>
            <Text style={styles.infoText}>
              {!manga.ageLimit ? "Không giới hạn" : manga.ageLimit}+
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số chương:</Text>
            <Text style={styles.infoText}>{manga.numChapters}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lượt xem:</Text>
            <Text style={styles.infoText}>{manga.numViews}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lượt theo dõi:</Text>
            <Text style={styles.infoText}>{manga.numFollows}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cập nhật lúc:</Text>
            <Text style={styles.infoText}>
              {!manga.updateAt ? "" : manga.updateAt}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Yêu cầu trả phí:</Text>
            <Text style={styles.infoText}>
              {manga.isFree === 0 ? "Có" : "Không"}
            </Text>
          </View>
        </View>

        {/* Genre list */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thể loại:</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
                width: "75%",
              }}
            >
              {mangaGenres.map((genre: any) => (
                <Pressable
                  key={genre.genreId}
                  style={[
                    {
                      backgroundColor: "orange",
                      borderColor: "orange",
                      padding: 4,
                      borderRadius: 4,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: `/genre/[id]`,
                      params: {
                        id: genre.genreId,
                        genreName: genre.genreName,
                      },
                    })
                  }
                >
                  <Text
                    style={{ color: "black", fontFamily: "OpenSans-SemiBold" }}
                  >
                    {genre.genreName}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 12 }}>
          <Text style={styles.infoLabel}>Mô tả:</Text>
          <View style={{ marginTop: 4 }}>
            {!manga.description ? (
              <Text>Đang cập nhật</Text>
            ) : (
              <Text>
                {isExpanded
                  ? manga.description
                  : `${manga.description.slice(0, maxLength)}...`}
                {manga && manga.description.length > maxLength && (
                  <Pressable onPress={toggleExpand}>
                    <Text style={[styles.toggleText, { color: "blue" }]}>
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </Text>
                  </Pressable>
                )}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Plan section */}
      <View style={{ marginTop: 24, paddingHorizontal: 12 }}>
        {manga.isFree === 0 && (
          <View>
            <Text style={{ fontSize: 20, fontFamily: "OpenSans-SemiBold" }}>
              Danh sách gói
            </Text>

            <PlanList mangaId={id.toString()} />
          </View>
        )}
      </View>

      {/* Chapter section */}
      <View style={{ marginTop: 24, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 20, fontFamily: "OpenSans-SemiBold" }}>
            Danh sách chương
          </Text>
          <TouchableOpacity
            style={{ padding: 8, backgroundColor: "orange", borderRadius: 4 }}
            onPress={() =>
              router.push({
                pathname: `/manga/chapters`,
                params: {
                  mangaId: id,
                },
              })
            }
          >
            <Text style={{ color: "black", fontFamily: "OpenSans-SemiBold" }}>
              Xem các chương
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Review section */}
      <View style={{ marginTop: 24 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontFamily: "OpenSans-SemiBold" }}>
            Đánh giá truyện
          </Text>
        </View>
        {/* Input for adding a new review */}
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 12,
            marginTop: 12,
          }}
        >
          <View>
            <TextInput
              multiline
              style={{
                width: "100%",
                height: 80,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 4,
                padding: 15,
                backgroundColor: "white",
              }}
              placeholder="Viết đánh giá..."
              value={newReview}
              onChangeText={setNewReview}
            />
          </View>

          <View style={{ alignItems: "flex-end", marginTop: 6 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "darkcyan",
                padding: 8,
                borderRadius: 4,
              }}
              onPress={() => handleSubmitReview()}
            >
              <Text style={{ fontFamily: "OpenSans-SemiBold", color: "white" }}>
                Gửi đánh giá
                <FontAwesome
                  style={{ marginLeft: 6 }}
                  name="send"
                  size={16}
                  color="white"
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Review List */}
        <FlatList
          contentContainerStyle={{ flexDirection: "column", padding: 12 }}
          data={reviews}
          keyExtractor={(item) => item.reviewId.toString()}
          horizontal={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                width: "100%",
                borderBottomWidth: 1,
                borderColor: "gray",
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.username}</Text>
                <Text>{new Date(item.createAt).toLocaleString()}</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text>
                  {item.context === ""
                    ? "Bình luận này đã bị ẩn"
                    : item.context}
                </Text>
              </View>
            </View>
          )}
          onEndReached={() => {}}
          onEndReachedThreshold={0.5}
        />
        <View style={{ alignItems: "center", marginTop: 6 }}>
          {currentPage < totalPages && (
            <TouchableOpacity
              onPress={() => {
                handleNextReviewPage();
              }}
            >
              <Text style={styles.toggleText}>Xem thêm</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ height: 50 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  mangaInfo: {
    flexDirection: "column",
  },
  mangaName: {
    marginTop: 10,
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
  },
  infoSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    marginRight: 4,
  },
  infoText: {
    fontSize: 15,
    fontFamily: "OpenSans-Regular",
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
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  reviewItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
