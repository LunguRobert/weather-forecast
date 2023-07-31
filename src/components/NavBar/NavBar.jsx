import React from "react";
import { Link } from "react-router-dom";
import "./style/NavBar.css";
import W from "../../assets/icons/letter-w.gif";

function NavBar({ noFav }) {
  return (
    <div className="nav-bar">
      <Link to="/">
        <img src={W} alt="" />
      </Link>
      {!noFav ? (
        <Link to="/favorites" className="nav-bar-favorites">
          Favorites
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}

export default NavBar;
