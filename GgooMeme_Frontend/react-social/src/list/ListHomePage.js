import React, { Component } from "react";
import { request } from "../util/APIUtils";
import { API_BASE_URL } from "../constants";
import "./ListPage.css";


class ListHomePage extends Component {
  state = {
    postPreviewDtos: [],
    loading: true,
    error: null,
    page: 0,
    columns: 6,
    hashtag:null,
    hasNext: true,
    isFetching: false,
  };

  componentDidMount() {
    this.fetchPostData(1, "랜덤순");
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname && this.props.location.pathname.includes("/list/")) {
      this.updateSearchTerm();
    }
  }

  handleScroll = () => {
    const { loading, hasNext, isFetching } = this.state;
    if (loading || !hasNext || isFetching) return;
  
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      this.loadMorePosts();
    }
  };
  
  loadMorePosts = () => {
    const { hashtag, page } = this.state;
    this.setState({ isFetching: true });
    this.fetchPostData(page + 1, "랜덤순");
    // if (hashtag) {
    //   this.fetchImagesByHashtags(hashtag, page + 1);
    // } else {
    //   this.fetchPostData(page + 1, "랜덤순");
    // }
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

  fetchPostData(page, order) {
    request({
      url: API_BASE_URL + `/post/main/${page}/${order}`,
      method: "GET",
    })
      .then((data) => {
        this.setState((prevState) => {
          // Set을 이용해 중복된 postId를 제거
          const uniquePosts = [
            ...new Map(
              [...prevState.postPreviewDtos, ...data.postDtos.postPreviewDtos].map(
                (post) => [post.postId, post]
              )
            ).values(),
          ];
          
          return {
            postPreviewDtos: uniquePosts,
            hasNext: data.hasNext,
            loading: false,
            isFetching: false,
            error: null,
            page: page,
            order: order,
          };
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          isFetching: false,
          error: error.message,
        });
      });
  }
  

  // 이미지 클릭 시 상세 페이지로 이동하는 함수
  handleImageClick = (postId) => {
    // postId를 사용하여 상세 페이지 URL을 생성
    const detailPageURL = `/detail/${postId}`;
    // 상세 페이지 URL로 이동
    this.props.history.push(detailPageURL);
  };

  render() {
    const { postPreviewDtos, loading, error, columns, isFetching, hasNext } = this.state;

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
        {columnElements.map((column, index) => (
          <div key={index} className="gallery-column">
            {column}
          </div>
        ))}
      </div>
      {isFetching && <div>Loading more...</div>}
      {!isFetching && hasNext && (
        <button className="load-more"onClick={this.loadMorePosts}>Load More</button>
      )}
    </div>
    );
  }
}

export default ListHomePage;