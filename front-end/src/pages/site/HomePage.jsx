import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getListManga } from "../../api/SiteService";
import "../../styles/site/Home.css";
import "../../styles/site/Genre.css";

import HandleCode from "../../utilities/HandleCode";
import MangaItem from "../../components/site/MangaItem";

export default function HomePage() {
  const [mostViewed, setMostViewed] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  // const navigate = useNavigate();

  const PAGE_NUMBER = 1;
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    getMostViewed();
    getRecentUploads();
  }, []);

  const getMostViewed = async () => {
    const data = await getListManga(
      PAGE_NUMBER,
      ITEMS_PER_PAGE,
      HandleCode.FILTER_BY_MANGA_VIEW_DESC
    );
    // console.log(data);
    setMostViewed(data.mangas);
  };
  const getRecentUploads = async () => {
    const data = await getListManga(
      PAGE_NUMBER,
      ITEMS_PER_PAGE * 2,
      HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC
    );
    setRecentUploads(data.mangas);
  };

  return (
    <div>
      <div className="p-2">
        <div className="flex justify-between">
          <h4>Truyện được xem nhiều</h4>
          <Link
            to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_VIEW_DESC}`}
          >
            Xem thêm
          </Link>
        </div>
        <div className="manga-list">
          {mostViewed.map((manga) => (
            <MangaItem key={manga.mangaId} manga={manga} />
          ))}
        </div>
      </div>

      <br></br>
      <div className="p-2">
        <div className="flex justify-between">
          <h4>Truyện mới cập nhật</h4>
          <Link
            to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC}`}
          >
            Xem thêm
          </Link>
        </div>
        <div className="manga-list">
          {recentUploads.map((manga) => (
            <MangaItem key={manga.mangaId} manga={manga} />
          ))}
        </div>
      </div>
    </div>
  );
}
