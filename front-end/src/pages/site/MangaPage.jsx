import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { AuthContext } from "../../context/AuthContext";

import "../../styles/site/Manga.css";

import { getDetailManga, getListChapter } from "../../api/SiteService";
import { deleteManga } from "../../api/AdminService";
import HandleCode from "../../utilities/HandleCode";
import {
  checkIsLike,
  checkIsFollow,
  likeManga,
  followManga,
} from "../../api/AccountService";

export default function MangaPage() {
  const mangaId = useParams().mangaId;
  const { isLoggedIn, roleId } = useContext(AuthContext);

  const [manga, setManga] = useState({});
  const [mangaGenres, setMangaGenres] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [isFollow, setIsFollow] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100; // Maximum characters to show when collapsed

  const navigate = useNavigate();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await getDetailManga(mangaId);
        const data = response.mangaInfo;
        setManga(data);
        setMangaGenres(data.genres);

        const responseChapter = await getListChapter(mangaId);
        setChapters(responseChapter.chapters);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchManga();
  }, [mangaId]);

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

  const handleDeleteClick = async () => {
    try {
      await deleteManga(mangaId);
      toast.success("Xoá thành công truyện");
      navigate("/admin/manage-manga");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    console.log(newComment);
  };

  return (
    <div className="flex flex-col">
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
          </div>
        )}
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
                  <div className="mr-4">
                    {chapter.isFree === 1 ? "Miễn phí" : "Trả phí"}
                  </div>
                  <i>{chapter.updateAt}</i>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Review list */}
      <div className="comment-section">
        <h4>Bình luận</h4>
        <div className="manga-comment">
          <div className="comment-form">
            <div className="comment-area">
              <textarea
                className="border-1 border-gray-300 rounded-md p-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Bình luận..."
              />
            </div>

            <div className="comment-button">
              <button onClick={handleSubmitComment}>Bình luận</button>
            </div>
          </div>

          <div className="list-comment">
            <ul>
              {comments &&
                comments.map((comment, index) => (
                  <li key={`${comment.commentDate}-${index}`}>
                    <div className="comment-header">
                      <span className="username">{comment.username}</span>
                      <span className="comment-date">
                        {comment.commentDate}
                      </span>
                    </div>
                    <p className="comment-content">{comment.context}</p>
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
