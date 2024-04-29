import React, { Component } from "react";
import "./Home.css";
import MainList from "./MainList"
import pencilLogo from '../../src/img/pencil.png';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtags: "",
    };
  }

  handleInputChange = (event) =>{
    const{value} = event.target;
    this.setState({hashtags:value});
  }

  render() {
    const {hashtags} = this.state;
    return (
      <div className="home-container">
        <div className="content-container">
            <div className="main-container">
                <h1 className="home-title">Searching design for you<img className="home-logo"src={pencilLogo} alt="pencil"/></h1>
                <h2 className="home-intro">
                    당신의 취향에 맞는 디자인을 살펴보세요
                </h2>
                <input
                    type="text"
                    className="home-input"
                    placeholder=" search"
                    onChange={this.handleInputChange}
                    value={hashtags}
                ></input>
            </div>
            <div className="tag-out-container">
                <div className="tag-container"> 
                  {/* a를 link로 변경??? */}
                    <div className="tag-box" onClick={this.handleInputChange}><a className="tag-name" href=""><span>html</span></a></div>
                    <div className="tag-box" onClick={this.handleInputChange}><a className="tag-name" href=""><span>CSS</span></a></div>
                    <div className="tag-box"><a className="tag-name" href=""><span>일러스트</span></a></div>
                    <div className="tag-box"><a className="tag-name" href=""><span>아이콘</span></a></div>
                    <div className="tag-box"><a className="tag-name" href=""><span>캐리커쳐</span></a></div>
                </div>
            </div>
            {/* <MainList hashtags={hashtags}/> */}
        </div>

    </div>


    );
  }
}

export default Home;
