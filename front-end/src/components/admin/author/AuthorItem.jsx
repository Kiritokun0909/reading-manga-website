// MangaItem.js
import React from "react";
import { Link, NavLink } from "react-router-dom";

const AuthorItem = ({ author, onAuthorClick, onDeleteAuthor }) => (
  <div className="manga-item">
    <Link to={`#`} title={author.authorName}>
      <img
        src={
          author.avatar
            ? author.avatar
            : "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
        }
        alt={author.authorName}
        className="manga-cover"
      />
    </Link>
    <nav id="manga-name">
      <NavLink to={`#`} title={author.authorName}>
        {author.authorName}
      </NavLink>
      <div>
        <button
          className="p-2 py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
          onClick={() => onAuthorClick(author)}
        >
          Sửa
        </button>
        <button
          className="p-2 py-1.5 px-3 m-1 text-center bg-red-500 border rounded-md text-white  hover:bg-red-700 hover:text-gray-100 red:text-white-200 dark:bg-red-700"
          onClick={() => onDeleteAuthor(author.authorId)}
        >
          Xoá
        </button>
      </div>
    </nav>
  </div>
);

export default AuthorItem;
