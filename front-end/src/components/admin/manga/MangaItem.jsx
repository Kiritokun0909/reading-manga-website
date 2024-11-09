// MangaItem.js
import React from "react";
import { Link, NavLink } from "react-router-dom";

const MangaItem = ({ manga }) => (
  <div className="manga-item">
    <Link to={`/manga/${manga.mangaId}`} title={manga.mangaName}>
      <img
        src={
          manga.coverImageUrl
            ? manga.coverImageUrl
            : "https://i.pinimg.com/736x/16/f5/50/16f550820fce1818559e09eb9cdbf964.jpg"
        }
        alt={manga.mangaName}
        className="manga-cover"
      />
    </Link>
    <nav id="manga-name">
      <NavLink to={`/manga/${manga.mangaId}`} title={manga.mangaName}>
        {manga.mangaName}
      </NavLink>
    </nav>
    <nav id="chapter">
      <NavLink to={`/manga/${manga.mangaId}`}>
        Chapter {manga.newestChapterNumber}
      </NavLink>
    </nav>
  </div>
);

export default MangaItem;
