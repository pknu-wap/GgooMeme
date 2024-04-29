import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Order.css";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "편집순",
      isExpanded: false,
    };
  }

  handleItemClick = (label) => {
    this.setState({
      selectedOption: label,
      isExpanded: false, // 드롭다운 아이템 클릭시 드롭다운이 닫히도록
    });
  };

  toggleExpand = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    return (
      <div className="order-container">
        <div className="dropdown-container">
          <div className="button">
            <button className="dropdown" onClick={this.toggleExpand}>
              <span className="dropdown-button" type="button">
                {this.state.selectedOption}
              </span>
              <span className="dropdown-button" type="button">
                {this.state.isExpanded ? "△" : "▽"}
              </span>
            </button>
          </div>

          <div className="dropdown-detail">
            {this.state.isExpanded && (
              <div className="dropdown-detail-menu">
                <div className="dropdown-detail-item" onClick={() => this.handleItemClick("편집순")}>
                  <label>편집순</label>
                </div>
                <div className="dropdown-detail-item" onClick={() => this.handleItemClick("인기순")}>
                  <label>인기순</label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Order;
