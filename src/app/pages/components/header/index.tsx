import React from "react";
import ButtonIcon from "../button-icon";
import "./index.scss";
export default function Header() {
  return (
    <>
      <nav className="c-header">
        <img src="" alt="" width="20px" height="20px" />
        <div className="c-header-dropdown">
          <div className="c-header-dropdown-item">
            <button>Project</button>
          </div>
          <div className="c-header-dropdown-item">
            <button>Filters</button>
          </div>
          <div className="c-header-dropdown-item">
            <button>Dashboard</button>
          </div>
          <div className="c-header-dropdown-item">
            <button>Teams</button>
          </div>
          <button>Create</button>
        </div>
        <div className="c-header-config">
          <input type="text" />
          <ButtonIcon iconClass="fa-solid fa-bell"></ButtonIcon>
          <img src="" alt="" />
        </div>
      </nav>
    </>
  );
}
