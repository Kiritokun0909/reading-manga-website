import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import RichTextDisplay from "../../components/RichTextDisplay";

import "../../styles/site/Chapter.css";

import { getChapterDetail } from "../../api/SiteService";
import { toast } from "react-toastify";

export default function ChapterPage() {
  const chapterId = useParams().chapterId;

  const [mangaId, setMangaId] = useState(null);
  const [mangaName, setMangaName] = useState("");
  const [isManga, setIsManga] = useState(true);
  const [volumeNumber, setVolumeNumber] = useState(0);
  const [chapterNumber, setChapterNumber] = useState(0);
  // const [chapterName, setChapterName] = useState("");
  const [previousChapterId, setPreviousChapterId] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [novelContext, setNovelContext] = useState("");
  const [chapterImages, setChapterImages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const data = await getChapterDetail(chapterId);
        setMangaId(data.mangaId);
        setMangaName(data.mangaName);
        setIsManga(data.isManga);
        setVolumeNumber(data.volumeNumber);
        setChapterNumber(data.chapterNumber);
        // setChapterName(data.chapterName);
        setPreviousChapterId(data.previousChapterId);
        setNextChapterId(data.nextChapterId);
        setNovelContext(data.novelContext);
        setChapterImages(data.chapterImages ? data.chapterImages : null);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        navigate(`/manga/${error.mangaId}`);
      }
    };

    fetchChapter();
    // getComments(currentPage);
  }, [chapterId, navigate]);

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
    </div>
  );
}
