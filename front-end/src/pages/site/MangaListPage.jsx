import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";

import "../../styles/site/Home.css";
import "../../styles/site/Genre.css";
import {
  getListMangaByGenre,
  getListMangaByAuthor,
  getListMangaByKeyword,
} from "../../api/SiteService";
import MangaList from "../../components/site/MangaList";
import HandleCode from "../../utilities/HandleCode";

export default function MangaListPage({ type }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mangas, setMangas] = useState([]);
  const [filter, setFilter] = useState(
    parseInt(searchParams.get("filter")) ||
      HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC
  );
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState({});
  const maxLength = 7; // Maximum characters to show when collapsed
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const pageNumber = parseInt(searchParams.get("pageNumber"), 10) || 1;
    const idOrKeyword = searchParams.get(
      type === "search" ? "keyword" : `${type}Id`
    );

    const currFilter =
      parseInt(searchParams.get("filter")) ||
      HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC;
    setFilter(currFilter);

    // toast.info(type);
    if (type !== "search" && !idOrKeyword) return; // Exit if the ID or keyword is missing

    const fetchMangas = async (idOrKeyword, pageNumber, itemsPerPage) => {
      try {
        let data;

        switch (type) {
          case "genre":
            data = await getListMangaByGenre(
              idOrKeyword,
              pageNumber,
              itemsPerPage
            );
            setTitle(`Thể loại: ${data.genreName}`);
            break;
          case "author":
            data = await getListMangaByAuthor(
              idOrKeyword,
              pageNumber,
              itemsPerPage
            );
            console.log(data);
            setAuthor(data);
            setTitle(`Danh sách truyện`);
            break;
          case "search":
            data = await getListMangaByKeyword(
              idOrKeyword,
              filter,
              pageNumber,
              itemsPerPage
            );
            setTitle(
              `Kết quả tìm kiếm cho "${idOrKeyword.slice(0, maxLength)}..."`
            );
            break;
          default:
            throw new Error("Invalid type");
        }

        setMangas(data.mangas);
        setTotalPages(data.totalPages);
      } catch (error) {
        // toast.error(error.message);
      }
    };

    setCurrentPage(pageNumber);
    fetchMangas(idOrKeyword, pageNumber, ITEMS_PER_PAGE);
  }, [searchParams, type, filter]);

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setSearchParams({
      [type === "search" ? "keyword" : `${type}Id`]: searchParams.get(
        type === "search" ? "keyword" : `${type}Id`
      ),
      pageNumber: page,
      [type === "search" ? "filter" : ""]: filter,
    });
  };

  const handleFilterChange = (event) => {
    const selectedFilter = parseInt(event.target.value, 10);
    setSearchParams({
      [type === "search" ? "keyword" : `${type}Id`]: searchParams.get(
        type === "search" ? "keyword" : `${type}Id`
      ),
      pageNumber: 1,
      filter: selectedFilter,
    });
  };

  return (
    <div>
      {type === "author" && (
        <div className="flex justify-center p-4">
          <div>
            {author.avatar && (
              <img
                className="w-40 h-40"
                src={author.avatar}
                alt={author.authorName}
              />
            )}
          </div>
          <div className="ml-4">
            <h2>{author.authorName}</h2>
            <p>{author.biography}</p>
          </div>
        </div>
      )}
      <div className="flex"></div>
      <div className="flex justify-between">
        <h5 className="pt-2">{title}</h5>
        {type === "search" && (
          <div className="flex ml-4">
            <label className="w-24 pt-2">Sắp xếp:</label>
            <select
              defaultValue={filter}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value={HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC}>
                Ngày cập nhật giảm dần
              </option>
              <option value={HandleCode.FILTER_BY_MANGA_UPDATE_DATE_ASC}>
                Ngày cập nhật tăng dần
              </option>
              <option value={HandleCode.FILTER_BY_MANGA_CREATE_DATE_DESC}>
                Ngày tạo giảm dần
              </option>
              <option value={HandleCode.FILTER_BY_MANGA_CREATE_DATE_ASC}>
                Ngày tạo tăng dần
              </option>
              <option value={HandleCode.FILTER_BY_MANGA_VIEW_ASC}>
                Lượt xem tăng dần
              </option>
              <option value={HandleCode.FILTER_BY_MANGA_VIEW_DESC}>
                Lượt xem giảm dần
              </option>
              <option value={HandleCode.FILTER_BY_MANGA_LIKE_ASC}>
                Lượt thích tăng dần
              </option>
              <option value={HandleCode.FILTER_BY_MANGA_LIKE_DESC}>
                Lượt thích giảm dần
              </option>
            </select>
          </div>
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
