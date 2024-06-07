// SearchResult.js

import React, { Component } from 'react';
import Home from '../home/Home';

class SearchResult extends Component {
  render() {
    const { hashtag, page, order } = this.props.match.params;

    return (
      <div>
        <Home hashtag={hashtag} page={page} order={order}/>
      </div>
    );
  }
}

export default SearchResult;
