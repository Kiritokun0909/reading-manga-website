import { useEffect, useState } from "react";
import { getListGenres } from "../../api/SiteService";
import { addGenre, updateGenre, deleteGenre } from "../../api/AdminService";
import { toast } from "react-toastify";

export default function ManageGenrePage() {
  const [genres, setGenres] = useState([]);
  const [selectedEditGenre, setSelectedEditGenre] = useState("");
  const [selectedDeleteGenres, setSelectedDeleteGenres] = useState([]);
  const [newGenreName, setNewGenreName] = useState("");
  const [updatedGenreName, setUpdatedGenreName] = useState("");

  useEffect(() => {
    getGenres();
  }, []);

  const getGenres = async () => {
    try {
      const data = await getListGenres();
      setGenres(data);
    } catch (error) {
      console.error("Error get list genre:", error);
    }
  };

  const handleEditSelectChange = (genreId, genreName) => {
    setSelectedEditGenre(genreId);
    setUpdatedGenreName(genreName);
  };

  const handleDeleteSelectChange = (e) => {
    const { value, checked } = e.target;
    setSelectedDeleteGenres((prev) =>
      checked ? [...prev, value] : prev.filter((genreId) => genreId !== value)
    );
  };

  const handleSelectAllDelete = (e) => {
    if (e.target.checked) {
      // Select all genres
      const allGenreIds = genres.map((genre) => genre.genreId.toString());
      setSelectedDeleteGenres(allGenreIds);
    } else {
      // Deselect all genres
      setSelectedDeleteGenres([]);
    }
  };

  const capitalizeFirstLetter = (string) => {
    const words = string
      .split(" ")
      .map((word) => word.toLowerCase())
      .join(" ");
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  const handleAddNewGenre = async () => {
    if (newGenreName.trim() === "") {
      toast.error("Không được để trống tên thể loại muốn thêm");
      return;
    }

    const formatName = capitalizeFirstLetter(newGenreName);
    try {
      await addGenre(formatName);
      toast.success("Thêm thể loại mới thành công");
      getGenres();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateGenre = async () => {
    try {
      await updateGenre(selectedEditGenre, updatedGenreName);
      toast.success("Cập nhật thể loại thành công");
      getGenres();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteGenres = async () => {
    try {
      // console.log(selectedDeleteGenres);
      await deleteGenre(selectedDeleteGenres);
      toast.success("Xoá thể loại thành công");
      setSelectedDeleteGenres([]);
      getGenres();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center p-4 pt-0">
      <div className="flex justify-center py-4">
        <h1>Quản lý thể loại</h1>
      </div>

      {/* Add New Genre */}
      <div className="border-b-4 pb-2">
        <h5>Thêm thể loại mới: </h5>
        <label className="mr-2">Tên thể loại mới:</label>
        <input
          className="w-1/4 py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
          type="text"
          placeholder="Nhập tên thể loại..."
          value={newGenreName}
          onChange={(e) => setNewGenreName(e.target.value)}
        />
        <button
          type="button"
          className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
          onClick={handleAddNewGenre}
        >
          Thêm
        </button>
      </div>

      {/* Edit Genre */}
      <div className="border-b-4 pb-2 mt-4">
        <h5>Chỉnh sửa thể loại:</h5>
        <span>
          (Hãy chọn một thể loại trong danh sách thể loại bên dưới để chỉnh sửa)
        </span>
        <div className="flex flex-wrap">
          {genres.map((genre) => (
            <div key={genre.genreId} className="m-2">
              <input
                className="mr-1"
                type="radio"
                name="editGenre"
                checked={selectedEditGenre === genre.genreId}
                onChange={() =>
                  handleEditSelectChange(genre.genreId, genre.genreName)
                }
              />
              <label>{genre.genreName}</label>
            </div>
          ))}
        </div>
        <label className="mr-2">Tên mới cho thể loại:</label>
        <input
          className="w-1/4 py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
          type="text"
          placeholder="Nhập tên mới..."
          value={updatedGenreName}
          onChange={(e) => setUpdatedGenreName(e.target.value)}
        />
        <button
          type="button"
          className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
          onClick={handleUpdateGenre}
        >
          Chỉnh sửa
        </button>
      </div>

      {/* Delete Genres */}
      <div className="flex flex-col mt-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h5>Xoá thể loại:</h5>
            <span className="pb-2">
              (Hãy chọn một hoặc nhiều thể loại trong danh sách thể loại bên
              dưới để xoá)
            </span>
          </div>

          <button
            type="button"
            className="py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
            onClick={handleDeleteGenres}
          >
            Xoá
          </button>
        </div>

        <label>
          <input
            type="checkbox"
            onChange={handleSelectAllDelete}
            checked={selectedDeleteGenres.length === genres.length}
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
                checked={selectedDeleteGenres.includes(String(genre.genreId))}
                onChange={handleDeleteSelectChange}
              />
              <label>{genre.genreName}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
