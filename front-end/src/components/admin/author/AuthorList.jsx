import React from "react";
import ReactPaginate from "react-paginate";
import "../../../styles/site/Home.css";
import "../../../styles/site/Genre.css";
import AuthorItem from "./AuthorItem";

export default function AuthorList({
  authors,
  currentPage,
  totalPages,
  onPageChange,
  onAuthorClick,
  onDeleteAuthor,
}) {
  return (
    <div className="home-layout">
      <div className="manga-list">
        {authors.map((author) => (
          <AuthorItem
            key={author.authorId}
            author={author}
            onAuthorClick={onAuthorClick}
            onDeleteAuthor={onDeleteAuthor}
          />
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
