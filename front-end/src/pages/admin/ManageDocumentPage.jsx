import React, { useEffect, useState } from "react";
import HandleCode from "../../utilities/HandleCode.js";
import { getDocument } from "../../api/SiteService.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updateDocument } from "../../api/AdminService.js";
import { toast } from "react-toastify";

export default function ManageDocumentPage() {
  const [docType, setDocType] = useState(HandleCode.DOC_TYPE_ABOUT);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDocument(docType);
        setContent(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [docType]);

  const fetchData = async () => {
    try {
      const data = await getDocument(docType);
      setContent(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateDocument(docType, content);
      toast.success("Cập nhật thành công.");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col p-4 pt-0 w-full">
      <div className="flex justify-center py-4">
        <h1>Quản lý tài liệu</h1>
      </div>

      <div className="flex flex-row justify-end pb-4">
        <div className="flex ml-4">
          <label className="mr-2 pt-2">Loại:</label>
          <select
            defaultValue={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="form-select"
          >
            <option value={HandleCode.DOC_TYPE_ABOUT}>
              Giới thiệu ứng dụng
            </option>
            <option value={HandleCode.DOC_TYPE_POLICY}>
              Chính sách và điều khoản
            </option>
          </select>
        </div>
      </div>

      <div>
        <ReactQuill
          className="h-80 text-sm mb-10"
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Nhập nội dung chương..."
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: ["small", false, "large", "huge"] }], // Custom font sizes
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike"],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ["link", "image", "video"],
              ["clean"], // Remove formatting button
            ],
          }}
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
          onClick={handleSubmit}
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}
