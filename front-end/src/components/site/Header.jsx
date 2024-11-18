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
          <Link to="/">MLReader</Link>
        </div>
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
      </div>
      <div className="nav-bar">
        <ul>
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
                  <Link
                    to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_VIEW_DESC}`}
                  >
                    Lượt xem
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_LIKE_DESC}`}
                  >
                    Lượt thích
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC}`}
                  >
                    Ngày cập nhật
                  </Link>
                </li>
              </ul>
            )}
          </li>

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
                  {parseInt(roleId) === HandleCode.ROLE_USER && (
                    <>
                      <li>
                        <Link to="/account/notification">Thông báo</Link>
                      </li>
                      <li>
                        <Link to="/account/like-list">Yêu thích</Link>
                      </li>
                      <li>
                        <Link to="/account/follow-list">Theo dõi</Link>
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
