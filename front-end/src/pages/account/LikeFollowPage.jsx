import { useEffect, useState } from "react";
import { getListFollow, getListLike } from "../../api/AccountService";
import { toast } from "react-toastify";
import MangaList from "../../components/site/MangaList";

export default function LikeFollowPage({ type }) {
  const [mangas, setMangas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchMangas = async () => {
      let data;
      try {
        if (type === "like") {
          data = await getListLike(currentPage, ITEMS_PER_PAGE);
        } else {
          data = await getListFollow(currentPage, ITEMS_PER_PAGE);
        }

        setMangas(data.mangas);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchMangas();
  }, [currentPage, type]);

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  return (
    <div className="">
      <div className="flex justify-center align-center">
        {type === "like" ? (
          <h1 className="text-2xl font-bold">Danh sách yêu thích</h1>
        ) : (
          <h1 className="text-2xl font-bold">Danh sách theo dõi</h1>
        )}
      </div>

      <MangaList
        mangas={mangas}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageClick}
      />
    </div>
  );
}
