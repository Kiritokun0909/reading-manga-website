import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getNotifications, readNotification } from "../../api/AccountService";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications(currentPage, ITEMS_PER_PAGE);
        setNotifications(response.notifications);
        setTotalPages(response.totalPages);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchNotifications();
  }, [currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handleClickNotification = async (notificationId) => {
    try {
      await readNotification(notificationId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center p-2">
        <h1>Thông báo</h1>
      </div>

      {notifications.map((notice) => (
        <Link
          to={`/manga/${notice.mangaId}`}
          key={notice.notificationId}
          className="no-underline"
          onClick={(e) => {
            e.preventDefault(); // Prevent immediate navigation
            handleClickNotification(notice.notificationId).then(() => {
              // Navigate after marking notification as read
              navigate(`/manga/${notice.mangaId}`);
            });
          }}
        >
          <div
            className={`flex flex-row p-2 border-b ${
              notice.isRead === 1 ? "text-black" : ""
            }`}
          >
            <div>
              <img src={notice.coverImageUrl} alt="" className="w-32" />
            </div>
            <div className="flex justify-between w-full p-2">
              <div>{notice.mangaName} vừa đăng chương mới</div>
              <div>{notice.createAt}</div>
            </div>
          </div>
        </Link>
      ))}

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
  );
}
