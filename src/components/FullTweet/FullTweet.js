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
import styles from './FullTweet.module.css';
import axios from 'axios';
import Loader from '../Loader/Loader';
class FullTweet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweet: null,
      comment: '',
      comments: null,
    };
    this.commentRef = React.createRef();
  }
  componentDidMount() {
    const path = window.location.pathname.split('/');
    const tweetId = path[4];
    this.getFulltweetData(tweetId);
  }
  componentDidUpdate() {
    // this.commentRef.current.focus();
  }

  onChangeHandler = (e) => {
    this.setState({ comment: e.target.value });
  };
  deleteComment = (commentId, tweetId) => {
    axios.delete(`/api/tweet/${tweetId}/${commentId}`).then((res) => {
      const oldCommentCount = this.state.tweet.commentCount;
      let newTweet = {
        ...this.state.tweet,
        commentCount: oldCommentCount - 1,
      };
      this.setState({
        comments: this.state.comments.filter(
          (comment) => comment.commentId !== res.data.commentId
        ),
        tweet: newTweet,
      });
      if (this.props.decComments) this.props.decComments(tweetId);
      this.props.decCommentCount(tweetId);
    });
  };
  submitComment = (e) => {
    const path = window.location.pathname.split('/');
    const tweetId = path[4];
    if (e.keyCode === 13) {
      this.setState({ comment: '' });
      axios
        .post(`/api/tweet/${tweetId}/comment`, {
          body: this.state.comment,
        })
        .then((res) => {
          if (this.props.incComments) this.props.incComments(tweetId);
          const oldCommentCount = this.state.tweet.commentCount;
          let newTweet = {
            ...this.state.tweet,
            commentCount: oldCommentCount + 1,
          };
          this.setState({
            tweet: newTweet,
            comments: this.state.comments.concat(res.data),
            show: true,
          });
          this.props.incCommentCount(tweetId);
        });
    }
  };
  getFulltweetData = (tweetId) => {
    axios.get(`/api/tweet/${tweetId}`).then((res) => {
      this.setState({ tweet: res.data.data, comments: res.data.comments });
    });
  };

  onComment = () => {
    this.commentRef.current.focus();
  };
  likeTweet = () => {
    const path = window.location.pathname.split('/');
    const tweetId = path[4];
    if (this.props.like) this.props.like(tweetId);
    this.props.likeTweet(tweetId);
    let oldLikes = this.state.tweet.likeCount;
    let newTweet = { ...this.state.tweet, likeCount: oldLikes + 1 };
    this.setState({ tweet: newTweet });
  };
  unlikeTweet = () => {
    const path = window.location.pathname.split('/');
    const tweetId = path[4];
    if (this.props.unlike) this.props.unlike(tweetId);
    this.props.unlikeTweet(tweetId);
    let oldLikes = this.state.tweet.likeCount;
    let newTweet = { ...this.state.tweet, likeCount: oldLikes - 1 };
    this.setState({ tweet: newTweet });
  };
  render() {
    const path = window.location.pathname.split('/');
    const tweetId = path[4];
    let likeButton;
    if (this.props.user) {
      if (this.props.user.likes.some((obj) => obj.tweetId === tweetId)) {
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
    const comments = this.state.tweet
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
    if (this.state.tweet && this.props.user) {
      if (this.props.user.credentials.username === this.state.tweet.username) {
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
    let tweet = (
      <div className={styles.tweet}>
        <Loader />
      </div>
    );
    if (this.state.tweet) {
      tweet = (
        <div
          className={styles.tweet}
          style={this.props.style ? this.props.style : null}
        >
          <div className={styles.tweetHeader}>
            <div className={styles.tweetInfo}>
              <div className={styles.tweetImg}>
                <img src={this.state.tweet.userImage} alt='user' />
              </div>
              <NavLink
                className={styles.userLink}
                to={`/users/${this.state.tweet.username}`}
              >
                <h4 className={styles.username}>
                  @{this.state.tweet.username}
                </h4>
              </NavLink>
            </div>
            <div>{deleteButton}</div>
          </div>

          <div className={styles.tweetBody}>{this.state.tweet.body}</div>
          <h6 className={styles.tweetDate}>
            {dayjs(this.state.tweet.createdAt).format('DD/MM/YYYY')}
          </h6>
          <h6 className={styles.tweetTime}>
            {dayjs(this.state.tweet.createdAt).format('h:mm:ss a')}
          </h6>
          <div className={styles.tweetActions}>
            {likeButton}
            <button className={styles.commentButton} onClick={this.onComment}>
              <i className='far fa-comment'></i>
            </button>
          </div>
          <div className={styles.tweetStuff}>
            <p>
              <strong>{this.state.tweet.likeCount}</strong> Likes
            </p>
            <p>
              <strong>{this.state.tweet.commentCount}</strong> Comments
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

          <div className={styles.commentsContainer}>{comments}</div>
        </div>
      );
    }
    return tweet;
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
export default connect(mapStateToProps, mapActionsToProps)(FullTweet);
