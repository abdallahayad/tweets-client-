import React, { Component } from 'react';
import Comment from '../Comment/Comment';
import { INC_COMMENT_COUNT, DEC_COMMENT_COUNT } from '../../redux/types';
import {
  likeATweet,
  unlikeATweet,
  deleteTweet,
} from '../../redux/actions/dataActions';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from './Tweet.module.css';
import axios from 'axios';
class Tweet extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      show: false,
      comment: '',
    };
    this.commentRef = React.createRef();
  }
  componentDidMount() {
    this.getFulltweetData(this.source);
  }

  componentWillUnmount() {
    this.source.cancel('Cancelled');
  }

  onChangeHandler = (e) => {
    this.setState({ comment: e.target.value });
  };
  deleteComment = (commentId, tweetId) => {
    axios.delete(`/api/tweet/${tweetId}/${commentId}`).then((res) => {
      this.setState({
        comments: this.state.comments.filter(
          (comment) => comment.commentId !== res.data.commentId
        ),
      });
      this.props.decCommentCount(tweetId);
    });
  };
  submitComment = (e) => {
    if (e.keyCode === 13) {
      this.setState({ comment: '' });
      axios
        .post(`/api/tweet/${this.props.tweetId}/comment`, {
          body: this.state.comment,
        })
        .then((res) => {
          this.setState({
            comments: this.state.comments.concat(res.data),
            show: true,
          });
          this.props.incCommentCount(this.props.tweetId);
        });
    }
  };
  getFulltweetData = (source) => {
    axios
      .get(`/api/tweet/${this.props.tweetId}`, { cancelToken: source.token })
      .then((res) => {
        this.setState({ comments: res.data.comments });
      });
  };
  toggleShow = () => {
    this.setState((prevState) => {
      return { ...this.state, show: !prevState.show };
    });
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
    const comments = this.state.comments
      ? this.state.comments
          .sort((a, b) => {
            return a.createdAt < b.createdAt
              ? 1
              : a.createdAt > b.createdAt
              ? -1
              : 0;
          })
          .map((comment, index) => (
            <Comment
              comment={comment}
              key={comment.createdAt}
              index={index}
              commentsLength={this.state.comments.length}
              authUser={
                this.props.user ? this.props.user.credentials.username : null
              }
              deleteComment={this.deleteComment}
            />
          ))
      : null;
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
            <button className={styles.tweetExpand} onClick={this.toggleShow}>
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
          <button className={styles.commentButton} onClick={this.onComment}>
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
        <input
          className={styles.input}
          placeholder='Write a comment'
          onKeyDown={this.submitComment}
          value={this.state.comment}
          onChange={this.onChangeHandler}
          ref={this.commentRef}
        />

        {this.state.show ? comments : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.userData,
  auth: state.user.auth,
});
const mapActionsToProps = (dispatch) => ({
  incCommentCount: (tweetId) =>
    dispatch({ type: INC_COMMENT_COUNT, payload: tweetId }),
  decCommentCount: (tweetId) =>
    dispatch({ type: DEC_COMMENT_COUNT, payload: tweetId }),
  likeTweet: (tweetId) => dispatch(likeATweet(tweetId)),
  unlikeTweet: (tweetId) => dispatch(unlikeATweet(tweetId)),
  deleteTweetAction: (tweetId) => dispatch(deleteTweet(tweetId)),
});
export default connect(mapStateToProps, mapActionsToProps)(Tweet);
