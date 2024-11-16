import React from "react";
import ReactPaginate from "react-paginate";
import "../../styles/site/Home.css";
import "../../styles/site/Genre.css";
import MangaItem from "./MangaItem";

export default function MangaList({
  mangas,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="home-layout">
      <div className="manga-list p-2">
        {mangas.map((manga) => (
          <MangaItem key={manga.mangaId} manga={manga} />
        ))}
      </div>

      <div className="pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Trang kế"
          previousLabel="Trang trước"
          onPageChange={onPageChange}
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
  );
}
