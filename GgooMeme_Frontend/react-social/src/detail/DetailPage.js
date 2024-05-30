import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";
import { relatedImages } from "../util/APIUtils";

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.match.params.postId, // URL에서 postId 가져오기
      postInfo: null,
      relatedImages: [],
      loading: true,
      error: null,
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
    relatedImages(postId, 0) // page 번호를 0으로 설정
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

  render() {
    const { postInfo, relatedImages, loading, error } = this.state;

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!postInfo) {
      return <div>No post information available.</div>;
    }

    return (
      <div className="detail-container">
        <h1>Post Detail</h1>
        <div className="detail-info">
          <img src={postInfo.image} alt={`Post ${postInfo.postId}`} />
          <p>Post ID: {postInfo.postId}</p>
          <p>Tags: {postInfo.tags ? postInfo.tags.join(", ") : "No tags available"}</p>
          <p>Likes: {postInfo.likes}</p>
          <p>Bookmarked: {postInfo.bookmarked ? "Yes" : "No"}</p>
        </div>
        <div className="related-images">
          <h2>Related Images</h2>
          <div className="related-images-list">
            {relatedImages.length > 0 ? (
              relatedImages.map((image) => (
                <div key={image.postId} className="related-image-item">
                  <img src={image.postImage} alt={`Related Post ${image.postId}`} />
                </div>
              ))
            ) : (
              <p>No related images available.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DetailPage;
