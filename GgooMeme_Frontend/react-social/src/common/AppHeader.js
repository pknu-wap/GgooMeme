import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import "./AppHeader.css";
import { fetchImagesByHashtags, getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "", // 입력값 상태 추가
      page: 0,
      currentUser: null,
    };
  }

  componentDidMount() {
    // 컴포넌트가 mount될 때 현재 경로에 따라 이전 검색어를 가져옴
    this.updateSearchTerm();
  }

  componentDidUpdate(prevProps, prevState) {
    // 이전 경로와 현재 경로가 다르고, 현재 경로가 "/list/"를 포함할 때만 검색어 업데이트
    if (
      prevProps.location.pathname !== this.props.location.pathname &&
      this.props.location.pathname.includes("/list/")
    ) {
      this.updateSearchTerm();
    }
  }


  // 현재 경로에 따라 검색어 업데이트
  updateSearchTerm() {
    const currentPath = this.props.location.pathname;
    if (currentPath.includes("/list/")) {
      const parts = currentPath.split("/");
      this.setState({
        searchTerm: parts[2],
        page: parts[3],
      });
    } else if (currentPath === "/home") {
      this.setState({ searchTerm: "", page: 0 });
    }
  }
  

  // 입력값 변경 핸들러
  handleInputChange = (event) => {
    const { value } = event.target;
    this.setState({ searchTerm: value, page: 0 }, () => {
      // 검색어가 변경될 때마다 페이지를 0으로 초기화하고 새로운 API 요청을 보냄
      if (value.trim() !== "") {
        fetchImagesByHashtags(value, 0);
      } else {
        // 빈 문자열일 경우 다른 처리를 수행하거나 요청을 보내지 않음
        this.setState({ postPreviewDtos: [], hasNext: false });
      }
    });
  };

  // Enter 키 입력 처리
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const { searchTerm, page } = this.state;
      // 현재 경로에서 /를 제외한 부분에 따라서 이동
      this.props.history.push(`/list/${searchTerm}/${page}`);
      //window.location.reload();
      //this.props.onSearch(searchTerm, page);
    }
  };

  render() {
    const { authenticated } = this.props;
    //const { currentUser } = this.state;
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
                    value={this.state.searchTerm} // 입력값 상태 반영
                    onChange={this.handleInputChange} // 입력값 변경 이벤트 핸들러
                    onKeyDown={this.handleKeyPress} // Enter 키 입력 이벤트 핸들러
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
