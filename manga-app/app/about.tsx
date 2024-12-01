import HandleCode from "@/utils/HandleCode";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { fetchDocument } from "@/api/documentApi";
import HTMLView from "react-native-htmlview";

export default function AboutPage() {
  const [content, setContent] = useState("<p>Loading...</p>");

  useEffect(() => {
    const fetchContent = async () => {
      const data = await fetchDocument(HandleCode.DOC_TYPE_ABOUT);
      setContent(data);
    };

    fetchContent();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <HTMLView value={content} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
