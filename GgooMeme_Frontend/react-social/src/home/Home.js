import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { withRouter } from 'react-router-dom';
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
      page: 1,
      columns: 5, // 기본 열의 수
      selectedOption: "랜덤순", // 드롭다운에서 선택된 옵션
      isExpanded: false, // 드롭다운이 열려있는지 여부
      order: "random", // 정렬 순서
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("popstate", this.handlePopState);

    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    const hashtag = urlParams.get("hashtag") || "";
    const order = urlParams.get("order") || "random";
    // const {page, order} = this.state;

    this.setState({ page, hashtag, order }, () => {
      if (hashtag) {
        this.fetchImagesByHashtags(hashtag, page);
      } else {
        this.fetchPostData(page, order);
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("popstate", this.handlePopState);
  }

  handlePopState = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1; // URL에서 페이지 번호 가져오기
    const hashtag = urlParams.get("hashtag") || ""; // URL에서 해시태그 가져오기
    const order = urlParams.get("order") || "랜덤순"; // URL에서 정렬 순서 가져오기
    
    this.setState({ page, hashtag, order }, () => {
      if (hashtag) {
        this.fetchImagesByHashtags(hashtag, page);
      } else {
        this.fetchPostData(page, order);
      }
    });
  };


  // 히스토리에 새로운 항목 추가
  pushHistory = (page, hashtag, order) => {
    const url = hashtag
      ? `/search/${hashtag}/${page+1}/${order}`
      : `/post/main/${page}/${order}`;
    window.history.pushState({page, hashtag,order}, "", url);
  };

  // 페이지 이동 시 호출되는 메서드
  handlePageChange = (pageNumber) => {
    const { hashtag, order } = this.state;
    this.setState({ page: pageNumber }, () => {
      this.fetchPostData(pageNumber, order);
      this.fetchImagesByHashtags(hashtag, pageNumber);
      //this.pushHistory(pageNumber, hashtag, order); // 히스토리에 추가
    });
  };

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
      return 5; // 초기 렌더링 값
    }
  };

  // 이미지 정보 가져오기(처음 렌더링 시)
  fetchPostData(page, order) {
    const url = `${API_BASE_URL}/post/main/${page}/${order}`;
    console.log("Fetching data from:", url); // 추가된 디버그 로그
    request({
      url: url,
      method: "GET",
    })
      .then((data) => {
        console.log("Received data:", data); // 추가된 디버그 로그
        if (this._isMounted) {
          this.setState({
            postPreviewDtos: data.postDtos.postPreviewDtos,
            hasNext: data.hasNext,
            loading: false,
            error: null,
            page: page,
            order: order,
          });
        }
      })
      .catch((error) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            error: error.message,
          });
        }
      });
  }
  

  fetchImagesByHashtags = (hashtag, page) => {
    fetchImagesByHashtags(hashtag, page)
      .then((data) => {
        console.log("Received images:", data);
        if (this._isMounted) { // 컴포넌트가 마운트된 경우에만 상태 업데이트
          this.setState({
            postPreviewDtos: data.postDtos.postPreviewDtos,
            hasNext: data.hasNext,
            loading: false,
            error: null,
            page: page,
            hashtag: hashtag,
          });
        }
      })
      .catch((error) => {
        if (this._isMounted) { // 컴포넌트가 마운트된 경우에만 상태 업데이트
          this.setState({
            loading: false,
            error: error.message,
          });
        }
      });
  };

  // 드롭다운 메뉴
  handleItemClick = (order) => {
    const labelMap = {
      random: "랜덤순",
      bookmark: "인기순",
      reply: "리뷰순"
    };

    this.setState(
      {
        selectedOption: labelMap[order],
        isExpanded: false,
        order: order
      },
      () => {
        const { page,order } = this.state;
        console.log("Selected order:", order);
        console.log("Page number:", page);
        this.fetchPostData(page, order);
      }
    );
  };

  toggleExpand = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  // input 검색 시 (Enter 키 / onChange)
  handleKeyPress = (event) => {
    const { page, order } = this.state;
    if (event.key === "Enter") {
      const { value } = event.target;
      if (value.trim() !== "") {
        this.props.history.push(`/list/${value}/${page}/${order}`);
      } else {
        this.props.history.push(`/post/main/${page}/${order}`);
      }
    }
  };

  handleTagClick = (tag) => {
    this.setState({ hashtag: tag, page: 0 }, () => {
      this.fetchImagesByHashtags(tag, 0);
      this.pushHistory(0, tag, this.state.order);
    });
  };
  

  // 이미지 클릭 시 상세 페이지로 이동하는 함수
  handleImageClick = (postId) => {
    // postId를 사용하여 상세 페이지 URL을 생성
    const detailPageURL = `/detail/${postId}`;
    // 상세 페이지 URL로 이동
    this.props.history.push(detailPageURL);
  };

  handleMoreClick = () => {
    const { hashtag, page, order } = this.state;
    if (hashtag) {
      this.fetchImagesByHashtags(hashtag, page);
      this.props.history.push(`/list/${hashtag}/${page+1}`);
    } else {
      this.fetchPostData(page, order);
      this.props.history.push(`/list/home/${page}`);
    }
    //this.props.history.push(`/list/${hashtag}/${page+1}`);
  }

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
    // 테스트를 위해 잠시 주석 표시
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
              onKeyDown={this.handleKeyPress}
            ></input>
            <div className="tag-out-container">
              <div className="tag-container">
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("캐릭터")}
                >
                  <a className="tag-name">
                    <span>캐릭터</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("사람")}
                >
                  <a className="tag-name">
                    <span>사람</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("꽃")}
                >
                  <a className="tag-name">
                    <span>꽃</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("식물")}
                >
                  <a className="tag-name">
                    <span>식물</span>
                  </a>
                </div>
                <div
                  className="tag-box"
                  onClick={() => this.handleTagClick("동물")}
                >
                  <a className="tag-name">
                    <span>동물</span>
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
                      onClick={() => this.handleItemClick("random")}
                    >
                      <label>랜덤순</label>
                    </div>
                    <div
                      className="dropdown-detail-item"
                      onClick={() => this.handleItemClick("bookmark")}
                    >
                      <label>인기순</label>
                    </div>
                    <div
                      className="dropdown-detail-item"
                      onClick={() => this.handleItemClick("reply")}
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
            <button className="load-more" onClick={this.handleMoreClick}>
              더보기
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);