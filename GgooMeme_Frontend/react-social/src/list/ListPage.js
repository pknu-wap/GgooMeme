import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";

class ListPage extends Component {
  state = {
    postPreviewDtos: [],
    loading: true,
    error: null,
    page: 0,
  };

  componentDidMount() {
    const { hashtag } = this.props.match.params;
    //this.fetchImagesByHashtags(hashtag, page);
    this.fetchImagesByHashtags(hashtag, this.state.page);
  }

  fetchImagesByHashtags = (hashtag, page) => {
    request({
      url: API_BASE_URL + `/post/search/${hashtag}/${page+1}`,
      method: "GET",
    })
      .then((data) => {
        console.log("Received images:", data);
        this.setState({
          postPreviewDtos: data.postDtos.postPreviewDtos,
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
  

  render() {
    const { postPreviewDtos, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <h1>Image List</h1>
        <ul>
          {postPreviewDtos.map((post) => (
            <li key={post.id}>
              <img src={post.postImage} alt={post.id} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ListPage;
