import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../../styles/site/Home.css";
import "../../../styles/site/Genre.css";
import { getListGenres, getDetailManga } from "../../../api/SiteService";
import {
  getListAuthor,
  updateManga,
  updateMangaGenres,
} from "../../../api/AdminService";
import HandleCode from "../../../utilities/HandleCode";
import { useParams } from "react-router-dom";

export default function UpdateMangaPage() {
  const mangaId = useParams().mangaId;

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [mangaName, setMangaName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [isManga, setIsManga] = useState(true);
  const [isFree, setIsFree] = useState(true);
  const [publishedYear, setPublishedYear] = useState(2024);
  const [ageLimit, setAgeLimit] = useState(8);
  const [description, setDescription] = useState("");

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [searchAuthorName, setSearchAuthorName] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState("");

  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await getListGenres();
        setGenres(data);
      } catch (error) {
        console.error("Error get list genre:", error);
      }
    };

    const fetchManga = async () => {
      try {
        const data = await getDetailManga(mangaId);
        const manga = data.mangaInfo;
        setCoverImageUrl(manga.coverImageUrl);
        setMangaName(manga.mangaName);
        setOtherName(manga.otherName === null ? "" : manga.otherName);
        setIsManga(manga.isManga === 1 ? true : false);
        setIsFree(manga.isFree === 1 ? true : false);
        setPublishedYear(manga.publishedYear);
        setAgeLimit(manga.ageLimit);
        setDescription(manga.description === null ? "" : manga.description);

        if (manga.authorId != null) {
          setSelectedAuthorId(manga.authorId);
          setSearchAuthorName(manga.authorName);
        }

        const ids = manga.genres.map((genre) => String(genre.genreId));
        setSelectedGenres(ids);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getGenres();
    fetchManga();
  }, [mangaId]);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (searchAuthorName.trim().length === 0) {
        setAuthors([]);
        return;
      }

      try {
        const data = await getListAuthor(
          1,
          5,
          HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_DESC,
          searchAuthorName
        );
        setAuthors(data.authors);
      } catch (error) {
        // console.error("Error fetching authors:", error);
        toast.error(error.message);
      }
    };

    fetchAuthors();
  }, [searchAuthorName]);

  const fetchManga = async () => {
    try {
      const data = await getDetailManga(mangaId);
      const manga = data.mangaInfo;
      setCoverImageUrl(manga.coverImageUrl);
      setMangaName(manga.mangaName);
      setOtherName(manga.otherName === null ? "" : manga.otherName);
      setIsManga(manga.isManga === 1 ? true : false);
      setIsFree(manga.isFree === 1 ? true : false);
      setPublishedYear(manga.publishedYear);
      setAgeLimit(manga.ageLimit);
      setDescription(manga.description === null ? "" : manga.description);

      if (manga.authorId != null) {
        setSelectedAuthorId(manga.authorId);
        setSearchAuthorName(manga.authorName);
      }

      const ids = manga.genres.map((genre) => String(genre.genreId));
      setSelectedGenres(ids);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSelectChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres((prev) =>
      checked ? [...prev, value] : prev.filter((genreId) => genreId !== value)
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all genres
      const allGenreIds = genres.map((genre) => genre.genreId.toString());
      setSelectedGenres(allGenreIds);
    } else {
      // Deselect all genres
      setSelectedGenres([]);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverImageUrl(URL.createObjectURL(file));
  };

  const handleButtonClick = () => {
    document.getElementById("coverUpload").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mangaName.trim().length === 0) {
      toast.error("Tên truyện không được để trống");
      return;
    }

    if (otherName.trim().length === 0) {
      toast.error("Tên khác không được để trống");
      return;
    }

    if (description.trim().length === 0) {
      toast.error("Mô tả không được để trống");
      return;
    }

    try {
      await updateManga(
        mangaId,
        coverImageFile,
        mangaName,
        otherName,
        isManga,
        isFree,
        publishedYear,
        ageLimit,
        description,
        selectedAuthorId
      );
      await updateMangaGenres(selectedGenres, mangaId);
      toast.success("Cập nhật truyện thành công");
      fetchManga();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center p-4 pt-2">
      <div className="flex justify-center">
        <h1>Cập nhật truyện</h1>
      </div>

      <form>
        {/* Manga info section  */}
        <div className="flex flex-col mt-2">
          <div className="w-full text-center">
            <div className="flex justify-center">
              <img
                className="w-40 h-56"
                src={
                  coverImageUrl
                    ? coverImageUrl
                    : "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg"
                }
                alt="Cover"
              />
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className="mt-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Chọn ảnh
            </button>

            <input
              id="coverUpload"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex justify-start pt-2">
            <label className="w-32 font-bold text-lg">Tên manga:</label>
            <input
              className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="text"
              placeholder="Nhập tên truyện..."
              value={mangaName}
              onChange={(e) => setMangaName(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-start pt-2">
            <label className="w-32 font-bold text-lg">Tên gọi khác:</label>
            <input
              className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="text"
              placeholder="Nhập tên khác của truyện..."
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
            />
          </div>

          <div className="flex flex-row justify-start pt-2">
            <label className="w-32 font-bold text-lg">Loại truyện:</label>
            <input
              className="mr-1"
              type="radio"
              name="editGenre"
              checked={isManga}
              onChange={() => setIsManga(true)}
            />{" "}
            <label className="mr-4">Truyện tranh (Manga)</label>
            <input
              className="mr-1"
              type="radio"
              name="editGenre"
              checked={!isManga}
              onChange={() => setIsManga(false)}
            />{" "}
            <label>Tiểu thuyết (Light novel)</label>
          </div>

          <div className="flex flex-row justify-start pt-2">
            <label className="w-32 font-bold text-lg">Năm xuất bản:</label>
            <input
              className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="number"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
            />
          </div>

          <div className="flex flex-row justify-start pt-2">
            <label className="w-32 font-bold text-lg">Tuổi giới hạn:</label>
            <input
              className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              type="number"
              value={ageLimit}
              onChange={(e) => setAgeLimit(e.target.value)}
            />
          </div>

          <div className="flex flex-row justify-start pt-2">
            <label className="w-32 mr-2 font-bold text-lg">Yêu cầu phí:</label>
            <input
              className="mr-1"
              type="radio"
              name="editIsFree"
              checked={isFree}
              onChange={() => setIsFree(true)}
            />{" "}
            <label className="mr-4">Miễn phí</label>
            <input
              className="mr-1"
              type="radio"
              name="editIsFree"
              checked={!isFree}
              onChange={() => setIsFree(false)}
            />{" "}
            <label>Trả phí</label>
          </div>

          <div className="flex flex-row justify-start pt-2">
            <label className="w-32 font-bold text-lg">Mô tả:</label>
            <textarea
              className="w-10/12 py-1 border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              value={description}
              placeholder="Nhập mô tả..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Genre section  */}
        <div className="flex flex-col mt-2">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h5 className="font-bold pt-1 pr-4 text-lg">Thể loại:</h5>
            </div>
          </div>

          <label>
            <input
              className="mr-1"
              type="checkbox"
              onChange={handleSelectAll}
              checked={selectedGenres.length === genres.length}
            />
            Chọn tất cả
          </label>
          <div className="flex flex-wrap">
            {genres.map((genre) => (
              <div key={genre.genreId} className="m-2">
                <input
                  className="mr-1"
                  type="checkbox"
                  value={genre.genreId}
                  checked={selectedGenres.includes(String(genre.genreId))}
                  onChange={handleSelectChange}
                />
                <label>{genre.genreName}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Author section  */}
        <div className="flex flex-col mt-2">
          <div className="flex justify-between">
            <h5 className="font-bold pt-1 pr-4 text-lg">Tác giả:</h5>
          </div>

          <div className="flex">
            <label className="pt-1 mr-1">Tên tác giả:</label>
            <div>
              <input
                type="text"
                placeholder="Nhập tên tác giả..."
                value={searchAuthorName}
                onChange={(e) => setSearchAuthorName(e.target.value)}
                onFocus={() => setShowResults(true)}
                className="w-64 mr-4 py-1 color-black border-1 border-slate-600 rounded-lg px-3 focus:outline-none focus:border-slate-800 hover:shadow dark:bg-gray-600 dark:text-gray-100"
              />
              {showResults && (
                <div className="absolute w-64 flex flex-col bg-white">
                  {authors.map((author) => (
                    <div
                      key={author.authorId}
                      className="w-64 mr-4 py-1 color-black border-1 hover:bg-slate-300"
                    >
                      <button
                        className="font-bold pl-4"
                        onClick={() => {
                          setSelectedAuthorId(author.authorId);
                          setSearchAuthorName(author.authorName);
                          setShowResults(false);
                        }}
                      >
                        {author.authorName}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Button submit section  */}
        <div className="flex justify-center pb-4">
          <div className="flex flex-row-reverse ml-4">
            <button
              className="p-2 py-1.5 px-3 m-1 text-center bg-lime-600 hover:bg-lime-800 border rounded-md text-white"
              type="submit"
              onClick={handleSubmit}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
