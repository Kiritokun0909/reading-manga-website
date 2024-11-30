import { Link, RelativePathString, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function MangaPage() {
  const { id } = useLocalSearchParams();
  const prevId = Number(id) - 1;
  const nextId = Number(id) + 1;

  const nextUrl = `/chapter/${nextId}`;
  const prevUrl = `/chapter/${prevId}`;
  return (
    <View>
      <Text>Chapter post: {id}</Text>
      <Link href={nextUrl as RelativePathString}>
        <Text>Go to chapter {nextId}</Text>
      </Link>
      <Link href={prevUrl as RelativePathString}>
        <Text>Go to chapter {prevId}</Text>
      </Link>
    </View>
  );
}
