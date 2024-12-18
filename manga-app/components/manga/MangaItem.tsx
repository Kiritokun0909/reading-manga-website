import { DEFAULT_COVER_IMAGE_URL } from "@/utils/const";
import { Link, RelativePathString } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

type MangaItemProps = {
  mangaLinkUrl: RelativePathString;
  imageUrl: string;
  title: string;
  newestChapterNumber: string;
};

export default function MangaItem({
  mangaLinkUrl,
  imageUrl,
  title,
  newestChapterNumber,
}: MangaItemProps) {
  if (!mangaLinkUrl) {
    console.error("Invalid mangaLinkUrl provided:", mangaLinkUrl);
    return null; // Prevent rendering if linkUrl is invalid
  }

  return (
    <Link href={mangaLinkUrl}>
      <View style={styles.mangaCard}>
        <Image
          source={{ uri: imageUrl || DEFAULT_COVER_IMAGE_URL }}
          style={styles.mangaImage}
        />
        <Text style={styles.mangaTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.mangaChapter}>Chapter {newestChapterNumber}</Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  mangaCard: {
    width: 180,
    height: 230,
    alignItems: "center",
    marginBottom: 8,
  },
  mangaImage: {
    width: 150,
    height: 190,
    borderRadius: 4,
  },
  mangaTitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    width: 140,
  },
  mangaChapter: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
});
