import React, { useEffect, useState } from "react";
import HandleCode from "../../utilities/HandleCode";
import RichTextDisplay from "../../components/RichTextDisplay";
import { toast } from "react-toastify";
import { getDocument } from "../../api/SiteService";

export default function AboutPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getDocument(HandleCode.DOC_TYPE_ABOUT);
        setContent(response);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchContent();
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold">Giới thiệu ứng dụng</h1>
      </div>
      <div className="p-4">
        <RichTextDisplay richText={content} />
      </div>
    </div>
  );
}
