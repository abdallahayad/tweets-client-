import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUserData } from '../../redux/actions/userActions';
import { INC_COMMENT_COUNT, DEC_COMMENT_COUNT } from '../../redux/types';
import {
  likeATweet,
  unlikeATweet,
  deleteTweet,
} from '../../redux/actions/dataActions';
import Tweet from '../../components/Tweet/Tweet';
import styles from './user.module.css';
import Backdrop from '../../util/Backdrop/Backdrop';
import FullTweet from '../../components/FullTweet/FullTweet';
class user extends Component {
  state = {
    user: null,
    tweets: null,
    show: false,
    oldPath: null,
  };
  componentDidMount() {
    const username = this.props.match.params.username;
    axios.get(`/api/user/${username}`).then((res) => {
      this.setState({ user: res.data.credentials, tweets: res.data.tweets });
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      const username = this.props.match.params.username;
      axios.get(`/api/user/${username}`).then((res) => {
        this.setState({ user: res.data });
      });
    }
  }
  likeTweet = (tweetId) => {
    this.props.likeTweet(tweetId);
    let newTweets = this.state.tweets;
    newTweets.forEach((tweet) => {
      if (tweet.tweetId === tweetId) {
        tweet.likeCount += 1;
      }
    });
    this.setState({ tweets: newTweets });
  };
  unlikeTweet = (tweetId) => {
    this.props.unlikeTweet(tweetId);
    let newTweets = this.state.tweets;
    newTweets.forEach((tweet) => {
      if (tweet.tweetId === tweetId) {
        tweet.likeCount -= 1;
      }
    });
    this.setState({ tweets: newTweets });
  };
  like = (tweetId) => {
    let newTweets = this.state.tweets;
    newTweets.forEach((tweet) => {
      if (tweet.tweetId === tweetId) {
        tweet.likeCount += 1;
      }
    });
    this.setState({ tweets: newTweets });
  };
  unlike = (tweetId) => {
    let newTweets = this.state.tweets;
    newTweets.forEach((tweet) => {
      if (tweet.tweetId === tweetId) {
        tweet.likeCount -= 1;
      }
    });
    this.setState({ tweets: newTweets });
  };
  incCommentCount = (tweetId) => {
    let newTweets = this.state.tweets;
    newTweets.forEach((tweet) => {
      if (tweet.tweetId === tweetId) {
        tweet.commentCount += 1;
      }
    });
    this.setState({ tweets: newTweets });
  };
  closeFullTweet = () => {
    this.setState({ show: false });
    window.history.pushState(null, null, this.state.oldPath);
  };
  decCommentCount = (tweetId) => {
    let newTweets = this.state.tweets;
    newTweets.forEach((tweet) => {
      if (tweet.tweetId === tweetId) {
        tweet.commentCount -= 1;
      }
    });
    this.setState({ tweets: newTweets });
  };
  follow = () => {
    axios.get(`/api/${this.state.user.username}/follow`).then(() => {
      this.props.setUser();
    });
  };
  onClick = (tweetId) => {
    const oldPath = window.location.pathname;
    const newPath = `/users/${this.state.user.username}/tweets/${tweetId}`;
    window.history.pushState(null, null, newPath);
    this.setState({ show: true, oldPath });
  };
  render() {
    let followButton;
    if (this.state.user && this.props.user) {
      if (
        !this.props.user.credentials.following.includes(
          this.state.user.username
        ) &&
        this.state.user.username !== this.props.user.credentials.username
      ) {
        followButton = (
          <button className={styles.followButton} onClick={this.follow}>
            <i className='fas fa-user-plus'></i>
          </button>
        );
      }
    } else {
      followButton = null;
    }
    let bio = null;
    if (this.state.user) {
      const { job, location, birthDate } = this.state.user;
      if (job || location || birthDate) {
        bio = (
          <div className={styles.infoDiv}>
            {location && <h5 className={styles.info}>Location: {location}</h5>}
            {job && <h5 className={styles.info}>Job: {job}</h5>}
            {birthDate && (
              <h5 className={styles.info}>Birthday: {birthDate}</h5>
            )}
          </div>
        );
      }
    }
    let user = this.state.user ? (
      <div className={styles.user}>
        <div className={styles.bio}>
          <div className={styles.profileImage}>
            <img src={this.state.user.profileImage} alt='profile' />
            {followButton}
          </div>
          {bio}
        </div>
        {this.state.tweets && (
          <div className={styles.tweets}>
            {this.state.tweets.map((tweet) => (
              <Tweet
                userImage={tweet.userImage}
                body={tweet.body}
                createdAt={tweet.createdAt}
                username={tweet.username}
                likeCount={tweet.likeCount}
                commentCount={tweet.commentCount}
                tweetId={tweet.tweetId}
                history={this.props.history}
                key={tweet.createdAt}
                style={{ width: '90%', margin: '1rem auto' }}
                likeTweet={(tweetId) => this.likeTweet(tweetId)}
                unlikeTweet={(tweetId) => this.unlikeTweet(tweetId)}
                expand
                onClick={() => this.onClick(tweet.tweetId)}
              />
            ))}
          </div>
        )}
        {this.state.show && (
          <Fragment>
            <Backdrop onClick={this.closeFullTweet} />
            <FullTweet
              like={this.like}
              unlike={this.unlike}
              incComments={this.incCommentCount}
              decComments={this.decCommentCount}
            />
          </Fragment>
        )}
      </div>
    ) : (
      <p>Loading</p>
    );
    return user;
  }
}
const mapStateToProps = (state) => ({
  user: state.user.userData,
});
const mapActionsToProps = (dispatch) => ({
  setUser: () => dispatch(getUserData()),
  incCommentCount: (tweetId) =>
    dispatch({ type: INC_COMMENT_COUNT, payload: tweetId }),
  decCommentCount: (tweetId) =>
    dispatch({ type: DEC_COMMENT_COUNT, payload: tweetId }),
  likeTweet: (tweetId) => dispatch(likeATweet(tweetId)),
  unlikeTweet: (tweetId) => dispatch(unlikeATweet(tweetId)),
  deleteTweetAction: (tweetId) => dispatch(deleteTweet(tweetId)),
});
export default connect(mapStateToProps, mapActionsToProps)(user);
