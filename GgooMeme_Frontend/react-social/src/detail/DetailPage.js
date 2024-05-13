import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.match.params.postId, // URL에서 postId 가져오기
      postInfo: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const postId = this.props.match.params.postId;
    if (postId) {
      this.setState({ postId }, () => {
        this.fetchPostInfo();
      });
    }
  }
  

  fetchPostInfo = () => {
    const { postId } = this.state;
    request({
      url: API_BASE_URL + `/post/info/${postId}`,
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

  render() {
    const { postInfo, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
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
          <p>Hashtags: {postInfo.hashtags.join(", ")}</p>
          <p>Likes: {postInfo.likes}</p>
          <p>Bookmarked: {postInfo.bookmarked ? "Yes" : "No"}</p>
        </div>
      </div>
    );
  }
}

export default DetailPage;
