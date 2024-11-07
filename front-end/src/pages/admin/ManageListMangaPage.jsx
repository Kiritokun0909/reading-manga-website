import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HandleCode from "../../utilities/HandleCode";
import MangaList from "../../components/admin/manga/MangaList";
import { getListManga } from "../../api/SiteService";
import { useNavigate } from "react-router-dom";

export default function ManageListMangaPage() {
  const [mangas, setMangas] = useState([]);
  const [filter, setFilter] = useState(
    HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const data = await getListManga(
          currentPage,
          ITEMS_PER_PAGE,
          filter,
          search
        );
        setMangas(data.mangas);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchMangas();
  }, [currentPage, filter, search]);

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  const handleAddManga = () => {
    navigate("/admin/manga/add");
  };

  return (
    <div className="flex flex-col justify-center p-4 pt-0">
      <div className="flex justify-center pb-4">
        <h1>Quản lý danh sách truyện</h1>
      </div>

      <div className="flex flex-row justify-end pb-4">
        <div className="flex">
          <label className="pt-3 mr-1">Nhập tên truyện:</label>
          <input
            type="text"
            placeholder="Tên truyện hoặc tên khác..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 mr-4 py-1 color-black border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
          />
        </div>

        <div className="flex ml-4">
          <label className="pt-1 mr-1">Sắp xếp</label>
          <select
            defaultValue={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value={HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC}>
              Ngày cập nhật giảm dần
            </option>
            <option value={HandleCode.FILTER_BY_MANGA_UPDATE_DATE_ASC}>
              Ngày cập nhật tăng dần
            </option>
            <option value={HandleCode.FILTER_BY_MANGA_CREATE_DATE_DESC}>
              Ngày tạo giảm dần
            </option>
            <option value={HandleCode.FILTER_BY_MANGA_CREATE_DATE_ASC}>
              Ngày tạo tăng dần
            </option>
            <option value={HandleCode.FILTER_BY_MANGA_VIEW_ASC}>
              Lượt xem tăng dần
            </option>
            <option value={HandleCode.FILTER_BY_MANGA_VIEW_DESC}>
              Lượt xem giảm dần
            </option>
            <option value={HandleCode.FILTER_BY_MANGA_LIKE_ASC}>
              Lượt thích tăng dần
            </option>
            <option value={HandleCode.FILTER_BY_MANGA_VIEW_ASC}>
              Lượt thích giảm dần
            </option>
          </select>
        </div>

        <div className="flex flex-row-reverse ml-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddManga}
          >
            Thêm truyện
          </button>
        </div>
      </div>

      <div className="p-2">
        <MangaList
          mangas={mangas}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageClick}
        />
      </div>
    </div>
  );
}
