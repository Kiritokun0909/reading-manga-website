import { useEffect, useState } from "react";

import "../../styles/site/Home.css";
import "../../styles/site/Genre.css";
import AuthorList from "../../components/admin/author/AuthorList";
import AuthorModal from "../../components/admin/author/AuthorModal";
import {
  getListAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../api/AdminService";
import { toast } from "react-toastify";
import HandleCode from "../../utilities/HandleCode";
import ConfirmationBox from "../../components/ConfirmationBox";

export default function ManageAuthorPage() {
  const [authors, setAuthors] = useState([]);
  const [filterParam, setFilterParam] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [authorIdToDelete, setAuthorIdToDelete] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await getListAuthor(
          currentPage,
          ITEMS_PER_PAGE,
          filterParam,
          searchParam
        );
        setAuthors(data.authors);
        setTotalPages(data.totalPages);
      } catch (error) {
        // console.error("Error fetching authors:", error);
        toast.error(error.message);
      }
    };

    fetchAuthors();
  }, [currentPage, filterParam, searchParam]);

  const fetchAuthors = async () => {
    try {
      const data = await getListAuthor(
        currentPage,
        ITEMS_PER_PAGE,
        filterParam,
        searchParam
      );
      setAuthors(data.authors);
      setTotalPages(data.totalPages);
    } catch (error) {
      // console.error("Error fetching authors:", error);
      toast.error(error.message);
    }
  };

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  const handleAddAuthor = () => {
    setSelectedAuthor(null);
    setShowModal(true);
    setIsUpdated(false);
  };

  const handleEditAuthor = (author) => {
    setSelectedAuthor(author);
    setShowModal(true);
    setIsUpdated(true);
  };

  const handleSaveAuthor = async (updatedAuthor) => {
    try {
      if (isUpdated) {
        await updateAuthor(
          updatedAuthor.authorId,
          updatedAuthor.avatarFile,
          updatedAuthor.authorName,
          updatedAuthor.biography
        );
        toast.success("Cập nhật tác giả thành công.");
      } else {
        await addAuthor(
          updatedAuthor.avatarFile,
          updatedAuthor.authorName,
          updatedAuthor.biography
        );
        toast.success("Thêm tác giả mới thành công.");
      }
    } catch (error) {
      toast.error(error);
    }

    setShowModal(false);
    fetchAuthors();
  };

  const handleDeleteAuthor = async (authorId) => {
    setAuthorIdToDelete(authorId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAuthor(authorIdToDelete);
      toast.success("Xoá tác giả thành công");
      fetchAuthors();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra! Vui lòng thử lại sau ít phút.");
    } finally {
      setShowConfirm(false);
    }
  };

  const closeConfirmationBox = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col p-4 pt-0">
      <div className="flex justify-center py-4">
        <h1>Danh sách tác giả</h1>
      </div>

      <div className="flex flex-row justify-end pb-4">
        <div className="flex">
          <label className="pt-2 mr-1">Nhập tên tác giả:</label>
          <input
            type="text"
            placeholder="Nhập tên tác giả..."
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            className="w-96 mr-4 py-1 color-black border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
          />
        </div>

        <div className="flex ml-4">
          <label className="w-24 pt-2 mr-1">Sắp xếp:</label>
          <select
            defaultValue={filterParam}
            onChange={(e) => setFilterParam(e.target.value)}
            className="form-select"
          >
            <option value={HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_DESC}>
              Ngày cập nhật giảm dần
            </option>
            <option value={HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_ASC}>
              Ngày cập nhật tăng dần
            </option>
            <option value={HandleCode.FILTER_BY_AUTHOR_NAME_ASC}>
              Tên tác giả tăng dần
            </option>
            <option value={HandleCode.FILTER_BY_AUTHOR_NAME_DESC}>
              Tên tác giả giảm dần
            </option>
          </select>
        </div>

        <div className="flex flex-row-reverse ml-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddAuthor}
          >
            Thêm tác giả
          </button>
        </div>
      </div>

      <div className="p-2">
        <AuthorList
          authors={authors}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageClick}
          onAuthorClick={handleEditAuthor}
          onDeleteAuthor={handleDeleteAuthor}
        />
      </div>

      {showModal && (
        <AuthorModal
          author={selectedAuthor}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAuthor}
        />
      )}

      {showConfirm && (
        <ConfirmationBox
          title="Xác nhận"
          message="Bạn có chắc muốn xoá tác giả này?"
          onConfirm={confirmDelete}
          onClose={closeConfirmationBox}
        />
      )}
    </div>
  );
}
