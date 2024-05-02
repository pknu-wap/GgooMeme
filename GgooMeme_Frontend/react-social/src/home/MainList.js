import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL, ACCESS_TOKEN } from "../constants";
import "./MainList.css";

class MainList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postPreviewDtos: [],
      hasNext: false,
      loading: true,
      error: null,
      page: 0,
      columns: 5, // 기본 열의 수
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
    const { hashtags } = this.props;
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

  render() {
    const { postPreviewDtos, hasNext, loading, error, page, columns } =
      this.state;

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

    return (
      <div className="gallery-container">
        <div className="gallery">
          {columnElements.map((column, index) => (
            <div key={index} className="gallery-column">
              {column}
            </div>
          ))}
        </div>
        {hasNext && page === 0 && (
          <button
            className="load-more"
            onClick={() => this.fetchPostData(page + 1)}
          >
            다음페이지
          </button>
        )}
        {!hasNext && page > 0 && (
          <button
            className="load-back"
            onClick={() => this.fetchPostData(page - 1)}
          >
            이전페이지
          </button>
        )}
      </div>
    );
  }
}

export default MainList;
