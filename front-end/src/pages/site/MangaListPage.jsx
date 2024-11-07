import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/site/Home.css";
import "../../styles/site/Genre.css";
import {
  getListMangaByGenre,
  getListMangaByAuthor,
  getListMangaByKeyword,
} from "../../api/SiteService";
import MangaList from "../../components/site/MangaList";

export default function MangaListPage({ type }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mangas, setMangas] = useState([]);
  const [title, setTitle] = useState("");
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const pageNumber = parseInt(searchParams.get("pageNumber"), 10) || 1;
    const idOrKeyword = searchParams.get(
      type === "search" ? "keyword" : `${type}Id`
    );
    if (!idOrKeyword) return; // Exit if the ID or keyword is missing

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
            setTitle(`Truyện của tác giả ${data.authorName}`);
            break;
          case "search":
            data = await getListMangaByKeyword(
              idOrKeyword,
              pageNumber,
              itemsPerPage
            );
            setTitle(`Kết quả tìm kiếm cho "${idOrKeyword}"`);
            break;
          default:
            throw new Error("Invalid type");
        }
        console.log(data);
        setMangas(data.mangas);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching mangas:", error);
      }
    };

    setCurrentPage(pageNumber);
    fetchMangas(idOrKeyword, pageNumber, ITEMS_PER_PAGE);
  }, [searchParams, type]);

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setSearchParams({
      [type === "search" ? "keyword" : `${type}Id`]: searchParams.get(
        type === "search" ? "keyword" : `${type}Id`
      ),
      pageNumber: page,
    });
  };

  return (
    <MangaList
      mangas={mangas}
      title={title}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageClick}
    />
  );
}
