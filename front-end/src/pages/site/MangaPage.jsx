import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { AuthContext } from "../../context/AuthContext";

import "../../styles/site/Manga.css";

import {
  getDetailManga,
  getListChapter,
  getListReview,
} from "../../api/SiteService";
import { deleteManga, setReviewStatus } from "../../api/AdminService";
import HandleCode from "../../utilities/HandleCode";
import {
  checkIsLike,
  checkIsFollow,
  likeManga,
  followManga,
  addReview,
} from "../../api/AccountService";
import { hideManga } from "../../api/MangaService";
import PlanList from "../../components/site/plan/PlanList";

export default function MangaPage() {
  const mangaId = useParams().mangaId;
  const { isLoggedIn, roleId } = useContext(AuthContext);

  const [manga, setManga] = useState({});
  const [isHide, setIsHide] = useState(false);
  const [mangaGenres, setMangaGenres] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [isFollow, setIsFollow] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const [newReview, setNewReview] = useState("");
  const [reviews, setReviews] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100; // Maximum characters to show when collapsed

  const navigate = useNavigate();

  //Fetch manga info
  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await getDetailManga(mangaId);
        const data = response.mangaInfo;
        setManga(data);
        setIsHide(data.isHide);
        setMangaGenres(data.genres);

        if (parseInt(roleId) !== HandleCode.ROLE_ADMIN && data.isHide) {
          // toast.error("Truyện đang bị ẩn");
          navigate(`/`);
        }
      } catch (error) {
        toast.error(error.message);
        navigate(`/`);
      }
    };

    const fetchChapter = async () => {
      try {
        const response = await getListChapter(mangaId);
        setChapters(response.chapters);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchManga();
    fetchChapter();
  }, [mangaId, currentPage, roleId, navigate]);

  //Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getListReview(
          mangaId,
          REVIEWS_PER_PAGE,
          currentPage
        );
        setReviews(response.reviews);
        setTotalPages(response.totalPages);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchReviews();
  }, [currentPage, mangaId]);

  const fetchReviews = async () => {
    try {
      const response = await getListReview(
        mangaId,
        REVIEWS_PER_PAGE,
        currentPage
      );
      setReviews(response.reviews);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchLike = async () => {
      try {
        await checkIsLike(mangaId);
        setIsLike(true);
      } catch (error) {
        setIsLike(false);
        toast.error(error.message);
      }
    };
    if (!isLoggedIn) return;
    fetchLike();
  }, [isLike, isLoggedIn, mangaId]);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        await checkIsFollow(mangaId);
        setIsFollow(true);
      } catch (error) {
        setIsFollow(false);
        toast.error(error.message);
      }
    };
    if (!isLoggedIn) return;
    fetchFollow();
  }, [isFollow, isLoggedIn, mangaId]);

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      toast.error("Vui làng đăng nhập để sử dụng chức năng này!");
      return;
    }
    try {
      await likeManga(mangaId, !isLike);
      setIsLike(!isLike);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFollowClick = async () => {
    if (!isLoggedIn) {
      toast.error("Vui làng đăng nhập để sử dụng chức năng này!");
      return;
    }
    try {
      await followManga(mangaId, !isFollow);
      setIsFollow(!isFollow);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  const handleSubmitReview = async (event) => {
    if (!isLoggedIn) {
      toast.error("Vui làng đăng nhập để sử dụng chức năng này!");
      return;
    }

    if (newReview === "") {
      toast.error("Vui làng nhập đánh giá trước khi gửi!");
      return;
    }

    try {
      await addReview(mangaId, newReview);
      toast.success("Gửi đánh giá thành công.");
      setNewReview("");
      fetchReviews();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleHideReview = async (reviewId, status) => {
    try {
      await setReviewStatus(
        reviewId,
        status === HandleCode.REVIEW_IS_HIDE
          ? HandleCode.REVIEW_NOT_HIDE
          : HandleCode.REVIEW_IS_HIDE
      );
      toast.success("Ẩn/Hiện bình luận thành công!");
      fetchReviews();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteManga(mangaId);
      toast.success("Xoá thành công truyện");
      navigate("/admin/manage-manga");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleHideClick = async () => {
    try {
      await hideManga(mangaId, !isHide);
      if (!isHide) {
        toast.success("Ẩn truyện thành công");
      } else {
        toast.success("Huỷ ẩn truyện thành công");
      }
      setIsHide(!isHide);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Manga information  */}
      <div className="manga-info">
        {/* Cover image */}
        <div className="manga-cover mr-6 pt-8">
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
          {/* Information  */}
          <div>
            <div className="flex justify-center mt-2">
              <h3>{manga.mangaName}</h3>
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Tên khác:</label>
              {!manga.otherName ? "" : manga.otherName}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Tác giả:</label>
              {!manga.authorName ? (
                "Đang cập nhật"
              ) : (
                <Link to={`/author?authorId=${manga.authorId}&pageNumber=1`}>
                  {manga.authorName}
                </Link>
              )}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Loại truyện:</label>
              {manga.isManga === 0
                ? "Tiểu thuyết (Novel)"
                : "Truyện tranh (Manga)"}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Năm phát hành:</label>
              {!manga.publishedYear ? "Đang cập nhật" : manga.publishedYear}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Độ tuổi:</label>
              {!manga.ageLimit ? "Không giới hạn" : manga.ageLimit}+
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Số chương:</label>
              {manga.numChapters}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Lượt xem:</label>
              {manga.numViews}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Lượt thích:</label>
              {manga.numLikes}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Lượt theo dõi:</label>
              {manga.numFollows}
            </div>
            <div className="pl-2">
              <label className="font-bold text-base mr-2">Cập nhật lúc:</label>
              <i>{!manga.updateAt ? "" : manga.updateAt}</i>
            </div>
          </div>

          {/* User button like, follow */}
          {parseInt(roleId) !== HandleCode.ROLE_ADMIN && (
            <div className="flex flex-row justify-center mt-2">
              <button
                className="bg-red-500 rounded-lg px-3 py-1.5 mr-1.5 text-white font-semibold hover:bg-red-600"
                onClick={handleLikeClick}
              >
                {isLike ? "Huỷ yêu thích" : "Yêu thích"}
              </button>
              <button
                className="bg-purple-500 rounded-lg px-3 py-1.5 text-white font-semibold hover:bg-purple-600"
                onClick={handleFollowClick}
              >
                {isFollow ? "Huỷ theo dõi" : "Theo dõi"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin button */}
      <div className="admin">
        {parseInt(roleId) === HandleCode.ROLE_ADMIN && (
          <div className="flex flex-row mt-1.5">
            <Link to={`/admin/chapter/upload/${mangaId}`}>Đăng chương mới</Link>
            <Link to={`/admin/update-manga/${mangaId}`}>
              Cập nhật thông tin truyện
            </Link>
            <button
              className="bg-red-500 rounded-lg my-1 px-2 text-white font-semibold hover:bg-red-600"
              onClick={handleDeleteClick}
            >
              Xoá truyện
            </button>

            <button
              className="bg-purple-500 rounded-lg mx-2 my-1 px-2 text-white font-semibold hover:bg-purple-600"
              onClick={() => handleHideClick()}
            >
              {isHide ? "Huỷ ẩn truyện" : "Ẩn truyện"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-2">
        <label className="font-bold text-base mr-2">Yêu cầu trả phí:</label>
        {manga.isFree === 0 ? <span>Có.</span> : <span>Không.</span>}
      </div>

      {/* Manga genres */}
      <div className="manga-genres mt-2">
        <div className="genre-list">
          <label className="font-bold text-base mt-1.5">Thể loại:</label>
          {mangaGenres.map((genre) => (
            <Link
              key={genre.genreId}
              to={
                parseInt(roleId) === HandleCode.ROLE_ADMIN
                  ? "#"
                  : `/genre?genreId=${genre.genreId}&pageNumber=1`
              }
            >
              {genre.genreName}
            </Link>
          ))}
        </div>
      </div>

      {/* Manga description */}
      <div className="manga-description">
        <div className="">
          <strong className="font-bold text-base mr-1">Mô tả:</strong>
          {!manga.description ? (
            "Đang cập nhật"
          ) : (
            <span>
              {isExpanded
                ? manga.description
                : `${manga.description.slice(0, maxLength)}...`}
              {manga.description.length > maxLength && (
                <button onClick={toggleExpand} className="text-blue-500 ml-2">
                  {isExpanded ? "Ẩn bớt" : "Mở rộng"}
                </button>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Chapter list */}
      <div className="list-chapter">
        <h4>Danh sách chương</h4>
        <div className="manga-chapter border-1 border-gray-300 rounded-md">
          {chapters &&
            chapters.map((chapter) => (
              <div key={chapter.chapterId} className="chapter-row">
                <div className="chapter-name overflow-hidden text-clip w-2/4">
                  {parseInt(roleId) === HandleCode.ROLE_ADMIN ? (
                    <Link to={`/admin/chapter/${chapter.chapterId}`}>
                      Vol {chapter.volumeNumber} - Chapter{" "}
                      {chapter.chapterNumber}
                    </Link>
                  ) : (
                    <Link to={`/chapter/${chapter.chapterId}`}>
                      Vol {chapter.volumeNumber} - Chapter{" "}
                      {chapter.chapterNumber}
                    </Link>
                  )}
                </div>
                <div className="flex">
                  <i>{chapter.updateAt}</i>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Plans list  */}
      <div className="mt-2">
        {manga.isFree === HandleCode.MANGA_NOT_FREE &&
          parseInt(roleId) !== HandleCode.ROLE_ADMIN && (
            <div>
              <h4>Danh sách các gói đăng ký</h4>
              <PlanList mangaId={mangaId} />
            </div>
          )}
      </div>

      {/* Review list */}
      <div className="comment-section">
        <h4>Đánh giá</h4>
        <div className="manga-comment">
          <div className="comment-form">
            <div className="comment-area">
              <textarea
                className="border-1 border-gray-300 rounded-md p-2"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Nhập đánh giá của bạn..."
              />
            </div>

            <div className="comment-button">
              <button onClick={handleSubmitReview}>Gửi đánh giá</button>
            </div>
          </div>

          <div className="list-comment">
            <ul>
              {reviews &&
                reviews.map((review) => (
                  <li key={review.reviewId}>
                    <div className="comment-header">
                      <span className="username">
                        {review.username}{" "}
                        {parseInt(roleId) === HandleCode.ROLE_ADMIN &&
                          `<${review.email}>`}
                      </span>
                      <span className="comment-date">{review.createAt}</span>
                      {parseInt(roleId) === HandleCode.ROLE_ADMIN && (
                        <button
                          className="underline text-blue-500 ml-2"
                          onClick={() =>
                            handleHideReview(review.reviewId, review.isHide)
                          }
                        >
                          {review.isHide === 1 ? "Hiện" : "Ẩn"}
                        </button>
                      )}
                    </div>
                    <p className="comment-content">
                      {review.context === ""
                        ? "Bình luận này đã bị ẩn"
                        : review.context}
                    </p>
                  </li>
                ))}
            </ul>
          </div>

          <div className="pagination">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Trang kế"
              previousLabel="Trang trước"
              onPageChange={handlePageClick}
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
      </div>
    </div>
  );
}
