import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import "./AppHeader.css";
import { fetchImagesByHashtags, getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      page: 0,
      currentUser: null,
    };
  }

  componentDidMount() {
    this.updateSearchTerm();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.location.pathname !== this.props.location.pathname &&
      this.props.location.pathname.includes("/list/")
    ) {
      this.updateSearchTerm();
    }
  }

  // updateSearchTerm() {
  //   const currentPath = this.props.location.pathname;
  //   if (currentPath.includes("/list/")) {
  //     const parts = currentPath.split("/");
  //     this.setState({
  //       searchTerm: parts[2],
  //       page: parts[3],
  //     });
  //   } else if (currentPath === "/home") {
  //     this.setState({ searchTerm: "", page: 1 });
  //   }
  // }

  updateSearchTerm() {
    const currentPath = this.props.location.pathname;
    if (currentPath.includes("/list/home")) {
      this.setState({ searchTerm: "", page: 1 });
    }
    else if (currentPath.includes("/list/")) {
      const parts = currentPath.split("/");
      this.setState({
        searchTerm: parts[2],
        page: parts[3],
      });
    } 
  }

  handleInputChange = (event) => {
    const { value } = event.target;
    this.setState({ searchTerm: value, page: 1 });
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const { searchTerm } = this.state;
      this.props.history.push(`/list/${searchTerm}/1`);
    }
  };

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
              <div className="topbar">
                {currentPath !== "/" && (
                  <input
                    className="searching-topbar"
                    type="text"
                    placeholder="search"
                    value={this.state.searchTerm}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleKeyPress}
                  />
                )}
                <ul>
                  {authenticated ? (
                    <React.Fragment>
                      <li>
                        <NavLink to="/profile">Mypage</NavLink>
                      </li>
                      <li>
                        <a onClick={this.props.onLogout}>Logout</a>
                      </li>
                    </React.Fragment>
                  ) : (
                    <li>
                      <NavLink to="/login">Login</NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(AppHeader);
