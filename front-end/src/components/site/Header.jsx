import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/site/Header.css";
import { getListGenres } from "../../api/SiteService";
import { AuthContext } from "../../context/AuthContext";
import HandleCode from "../../utilities/HandleCode";
import { toast } from "react-toastify";

const useDropdownVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const subMenuRef = useRef(null);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const handleOutsideClick = (event) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target) &&
      subMenuRef.current &&
      !subMenuRef.current.contains(event.target)
    ) {
      hide();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return { isVisible, show, hide, buttonRef, subMenuRef };
};

export default function Header() {
  const [genres, setGenres] = useState([]);
  const { isLoggedIn, roleId, logout } = useContext(AuthContext);
  const [searchContext, setSearchContext] = useState("");

  const genresDropdown = useDropdownVisibility();
  const rankingDropdown = useDropdownVisibility();

  const accountDropdown = useDropdownVisibility();

  const navigate = useNavigate();

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

  const handleFindClick = () => {
    navigate(`/search?keyword=${searchContext}&pageNumber=1`);
  };

  const handleLogoutClick = () => {
    logout();
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  return (
    <header>
      <div className="top-header">
        <div className="logo">
          {roleId !== HandleCode.ROLE_ADMIN && <Link to="/">MLReader</Link>}
          {roleId === HandleCode.ROLE_ADMIN && (
            <Link to="/admin/dashboard">AdminDashboard</Link>
          )}
        </div>
        {roleId !== HandleCode.ROLE_ADMIN && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm truyện..."
              value={searchContext}
              onChange={(e) => setSearchContext(e.target.value)}
            />
            <div className="auth-buttons">
              <button onClick={handleFindClick}>Tìm</button>
            </div>
          </div>
        )}
      </div>
      <div className="nav-bar">
        <ul>
          {/* User Header */}
          {roleId !== HandleCode.ROLE_ADMIN && (
            <>
              <li
                onMouseEnter={genresDropdown.show}
                onMouseLeave={genresDropdown.hide}
                ref={genresDropdown.buttonRef}
              >
                <Link to="#">Thể loại</Link>
                {genresDropdown.isVisible && (
                  <ul className="sub-menu" ref={genresDropdown.subMenuRef}>
                    {genres?.map((genre) => (
                      <li key={genre.genreId}>
                        <Link
                          to={`/genre?genreId=${genre.genreId}&pageNumber=1`}
                          className="genre-link"
                        >
                          {genre.genreName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li
                onMouseEnter={rankingDropdown.show}
                onMouseLeave={rankingDropdown.hide}
                ref={rankingDropdown.buttonRef}
              >
                <Link to="#">Xếp hạng</Link>
                {rankingDropdown.isVisible && (
                  <ul className="sub-menu" ref={rankingDropdown.subMenuRef}>
                    <li>
                      <Link to="/top-view">Lượt xem</Link>
                    </li>
                    <li>
                      <Link to="/top-like">Lượt thích</Link>
                    </li>
                    <li>
                      <Link to="/recent-update">Ngày cập nhật</Link>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}

          {/* Admin Header */}
          {roleId === HandleCode.ROLE_ADMIN && (
            <>
              <li>
                <Link to="/admin/manage-genre">Thể loại</Link>
              </li>
              <li>
                <Link to="/admin/manage-author">Tác giả</Link>
              </li>
              <li>
                <Link to="/admin/manage-manga">Truyện</Link>
              </li>
              <li>
                <Link to="/admin/manage-subcripstion">Gói đăng ký</Link>
              </li>
              <li>
                <Link to="/admin/manage-feedback">Phản hồi</Link>
              </li>
              <li>
                <Link to="/admin/manage-document">Tài liệu</Link>
              </li>
            </>
          )}

          {/* Account Manager  */}
          {isLoggedIn ? (
            <li
              onMouseEnter={accountDropdown.show}
              onMouseLeave={accountDropdown.hide}
              ref={accountDropdown.buttonRef}
            >
              <Link to="#">Tài khoản</Link>
              {accountDropdown.isVisible && (
                <ul
                  className="account-sub-menu"
                  ref={accountDropdown.subMenuRef}
                >
                  {/* User Manager  */}
                  {roleId === HandleCode.ROLE_USER && (
                    <>
                      <li>
                        <Link to="#">Thông báo</Link>
                      </li>
                      <li>
                        <Link to="/like-list">Yêu thích</Link>
                      </li>
                      <li>
                        <Link to="/follow-list">Theo dõi</Link>
                      </li>
                    </>
                  )}

                  {/* Admin Manager  */}
                  {roleId === HandleCode.ROLE_ADMIN && (
                    <>
                      <li>
                        <Link to="/admin/manage-user">
                          Quản lý các tài khoản trong hệ thống
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link to="/account/profile">Thông tin</Link>
                  </li>

                  <li>
                    <Link to="/account/password">Mật khẩu</Link>
                  </li>

                  <li onClick={handleLogoutClick}>
                    <Link to="#">Đăng xuất</Link>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login">Đăng nhập</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
