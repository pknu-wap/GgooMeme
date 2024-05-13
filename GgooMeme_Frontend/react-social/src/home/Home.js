import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL, ACCESS_TOKEN } from "../constants";
import "./Home.css";
import pencilLogo from "../../src/img/pencil.png";
import { Link } from "react-router-dom";
import { fetchImagesByHashtags } from "../util/APIUtils";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtag: "",
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
    const { hashtag } = this.state;
    this.fetchPostData(page);
    //this.fetchData(page,hashtag)
    this.fetchImagesByHashtags(hashtag, page);
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

  //이미지 정보 가져오기(처음 렌더링시)
  fetchPostData(page) {
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

  fetchImagesByHashtags = (hashtag, page) => {
    fetchImagesByHashtags(hashtag, page)
      .then((data) => {
        console.log("Received images:", data);
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
  };

  // fetchData(page, hashtag) {
  //   Promise.all([
  //     request({
  //       url: API_BASE_URL + `/post/main/${page}`,
  //       method: "GET",
  //     }),
  //     request({
  //       url: API_BASE_URL + `/post/search/${hashtag}/${page+1}`,
  //       method: "GET",
  //     })
  //   ])
  //   .then(([postData, hashtagData]) => {
  //     console.log("Received data:", postData);
  //     console.log("Received images:", hashtagData);
  //     this.setState({
  //       postPreviewDtos: postData.postDtos.postPreviewDtos,
  //       hasNext: postData.hasNext,
  //       loading: false,
  //       error: null,
  //       page: page,
  //     });
  //   })
  //   .catch(error => {
  //     this.setState({
  //       loading: false,
  //       error: error.message,
  //     });
  //   });
  // }

  //드롭메뉴
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

  //input 검색시 (endter키/ onchange)
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const { hashtag, page } = this.state; // 현재 페이지 상태를 가져옴
      //this.fetchImagesByHashtags(hashtag, page);
      this.props.history.push(`/list/${hashtag}/${page}`);
    }
  };

  // input 요소의 값이 변경될 때 호출되는 메서드
  handleInputChange = (event) => {
    const { value } = event.target;
    this.setState({ hashtag: value, page: 0 }, () => {
      // 검색어가 변경될 때 페이지를 0으로 초기화
      if (value.trim() !== "") {
        // 입력값이 빈 문자열이 아닌 경우에만 요청을 보냄
        this.fetchImagesByHashtags(value, 0); // 페이지를 0으로 초기화하여 검색 API 호출
      } else {
        // 빈 문자열인 경우 다른 처리를 수행하거나 요청을 보내지 않음
      }
    });
  };

  handleTagClick = (tag) => {
    this.setState({ hashtag: tag, page: 0 }, () => {
      this.fetchImagesByHashtags(tag, 0);
    });
  };

  // 이미지 클릭 시 상세 페이지로 이동하는 함수
  handleImageClick = (postId) => {
    // postId를 사용하여 상세 페이지 URL을 생성
    const detailPageURL = `/detail/${postId}`;
    // 상세 페이지 URL로 이동
    this.props.history.push(detailPageURL);
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
      hashtag,
    } = this.state;

    if (loading) {
      return <div className="loading">Loading...</div>;
    }
    //test를 위해 잠시 주석 표시
    if (error) {
      return <div>Error: {error}</div>;
    }

    const columnElements = Array.from({ length: columns }, () => []);

    postPreviewDtos.forEach((post, index) => {
      const columnIndex = index % columns;
      columnElements[columnIndex].push(
        <div
          key={post.postId}
          className="gallery-item"
          onClick={() => this.handleImageClick(post.postId)}
        >
          <img src={post.postImage} alt={`Post ${post.postId}`} />
        </div>
      );
    });

    // 페이지 번호 목록 생성
    // const pageNumbers = [];
    // for (let i = 0; i <= page; i++) {
    //   pageNumbers.push(
    //     <button key={i} onClick={() => this.fetchPostData(i)}>
    //       {i + 1}
    //     </button>
    //   );
    // }

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
              //value={hashtag}
              onKeyDown={this.handleKeyPress}
            ></input>
            <div className="tag-out-container">
              <div className="tag-container">
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("html")}
                >
                  <a className="tag-name">
                    <span>html</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("CSS")}
                >
                  <a className="tag-name">
                    <span>CSS</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("")}
                >
                  <a className="tag-name">
                    <span>일러스트</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("")}
                >
                  <a className="tag-name">
                    <span>icon</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("")}
                >
                  <a className="tag-name">
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
            {hasNext && page === 0 && (
              <button
                className="load-more"
                onClick={() => this.fetchPostData(page + 1)}
              >
                {/* 다음페이지 */}
                <Link to={`/`}>다음페이지</Link>
              </button>
            )}
            {!hasNext && page > 0 && (
              <button
                className="load-back"
                onClick={() => this.fetchPostData(page - 1)}
              >
                <Link to={`/`}>이전페이지</Link>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
