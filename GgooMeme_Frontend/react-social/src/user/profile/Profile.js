import React, { Component } from "react";
import "./Profile.css";
import { request } from "../../util/APIUtils";
import { API_BASE_URL } from "../../constants";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarkedImages: [],
      loading: true,
      error: null,
      currentPage: 0, // 슬라이드의 현재 페이지
    };
  }

  componentDidMount() {
    this.fetchBookmarkedImages();
  }

  fetchBookmarkedImages = () => {
    // 사용자의 북마크한 이미지를 가져오는 요청
    request({
      url: `${API_BASE_URL}/mypage/bookmark`,
      method: "GET",
    })
      .then((data) => {
        console.log("Received bookmarked images:", data);
        this.setState({
          bookmarkedImages: data.postPreviewDtos, // postPreviewDtos를 사용하여 이미지 정보를 가져옵니다.
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
    const { bookmarkedImages, currentPage } = this.state;
    const totalPages = Math.ceil(bookmarkedImages.length / 5);
    this.setState((prevState) => ({
      currentPage: Math.min(prevState.currentPage + 1, totalPages - 1),
    }));
  };

  render() {
    const { bookmarkedImages, loading, error, currentPage } = this.state;
    const { currentUser } = this.props;

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    const startIndex = currentPage * 5;
    const endIndex = startIndex + 5;
    const currentImages = bookmarkedImages.slice(startIndex, endIndex);

    return (
      <div>
        <div className="profile-container">
          <div className="container">
            <div className="profile-info">
              <div className="profile-avatar">
                {currentUser && currentUser.imageUrl ? (
                  <img src={currentUser.imageUrl} alt={currentUser.name} />
                ) : (
                  <div className="text-avatar">
                    <span>
                      {currentUser && currentUser.name
                        ? this.props.currentUser.name
                        : ""}
                    </span>
                  </div>
                )}
              </div>
              <div className="profile-name">
                <div>
                  <p>Name</p>
                  <h2>
                    {currentUser && currentUser.name
                      ? currentUser.name
                      : "avatar"}
                    님, 안녕하세요😊
                  </h2>
                </div>
                <div className="profile-email">
                  <p>Email</p>
                  <h3>
                    {currentUser && currentUser.email ? currentUser.email : ""}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bookmarked-images">
          <h3>나의 북마크 디자인</h3>
          {bookmarkedImages.length === 0 ? (
            <div className="no-bookmarks">
              북마크한 디자인이 없습니다. 내 취향의 디자인을 찾아보세요.
            </div>
          ) : (
            <div className="slider-container">
              <button
                className="prev-button"
                onClick={this.handlePrevClick}
                disabled={currentPage === 0}
              >
                &lt;
              </button>
              <div className="bookmarked-images-wrapper">
                <div className="image-list">
                  {currentImages.map((image) => (
                    <a
                      key={image.postId}
                      href={`/detail/${image.postId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div key={image.postId} className="image-item">
                        <img
                          src={image.postImage}
                          alt={`Bookmark ${image.postId}`}
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <button
                className="next-button"
                onClick={this.handleNextClick}
                disabled={
                  currentPage === Math.ceil(bookmarkedImages.length / 5) - 1
                }
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
