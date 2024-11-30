import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function MangaPage() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Manga post: {id}</Text>
      <Link href="/chapter/1">Go to chapter!</Link>
    </View>
  );
}
