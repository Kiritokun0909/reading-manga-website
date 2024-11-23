import ReactPaginate from "react-paginate";
import HandleCode from "../../../utilities/HandleCode";

export default function UserList({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onBlockClick,
}) {
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Avatar
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3">
                Ngày cập nhật
              </th>
              <th scope="col" className="px-6 py-3">
                Quyền
              </th>
              <th scope="col" className="px-6 py-3">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.userId}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-200 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.username}
                </th>
                <td className="px-6 py-4">
                  <img
                    src={
                      user.avatar
                        ? user.avatar
                        : "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.status === HandleCode.ACTIVE_STATUS
                    ? "Đang hoạt động"
                    : "Đang khoá"}
                </td>
                <td className="px-6 py-4">{user.updateAt}</td>
                <td className="px-6 py-4">
                  {user.roleId === HandleCode.ROLE_ADMIN
                    ? "Quản lý"
                    : "Người dùng"}
                </td>
                <td className="px-6 py-4">
                  {user.status === HandleCode.ACTIVE_STATUS ? (
                    <button
                      className="p-2 rounded-md text-white bg-red-500 hover:bg-red-600"
                      onClick={() =>
                        onBlockClick(user.userId, HandleCode.BAN_STATUS)
                      }
                    >
                      Khoá
                    </button>
                  ) : (
                    <button
                      className="p-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                      onClick={() =>
                        onBlockClick(user.userId, HandleCode.ACTIVE_STATUS)
                      }
                    >
                      Mở khoá
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Trang kế"
          previousLabel="Trang trước"
          onPageChange={onPageChange}
          pageCount={totalPages}
          forcePage={currentPage - 1}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
}
