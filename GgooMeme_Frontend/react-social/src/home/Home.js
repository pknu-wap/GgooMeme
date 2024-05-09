import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL, ACCESS_TOKEN } from "../constants";
import "./Home.css"
import pencilLogo from "../../src/img/pencil.png";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtags: "",
      postPreviewDtos: [],
      hasNext: false,
      loading: true,
      error: null,
      page: 0,
      columns: 5, // 기본 열의 수
      selectedOption: "랜덤순", // 드롭다운에서 선택된 옵션
      isExpanded: false, // 드롭다운이 열려있는지 여부
    };
  }

  componentDidMount() {
    const { page } = this.state;
    this.fetchPostData(page);

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    // 화면 너비에 따라 열의 수를 동적으로 변경
    this.setState({ columns: this.calculateColumns() });
  };

  calculateColumns = () => {
    const { postPreviewDtos } = this.state;
    const windowWidth = window.innerWidth;
    if (postPreviewDtos.length > 0) {
      if (windowWidth >= 1280) {
        return 5;
      } else if (windowWidth >= 980) {
        return 4;
      } else if (windowWidth >= 780) {
        return 3;
      } else if (windowWidth >= 580) {
        return 2;
      } else {
        return 1;
      }
    } else {
      return 5; //초기 렌더링 값
    }
  };

  fetchPostData(page) {
    const { hashtags } = this.state;
    request({
      url: API_BASE_URL + `/post/main/${page}`,
      method: "GET",
    })
      .then((data) => {
        console.log("Received data:", data);
        this.setState({
          postPreviewDtos: data.postDtos.postPreviewDtos,
          hasNext: data.hasNext,
          loading: false,
          error: null,
          page: page,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  }

  handleInputChange = (event) => {
    const { value } = event.target;
    this.setState({ hashtags: value });
  };

  handleItemClick = (label) => {
    this.setState({
      selectedOption: label,
      isExpanded: false,
      // 선택된 옵션에 따라 데이터를 다시 불러올 수 있도록 추가 작업 가능
    });
  };

  toggleExpand = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    const {
      postPreviewDtos,
      hasNext,
      loading,
      error,
      page,
      columns,
      selectedOption,
      isExpanded,
      hashtags,
    } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }

    const columnElements = Array.from({ length: columns }, () => []);

    postPreviewDtos.forEach((post, index) => {
      const columnIndex = index % columns;
      columnElements[columnIndex].push(
        <div key={post.postId} className="gallery-item">
          <img src={post.postImage} alt={`Post ${post.postId}`} />
        </div>
      );
    });

    // 페이지 번호 목록 생성
    const pageNumbers = [];
    for (let i = 0; i <= page; i++) {
      pageNumbers.push(
        <button key={i} onClick={() => this.fetchPostData(i)}>
          {i + 1}
        </button>
      );
    }

    return (
      <div className="homei-container">
        <div className="home-container">
          <div className="main-container">
            <h1 className="home-title">
              Searching design for you
              <img className="home-logo" src={pencilLogo} alt="pencil" />
            </h1>
            <h2 className="home-intro">
              당신의 취향에 맞는 디자인을 살펴보세요
            </h2>
            <input
              type="text"
              className="home-input"
              placeholder=" search"
              onChange={this.handleInputChange}
              value={hashtags}
            ></input>
            <div className="tag-out-container">
              <div className="tag-container">
                {/* a를 link로 변경??? */}
                <div className="tag-box" onClick={this.handleInputChange}>
                  <a className="tag-name" href="">
                    <span>html</span>
                  </a>
                </div>
                <div className="tag-box" onClick={this.handleInputChange}>
                  <a className="tag-name" href="">
                    <span>CSS</span>
                  </a>
                </div>
                <div className="tag-box">
                  <a className="tag-name" href="">
                    <span>일러스트</span>
                  </a>
                </div>
                <div className="tag-box">
                  <a className="tag-name" href="">
                    <span>아이콘</span>
                  </a>
                </div>
                <div className="tag-box">
                  <a className="tag-name" href="">
                    <span>캐리커쳐</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="gallery-container">
          {/* 드롭다운 메뉴 */}
          <div className="order-container">
            <div className="dropdown-container">
              <div className="button">
                <button className="dropdown" onClick={this.toggleExpand}>
                  <span className="dropdown-button" type="button">
                    {selectedOption}
                  </span>
                  <span className="dropdown-button" type="button">
                    {isExpanded ? "△" : "▽"}
                  </span>
                </button>
              </div>

              <div className="dropdown-detail">
                {isExpanded && (
                  <div className="dropdown-detail-menu">
                    <div
                      className="dropdown-detail-item"
                      onClick={() => this.handleItemClick("랜덤순")}
                    >
                      <label>랜덤순</label>
                    </div>
                    <div
                      className="dropdown-detail-item"
                      onClick={() => this.handleItemClick("인기순")}
                    >
                      <label>인기순</label>
                    </div>
                    <div
                      className="dropdown-detail-item"
                      onClick={() => this.handleItemClick("리뷰순")}
                    >
                      <label>리뷰순</label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 이미지 갤러리 */}
          <div className="gallery">
            {columnElements.map((column, index) => (
              <div key={index} className="gallery-column">
                {column}
              </div>
            ))}
          </div>

          {/* 페이지 네이션 */}
          <div className="pagination">
            {hasNext && (
              <button onClick={() => this.fetchPostData(pageNumbers)}>{pageNumbers}</button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
