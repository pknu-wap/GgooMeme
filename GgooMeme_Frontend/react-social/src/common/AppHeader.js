import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./AppHeader.css";
import { getCurrentUser } from "../util/APIUtils";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    const { authenticated } = this.props;
    const currentPath = window.location.pathname;

    return (
      <header className="app-header">
        <div className="app-container">
          <div className="app-branding">
            <Link to="/" className="app-title">
              꾸Meme
            </Link>
          </div>
          <div className="app-optionss">
            <nav className="app-nav">
              {authenticated ? (
                <div className="topbar">
                  {currentPath !== "/" && (
                    <input
                      className="searching-topbar"
                      type="text"
                      placeholder="search"
                    />
                  )}
                  <ul>
                    <li>
                      <NavLink to="/profile">Mypage</NavLink>
                    </li>
                    <li>
                      <a onClick={this.props.onLogout}>Logout</a>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="app-options">
                  <ul>
                    <li>
                      <NavLink to="/login">Login</NavLink>
                    </li>
                    {/* <li>
                      <NavLink to="/signup">Signup</NavLink>
                    </li> */}
                  </ul>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

export default AppHeader;
