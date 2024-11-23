import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loading from "../../../components/Loading";

import { getDetailManga } from "../../../api/SiteService";
import { useRef } from "react";
import { addChapter } from "../../../api/AdminService";

export default function UploadChapterPage() {
  const mangaId = useParams().mangaId;

  const [manga, setManga] = useState({});
  const [volumeNumber, setVolumeNumber] = useState(0);
  const [chapterNumber, setChapterNumber] = useState(0);
  const [chapterName, setChapterName] = useState("");

  const [novelContext, setNovelContext] = useState("");

  const [previewImages, setPreviewImages] = useState([]);
  const [chapterFiles, setChapterFiles] = useState([]);
  const fileInputRef = useRef(null); // Reference to trigger file input for changing

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await getDetailManga(mangaId);
        const data = response.mangaInfo;
        setManga(data);
        setChapterNumber(data.numChapters + 1);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchManga();
  }, [mangaId]);

  const handleButtonClick = () => {
    document.getElementById("imageUpload").click();
  };

  const onSelectFile = (event) => {
    const files = event.target.files;
    const selectedFiles = Array.from(files);

    // Preview images with order for display
    const imagesWithOrder = selectedFiles.map((file, index) => ({
      previewUrl: URL.createObjectURL(file),
      pageNumber: index + 1,
    }));

    // Files with page number for uploading
    const filesWithPageNumber = selectedFiles.map((file, index) => ({
      file: file,
      pageNumber: index + 1,
    }));

    // Update the state with previews and ordered files
    setPreviewImages(imagesWithOrder);
    setChapterFiles(filesWithPageNumber);

    console.log("Preview Images:", imagesWithOrder);
    console.log("Files with Page Numbers:", filesWithPageNumber);
  };

  // Function to handle triggering the file input
  const handleChangeImage = (index) => {
    fileInputRef.current.click(); // Trigger the hidden file input
    fileInputRef.current.onchange = (event) => handleFileChange(event, index); // Handle the file change event
  };

  // Function to update the selected image and preview for a specific page
  const handleFileChange = (event, index) => {
    const newFile = event.target.files[0];
    if (!newFile) return; // Ensure a file was selected

    // Update the preview image and file for the specified index
    const updatedPreviewImages = previewImages.map((image, i) =>
      i === index
        ? { ...image, previewUrl: URL.createObjectURL(newFile) }
        : image
    );

    const updatedChapterFiles = chapterFiles.map((file, i) =>
      i === index ? { ...file, file: newFile } : file
    );

    // Update state with the modified preview and file lists
    setPreviewImages(updatedPreviewImages);
    setChapterFiles(updatedChapterFiles);
  };

  const handleDeleteImage = (index) => {
    // Remove the selected image and reassign page numbers
    const updatedPreviewImages = previewImages
      .filter((_, i) => i !== index)
      .map((image, i) => ({
        ...image,
        pageNumber: i + 1, // Reassign page numbers
      }));

    const updatedChapterFiles = chapterFiles
      .filter((_, i) => i !== index)
      .map((file, i) => ({
        ...file,
        pageNumber: i + 1, // Reassign page numbers
      }));

    // Update state to reflect the deletion and reordered page numbers
    setPreviewImages(updatedPreviewImages);
    setChapterFiles(updatedChapterFiles);
  };

  const handleSubmit = async () => {
    // console.log("Manga ID", mangaId);
    // console.log("Chapter volume", volumeNumber);
    // console.log("Chapter number", chapterNumber);
    // console.log("Chapter name", chapterName);

    console.log("Preview Images:", previewImages);
    // console.log("Novel Context:", novelContext);
    // console.log("Chapter Files:", chapterFiles);
    try {
      setLoading(true);
      await addChapter(
        mangaId,
        volumeNumber,
        chapterNumber,
        chapterName,
        manga.isManga,
        chapterFiles,
        novelContext
      );
      setLoading(false);
      toast.success("Thêm chương thành công");
      navigate(`/admin/manga/${mangaId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col pt-2">
      {loading && <Loading />}

      {/* Manga information  */}
      <div className="manga-info">
        {/* Cover image */}
        <div className="manga-cover mr-6">
          <img
            className="w-52 h-64 rounded"
            src={
              manga.coverImageUrl
                ? manga.coverImageUrl
                : "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg"
            }
            alt="Cover"
          />
        </div>

        <div className="flex flex-col">
          {/* Manga info  */}
          <div>
            <div className="flex justify-center mt-2">
              <h3>{manga.mangaName}</h3>
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Tên khác:</label>
              {!manga.otherName ? "" : manga.otherName}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Loại truyện:</label>
              {manga.isManga === 0
                ? "Tiểu thuyết (Novel)"
                : "Truyện tranh (Manga)"}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Số chương:</label>
              {manga.numChapters}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">
                Chương mới cập nhật:
              </label>
              {manga.newestChapterNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Input new volume number, chapter number and chapter name  */}
      <div className="flex flex-col">
        <div className="flex justify-center">
          <h4>Thông tin chương mới</h4>
        </div>

        <div className="flex justify-start pt-2">
          <label className="w-32 font-bold text-lg">Volume số:</label>
          <input
            className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
            type="number"
            placeholder="Nhập sô volume..."
            value={volumeNumber}
            onChange={(e) => setVolumeNumber(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-start pt-2">
          <label className="w-32 font-bold text-lg">Chapter số:</label>
          <input
            className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
            type="number"
            placeholder="Nhập chương số..."
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-start pt-2">
          <label className="w-32 font-bold text-lg">Tên chapter:</label>
          <input
            className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
            type="text"
            placeholder="Nhập tên chapter..."
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
          />
        </div>
      </div>

      {/* Upload chapter  */}
      <div className="flex justify-center pt-4 flex-col">
        <div className="flex justify-center">
          <h4>Nội dung chương</h4>
        </div>

        {manga.isManga === 1 ? (
          <div className="flex justify-center mt-2 flex-col items-center">
            <button
              className="p-4 border-dashed border-2 border-slate-800 rounded-lg"
              onClick={handleButtonClick}
            >
              <p className="font-bold text-lg">Tải ảnh chương</p>
              <p>
                (Vui lòng format tên ảnh theo thứ tự trang trước khi tải lên)
              </p>
            </button>
            <div className="flex justify-center mt-2 flex-col items-center">
              <span className="font-bold text-lg">Xem trước</span>
            </div>
            <input
              id="imageUpload"
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onSelectFile}
            />

            {chapterFiles.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2 p-2 border border-slate-400 rounded-lg shadow-sm dark:bg-gray-700"
              >
                {/* Page number display */}
                <div className="flex flex-col items-start mr-4">
                  <span className="font-bold text-sm">
                    Trang {image.pageNumber}
                  </span>
                </div>

                {/* Display the image preview */}
                <img
                  src={previewImages[index].previewUrl}
                  alt={`Page ${image.pageNumber}`}
                  className="w-96 rounded-lg mr-4 object-cover"
                />

                {/* Change and Delete buttons */}
                <div className="flex space-x-2">
                  {/* Change button to update the image */}
                  <button
                    className="p-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-500"
                    onClick={() => handleChangeImage(index)}
                  >
                    Chọn ảnh
                  </button>

                  {/* Delete button to remove the image */}
                  <button
                    className="p-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-500"
                    onClick={() => handleDeleteImage(index)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}

            {/* Hidden file input for changing images */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        ) : (
          <ReactQuill
            className="h-80 text-sm mb-10"
            theme="snow"
            value={novelContext}
            onChange={setNovelContext}
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
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-center mt-4">
        <button
          className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
          onClick={handleSubmit}
        >
          Đăng chương
        </button>
      </div>
    </div>
  );
}
