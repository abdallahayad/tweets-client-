import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import styles from './Search.module.css';
class Search extends Component {
  state = {
    value: '',
    redirect: false,
    search: '',
  };
  onChangeHandler = (e) => {
    this.setState({ value: e.target.value, search: e.target.value });
  };
  checkState = (e) => {
    if (e.keyCode === 13) {
      this.setState({ redirect: true, value: '' });
    } else {
      this.setState({ redirect: false });
    }
  };
  render() {
    return (
      <Fragment>
        <input
          type='text'
          className={styles.searchBar}
          placeholder='Search Users'
          value={this.state.value}
          onChange={this.onChangeHandler}
          onKeyDown={this.checkState}
        />
        {this.state.redirect && <Redirect to={`/users/${this.state.search}`} />}
      </Fragment>
    );
  }
}

export default Search;
