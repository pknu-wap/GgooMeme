import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";
import { relatedImages } from "../util/APIUtils";
import { withRouter } from "react-router-dom";
import "./DetailPage.css";

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.match.params.postId,
      postInfo: null,
      relatedImages: [],
      loading: true,
      error: null,
      currentPage: 0, // 슬라이드의 현재 페이지
      isBookmarked: false,
    };
  }

  componentDidMount() {
    const postId = this.props.match.params.postId;
    if (postId) {
      this.setState({ postId }, () => {
        this.fetchPostInfo();
        this.fetchRelatedImages();
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.postId !== this.props.match.params.postId) {
      const postId = this.props.match.params.postId;
      this.setState({ postId }, () => {
        this.fetchPostInfo();
        this.fetchRelatedImages();
      });
    }
  }

  fetchPostInfo = () => {
    const { postId } = this.state;
    request({
      url: `${API_BASE_URL}/post/info/${postId}`,
      method: "GET",
    })
      .then((data) => {
        console.log("Received post info:", data);
        this.setState({
          postInfo: data,
          isBookmarked: data.bookmarked, // 서버에서 받아온 북마크 상태로 초기화
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  };

  fetchRelatedImages = () => {
    const { postId } = this.state;
    relatedImages(postId, 0)
      .then((data) => {
        console.log("Received related images:", data);
        this.setState({
          relatedImages: data.postDtos.postPreviewDtos,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  };

  handlePrevClick = () => {
    this.setState((prevState) => ({
      currentPage: Math.max(prevState.currentPage - 1, 0),
    }));
  };

  handleNextClick = () => {
    const { relatedImages, currentPage } = this.state;
    const totalPages = Math.ceil(relatedImages.length / 5);
    this.setState((prevState) => ({
      currentPage: Math.min(prevState.currentPage + 1, totalPages - 1),
    }));
  };

  toggleBookmark = async () => {
    const { postId, isBookmarked } = this.state;
    const newBookmarkState = !isBookmarked;

    try {
        const response = await request({
            url: `${API_BASE_URL}/post/bookmark/${postId}`,
            method: "PUT",
            body: JSON.stringify({ bookmarked: newBookmarkState }),
        });

        let responseData;
        try {
            responseData = JSON.parse(response);
        } catch (error) {
            responseData = response;
        }

        if (response.ok || responseData === "add bookmark" || responseData === "remove bookmark") {
            this.setState({ isBookmarked: newBookmarkState }, () => {
                console.log("Bookmark state updated:", this.state.isBookmarked);
            });
        } else {
            console.error(`Error updating bookmark state: ${response.status} ${responseData}`);
        }
    } catch (error) {
        console.error("Error updating bookmark state:", error);
    }
};


  render() {
    const { postInfo, relatedImages, loading, error, currentPage, isBookmarked } = this.state;

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!postInfo) {
      return <div>No post information available.</div>;
    }

    // 현재 페이지의 이미지들만 슬라이스하여 보여줍니다.
    const startIndex = currentPage * 5;
    const endIndex = startIndex + 5;
    const currentImages = relatedImages.slice(startIndex, endIndex);

    return (
      <div className="detail-container">
        <div className="detail-info">
          <div className="post-image">
            <img src={postInfo.image} alt={`Post ${postInfo.postId}`} />
          </div>
          <div className="post-info">
            <p>Likes: {postInfo.likes}</p>
            <div className="bookmark-icon" onClick={this.toggleBookmark}>
              <BookmarkIcon filled={isBookmarked} />
            </div>
          </div>
        </div>
        <div className="image-tag">
          {postInfo.tags
            ? postInfo.tags.map((tag, index) => <span key={index}>{tag}</span>)
            : "No tags available"}
        </div>
        <div className="related-images">
          <h2>연관 이미지</h2>
          <div className="slider-container">
            <button
              className="prev-button"
              onClick={this.handlePrevClick}
              disabled={currentPage === 0}
            >
              &lt;
            </button>
            <div className="related-images-wrapper">
              <div className="related-images-list">
                {currentImages.map((image) => (
                  <a
                    key={image.postId}
                    href={`/detail/${image.postId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="related-image-item">
                      <img
                        src={image.postImage}
                        alt={`Related Post ${image.postId}`}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <button
              className="next-button"
              onClick={this.handleNextClick}
              disabled={currentPage === Math.ceil(relatedImages.length / 5) - 1}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const BookmarkIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#ffd700" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="bookmark-icon"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export default withRouter(DetailPage);
