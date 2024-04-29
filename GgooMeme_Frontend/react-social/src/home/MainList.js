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
    };
  }

  componentDidMount() {
    const { page } = this.state;
    // const { page } = this.props.match.params;
    this.fetchPostData(page);
  }

  componentDidUpdate(prevProps){
    if(this.props.hashtags !== prevProps.hashtags){
      this.fetchPostData();
    }
  }

  fetchPostData(page) {
    const {hashtags} = this.props;
    request({
      url: API_BASE_URL + `/post/main/${page}`,
      method: "GET",
      // params: {hashtags},
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
    const { postPreviewDtos, hasNext, loading, error, page } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="gallery-container">
        <ul className="gallery">
          {postPreviewDtos.map((post) => (
            <li key={post.postId} className="gallery-item">
              <img src={post.postImage} alt={`Post ${post.postId}`} />
            </li>
          ))}
        </ul>
        {hasNext && (page===0) && (
          <button className="load-more" onClick={() => this.fetchPostData(page + 1)}>
            다음페이지
          </button>
        )}
        {!hasNext && (page > 0) &&(
          <button className="load-back" onClick={() => this.fetchPostData(page - 1)}>
            이전페이지
          </button>
        )}
      </div>
    );
  }
}

export default MainList;
