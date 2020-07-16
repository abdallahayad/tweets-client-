import React, { Component, Fragment } from 'react';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from './Tweet.module.css';
import FullTweet from '../FullTweet/FullTweet';
import axios from 'axios';
import Backdrop from '../../util/Backdrop/Backdrop';
class Tweet extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      show: false,
      comment: '',
      oldPath: null,
    };
    this.commentRef = React.createRef();
  }

  onChangeHandler = (e) => {
    this.setState({ comment: e.target.value });
  };

  showFullTweet = () => {
    this.props.history.push(
      `/users/${this.props.username}/tweets/${this.props.tweetId}`
    );
  };
  toggleShow = () => {
    const oldPath = window.location.pathname;
    const newPath = `/users/${this.props.username}/tweets/${this.props.tweetId}`;
    window.history.pushState(null, null, newPath);
    this.setState({ show: true, oldPath });
  };
  onComment = () => {
    this.commentRef.current.focus();
  };
  likeTweet = () => {
    this.props.likeTweet(this.props.tweetId);
  };
  unlikeTweet = () => {
    this.props.unlikeTweet(this.props.tweetId);
  };
  closeFullTweet = () => {
    this.setState({ show: false });
    window.history.pushState(null, null, this.state.oldPath);
  };
  render() {
    let likeButton;
    if (this.props.user) {
      if (
        this.props.user.likes.some((obj) => obj.tweetId === this.props.tweetId)
      ) {
        likeButton = (
          <button className={styles.liked} onClick={this.unlikeTweet}>
            <i className='fas fa-thumbs-up'></i>
          </button>
        );
      } else {
        likeButton = (
          <button className={styles.likeButton} onClick={this.likeTweet}>
            <i className='far fa-thumbs-up'></i>
          </button>
        );
      }
    }
    let deleteButton;

    if (this.props.user) {
      if (this.props.user.credentials.username === this.props.username) {
        deleteButton = (
          <button
            className={styles.tweetDelete}
            onClick={() => this.props.deleteTweetAction(this.props.tweetId)}
          >
            <i className='far fa-trash-alt fa-sm'></i>
          </button>
        );
      }
    } else {
      deleteButton = null;
    }
    return (
      <Fragment>
        <div
          className={styles.tweet}
          style={this.props.style ? this.props.style : null}
        >
          <div className={styles.tweetHeader}>
            <div className={styles.tweetInfo}>
              <div className={styles.tweetImg}>
                <img src={this.props.userImage} alt='user' />
              </div>
              <NavLink
                className={styles.userLink}
                to={`/users/${this.props.username}`}
              >
                <h4 className={styles.username}>@{this.props.username}</h4>
              </NavLink>
            </div>
            <div>
              {deleteButton}
              <button
                className={styles.tweetExpand}
                onClick={
                  this.props.onClick
                    ? this.props.onClick
                    : this.props.expand
                    ? this.showFullTweet
                    : this.toggleShow
                }
              >
                <i className='fas fa-expand-alt fa-sm' aria-hidden='true'></i>
              </button>
            </div>
          </div>

          <div className={styles.tweetBody}>{this.props.body}</div>
          <h6 className={styles.tweetDate}>
            {dayjs(this.props.createdAt).format('DD/MM/YYYY')}
          </h6>
          <h6 className={styles.tweetTime}>
            {dayjs(this.props.createdAt).format('h:mm:ss a')}
          </h6>
          <div className={styles.tweetActions}>
            {likeButton}
            <button
              className={styles.commentButton}
              onClick={this.props.expand ? this.showFullTweet : this.toggleShow}
            >
              <i className='far fa-comment'></i>
            </button>
          </div>

          <div className={styles.tweetStuff}>
            <p>
              <strong>{this.props.likeCount}</strong> Likes
            </p>
            <p>
              <strong>{this.props.commentCount}</strong> Comments
            </p>
          </div>
        </div>
        {this.state.show && (
          <Fragment>
            <Backdrop onClick={this.closeFullTweet} />
            <FullTweet tweetId={this.props.tweetId} focus={this.state.focus} />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.userData,
  auth: state.user.auth,
});

export default connect(mapStateToProps)(Tweet);
