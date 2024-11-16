import React, { useEffect, useState } from "react";
import { getDocument } from "../../api/SiteService";
import HandleCode from "../../utilities/HandleCode";
import { toast } from "react-toastify";
import RichTextDisplay from "../../components/RichTextDisplay";

export default function PrivacyPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getDocument(HandleCode.DOC_TYPE_POLICY);
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
        <h1 className="text-3xl font-bold">Chính sách và điều khoản sử dụng</h1>
      </div>
      <div className="p-4">
        <RichTextDisplay richText={content} />
      </div>
    </div>
  );
}
