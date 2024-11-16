import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import HandleCode from "../../utilities/HandleCode";

import {
  getListUser,
  registerAdmin,
  setUserStatus,
} from "../../api/AdminService";
import UserList from "../../components/admin/user/UserList";
import UserModal from "../../components/admin/user/UserModal";

export default function ManageUserPage() {
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState(HandleCode.ROLE_USER);
  const [searchStatus, setSearchStatus] = useState(HandleCode.ACTIVE_STATUS);

  const [showModal, setShowModal] = useState(false);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getListUser(
          currentPage,
          ITEMS_PER_PAGE,
          searchStatus,
          searchRole,
          searchEmail
        );
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchUsers();
  }, [searchEmail, searchRole, searchStatus, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const fetchUsers = async () => {
    try {
      const data = await getListUser(
        currentPage,
        ITEMS_PER_PAGE,
        searchStatus,
        searchRole,
        searchEmail
      );
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onBlockClick = async (userId, status) => {
    try {
      await setUserStatus(userId, status);
      if (status === HandleCode.BAN_STATUS) {
        toast.success("Khoá tài khoản thành công!");
      } else {
        toast.success("Mở khoá tài khoản thành công!");
      }
      setCurrentPage(1);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddAdmin = () => {
    setShowModal(true);
  };

  const handleSaveNewAdmin = async (newAdmin) => {
    try {
      await registerAdmin(newAdmin.email, newAdmin.password);
      toast.success("Tạo quản lý mới thành công!");
      setShowModal(false);
      setCurrentPage(1);
      setSearchRole(HandleCode.ROLE_ADMIN);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col p-4 pt-0 w-full">
      <div className="flex justify-center py-4">
        <h1>Quản lý các tài khoản trong hệ thống</h1>
      </div>

      <div className="flex flex-row justify-end pb-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddAdmin}
        >
          Tạo quản lý mới
        </button>
      </div>

      <div className="flex flex-row justify-end pb-4">
        <div className="flex">
          <label className="pt-2 mr-1">Email/username:</label>
          <input
            type="text"
            placeholder="Email hoặc username..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-80 mr-4 py-1 color-black border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
          />
        </div>

        <div className="flex ml-4">
          <label className="w-32 pt-2">Trạng thái:</label>
          <select
            defaultValue={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="form-select"
          >
            <option value={HandleCode.ACTIVE_STATUS}>Đang hoạt động</option>
            <option value={HandleCode.BAN_STATUS}>Đang khoá</option>
          </select>
        </div>

        <div className="flex ml-4">
          <label className="w-24 pt-2">Quyền:</label>
          <select
            defaultValue={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            className="form-select"
          >
            <option value={HandleCode.ROLE_USER}>Người dùng</option>
            <option value={HandleCode.ROLE_ADMIN}>Quản lý</option>
          </select>
        </div>
      </div>

      <UserList
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onBlockClick={onBlockClick}
      />

      {showModal && (
        <UserModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveNewAdmin}
        />
      )}
    </div>
  );
}
