// MangaItem.js
import React from "react";
import { Link, NavLink } from "react-router-dom";

const MangaItem = ({ manga }) => (
  <div className="manga-item">
    <Link to={`/manga/${manga.mangaId}`} title={manga.mangaName}>
      <img
        src={manga.coverImageUrl}
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
