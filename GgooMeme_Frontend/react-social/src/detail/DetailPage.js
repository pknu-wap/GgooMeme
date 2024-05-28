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

  render() {
    const { postInfo, relatedImages, loading, error, currentPage } = this.state;

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
            <p>Post ID: {postInfo.postId}</p>
            <p>
              Tags:{" "}
              {postInfo.tags ? postInfo.tags.join(", ") : "No tags available"}
            </p>
            <p>Likes: {postInfo.likes}</p>
            <p>Bookmarked: {postInfo.bookmarked ? "Yes" : "No"}</p>
          </div>
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

export default withRouter(DetailPage);
