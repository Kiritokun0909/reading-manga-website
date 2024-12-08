import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import HTMLView from "react-native-htmlview";
import { DEFAULT_COVER_IMAGE_URL } from "@/utils/const";
import { fetchChapterDetail } from "@/api/mangaApi";
import { router, useLocalSearchParams } from "expo-router";

export default function ChapterPage() {
  const { id } = useLocalSearchParams();

  const [isManga, setIsManga] = useState(false);
  const [mangaName, setMangaName] = useState("");
  const [volumeNumber, setVolumeNumber] = useState(0);
  const [chapterNumber, setChapterNumber] = useState(0);
  const [chapterName, setChapterName] = useState("");
  const [novelContext, setNovelContext] = useState("");
  const [chapterImages, setChapterImages] = useState<any>([]);
  const [imageSizes, setImageSizes] = useState<
    Record<number, { width: number; height: number }>
  >({});

  const [nextId, setNextId] = useState(0);
  const [prevId, setPrevId] = useState(0);

  const showToast = (type: string, title: string, message: string = "") => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  useEffect(() => {
    fetchChapter();
  }, [id]);

  const fetchChapter = async () => {
    const response = await fetchChapterDetail(id);
    if (response.success) {
      const data = response.data;
      setMangaName(data.mangaName);
      setVolumeNumber(data.volumeNumber);
      setChapterNumber(data.chapterNumber);
      setChapterName(data.chapterName);
      setIsManga(data.isManga === 1);
      setNovelContext(data.novelContext);
      setChapterImages(data.chapterImages);
      setNextId(data.nextChapterId);
      setPrevId(data.previousChapterId);

      // Calculate image sizes
      data.chapterImages?.forEach((item: any, index: number) => {
        calculateImageSize(item.imageUrl || DEFAULT_COVER_IMAGE_URL, index);
      });
    } else {
      const mangaId = response.mangaId;
      showToast("error", "Lỗi", response.message);
      router.push(`/`); // Redirect to the home page
      router.push(`/manga/${mangaId}`);
    }
  };

  const calculateImageSize = (imageUrl: string, index: number) => {
    Image.getSize(
      imageUrl,
      (width, height) => {
        const screenWidth = Dimensions.get("window").width;
        const scaledHeight = (screenWidth / width) * height;
        setImageSizes((prev) => ({
          ...prev,
          [index]: { width: screenWidth - 24, height: scaledHeight },
        }));
      },
      (error) => {
        console.error(`Failed to load image at ${imageUrl}:`, error);
      }
    );
  };

  const navigatePrevChapter = () => {
    if (!prevId) {
      showToast("error", "Không còn chương nào trước đó.");
      return;
    }
    router.push({
      pathname: `/chapter/[id]`,
      params: { id: prevId.toString() },
    });
  };

  const navigateNextChapter = () => {
    if (!nextId) {
      showToast("error", "Bạn đã đọc chương mới nhất.");
      return;
    }
    router.push({
      pathname: `/chapter/[id]`,
      params: { id: nextId.toString() },
    });
  };

  return (
    <ScrollView>
      <View style={styles.chapterHeader}>
        <Text style={styles.title}>{mangaName}</Text>
        <Text>
          Vol {volumeNumber} - Chapter {chapterNumber}
        </Text>
        {chapterName && <Text>{chapterName}</Text>}
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={navigatePrevChapter}
        >
          <Text style={styles.navigateText}>Chương trước</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={navigateNextChapter}
        >
          <Text style={styles.navigateText}>Chương kế</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chapterContent}>
        {!isManga ? (
          <View style={{ padding: 12 }}>
            <HTMLView value={novelContext} />
          </View>
        ) : (
          <View>
            {chapterImages.map((item: any, index: number) => (
              <View key={item.pageNumber}>
                {imageSizes[index] && (
                  <Image
                    source={{
                      uri: item.imageUrl || DEFAULT_COVER_IMAGE_URL,
                    }}
                    style={{
                      width: imageSizes[index].width,
                      height: imageSizes[index].height,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={navigatePrevChapter}
        >
          <Text style={styles.navigateText}>Chương trước</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={navigateNextChapter}
        >
          <Text style={styles.navigateText}>Chương kế</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chapterHeader: {
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
    marginTop: 12,
    padding: 2,
  },
  title: {
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  navigateButton: {
    backgroundColor: "blue",
    padding: 6,
    borderRadius: 5,
  },
  navigateText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
  },
  chapterContent: {
    marginTop: 6,
    alignItems: "center",
  },
});
