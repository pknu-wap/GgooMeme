import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import Home from "../home/Home";
import SearchResult from "../home/SearchResult";
import DetailPage from '../detail/DetailPage';
import ListPage from '../list/ListPage';
import Login from "../user/login/Login";
import Profile from "../user/profile/Profile";
import OAuth2RedirectHandler from "../user/oauth2/OAuth2RedirectHandler";
import NotFound from "../common/NotFound";
import LoadingIndicator from "../common/LoadingIndicator";
import { getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";
import PrivateRoute from "../common/PrivateRoute";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "./App.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: null,
      loading: true,
    };

    this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  // loadCurrentlyLoggedInUser() {
  //   getCurrentUser()
  //     .then((response) => {
  //       this.setState({
  //         currentUser: response,
  //         authenticated: true,
  //         loading: false,
  //       });
  //     })
  //     .catch((error) => {
  //       this.setState({
  //         loading: false,
  //       });
  //     });
  // }
  async loadCurrentlyLoggedInUser() {
    try {
      const response = await getCurrentUser();
      localStorage.setItem(ACCESS_TOKEN, response.accessToken); // 사용자 정보를 로컬 스토리지에 저장
      this.setState({
        currentUser: response,
        authenticated: true,
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  }

  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated: false,
      currentUser: null,
    });
    Alert.success("You're safely logged out!");
  }

  handleSearch = (searchTerm, page) => {
    // 검색어와 페이지 정보를 업데이트합니다.
    this.setState({ searchTerm, currentPage: page });
  };

  componentDidMount() {
    this.loadCurrentlyLoggedInUser();
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    //리다이렉션 1번 & null값 수정
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      this.state.authenticated = true;
    }

    return (
      <div className="app">
        <div className="app-top-box">
          <AppHeader
            authenticated={this.state.authenticated}
            currentUser={this.state.currentUser}
            onLogout={this.handleLogout}
            //onSearch={this.handleSearch}
          />
        </div>
        <div className="app-body">
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/search/:hashtag/:page/:order" component={SearchResult}></Route>
            <Route exact path="/detail/:postId" component={DetailPage}></Route>
            <Route
              path="/list/:hashtag/:page"
              render={(props) => (
                <ListPage {...props} authenticated={this.state.authenticated} currentUser={this.state.currentUser} />
              )}
            />
            <PrivateRoute
              path="/profile"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={Profile}
            ></PrivateRoute>
            <Route
              path="/login"
              render={(props) => (
                <Login authenticated={this.state.authenticated} {...props} />
              )}
            ></Route>
            <Route
              path="/oauth2/redirect"
              component={OAuth2RedirectHandler}
            ></Route>
            {/* <Route component={NotFound}></Route> */}
          </Switch>
        </div>
        <Alert
          stack={{ limit: 3 }}
          timeout={3000}
          position="top-right"
          effect="slide"
          offset={65}
        />
      </div>
    );
  }
}

export default App;
