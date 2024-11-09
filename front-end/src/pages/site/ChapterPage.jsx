import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import RichTextDisplay from "../../components/RichTextDisplay";

import "../../styles/site/Chapter.css";

import { getChapterDetail } from "../../api/SiteService";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

export default function ChapterPage() {
  const chapterId = useParams().chapterId;

  const { isLoggedIn } = useContext(AuthContext);

  const [mangaId, setMangaId] = useState(null);
  const [mangaName, setMangaName] = useState("");
  const [isManga, setIsManga] = useState(true);
  const [volumeNumber, setVolumeNumber] = useState(0);
  const [chapterNumber, setChapterNumber] = useState(0);
  const [chapterName, setChapterName] = useState("");
  const [previousChapterId, setPreviousChapterId] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [novelContext, setNovelContext] = useState("");
  const [chapterImages, setChapterImages] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const navigation = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const data = await getChapterDetail(chapterId);
        setMangaId(data.mangaId);
        setMangaName(data.mangaName);
        setIsManga(data.isManga);
        setVolumeNumber(data.volumeNumber);
        setChapterNumber(data.chapterNumber);
        setChapterName(data.chapterName);
        setPreviousChapterId(data.previousChapterId);
        setNextChapterId(data.nextChapterId);
        setNovelContext(data.novelContext);
        setChapterImages(data.chapterImages ? data.chapterImages : null);
      } catch (error) {
        toast.error(error.message);
      }
    };

    // const getComments = async (pageNumber) => {
    //   try {
    //     const data = await fetchChapterComment(id, pageNumber);
    //     setComments(data.comments);
    //     setTotalPages(data.totalPages);
    //   } catch (error) {
    //     console.error("Error get list manga:", error);
    //   }
    // };

    fetchChapter();
    // getComments(currentPage);
  }, [chapterId]);

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Bạn phải đăng nhập để sử dụng chức năng này.");
      return;
    }

    // const response = await commentChapter(id, newComment);
    // console.log(response);
    // window.location.reload();
  };

  return (
    <div className="chapter-layout">
      <div className="chapter-info">
        <h3>
          <Link to={`/manga/${mangaId}`}>{mangaName}</Link> - Volume{" "}
          {volumeNumber} - Chapter {chapterNumber}
        </h3>
      </div>

      <div className="chapter-navigate" style={{ marginTop: `0px` }}>
        {previousChapterId ? (
          <Link to={`/chapter/${previousChapterId}`}>Chương trước</Link>
        ) : (
          <Link to="#" className="nav-disable">
            Chương trước
          </Link>
        )}

        {nextChapterId ? (
          <Link to={`/chapter/${nextChapterId}`}>Chương kế</Link>
        ) : (
          <Link to="#" className="nav-disable">
            Chương kế
          </Link>
        )}
      </div>

      {isManga === 1 ? (
        <div className="chapter-images">
          {chapterImages.map((images) => (
            <div key={images.pageNumber} className="chapter-image">
              <img
                src={images.imageUrl}
                alt="images"
                className="chapter-image"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4">
          <RichTextDisplay richText={novelContext} />
          {/* <p>{novelContext}</p> */}
        </div>
      )}

      <div className="chapter-navigate">
        {previousChapterId ? (
          <Link to={`/chapter/${previousChapterId}`}>Chương trước</Link>
        ) : (
          <Link to="#" className="nav-disable">
            Chương trước
          </Link>
        )}

        {nextChapterId ? (
          <Link to={`/chapter/${nextChapterId}`}>Chương kế</Link>
        ) : (
          <Link to="#" className="nav-disable">
            Chương kế
          </Link>
        )}
      </div>

      <div className="comment-section">
        <h4>Bình luận</h4>
        <div className="manga-comment">
          <div className="comment-form">
            <div className="comment-area">
              <textarea
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
              {comments.map((comment, index) => (
                <li key={`${comment.commentDate}-${index}`}>
                  <div className="comment-header">
                    <span className="username">{comment.username}</span>
                    <span className="comment-date">{comment.commentDate}</span>
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
