import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";
import "./ListPage.css";
import { fetchImagesByHashtags } from "../util/APIUtils";

class ListPage extends Component {
  state = {
    postPreviewDtos: [],
    loading: true,
    error: null,
    page: 0,
    columns: 6,
  };

  componentDidMount() {
    this.updateSearchTerm();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname && this.props.location.pathname.includes("/list/")) {
      this.updateSearchTerm();
    }
  }

  updateSearchTerm() {
    const { hashtag } = this.props.match.params;
    this.fetchImagesByHashtags(hashtag, this.state.page);
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
        return 6;
      } else if (windowWidth >= 980) {
        return 5;
      } else if (windowWidth >= 780) {
        return 4;
      } else if (windowWidth >= 580) {
        return 3;
      } else {
        return 2;
      }
    } else {
      return 6; //초기 렌더링 값
    }
  };

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

  // 이미지 클릭 시 상세 페이지로 이동하는 함수
  handleImageClick = (postId) => {
    // postId를 사용하여 상세 페이지 URL을 생성
    const detailPageURL = `/detail/${postId}`;
    // 상세 페이지 URL로 이동
    this.props.history.push(detailPageURL);
  };

  render() {
    const { postPreviewDtos, loading, error, columns } = this.state;

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
      <div>
        {/* 이미지 갤러리 */}
        <div className="img-gallery">
        <h1>{this.hashtag}</h1>
          {columnElements.map((column, index) => (
            <div key={index} className="gallery-column">
              {column}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ListPage;
