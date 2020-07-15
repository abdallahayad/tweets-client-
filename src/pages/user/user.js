import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUserData } from '../../redux/actions/userActions';
import Tweet from '../../components/Tweet/Tweet';
import styles from './user.module.css';
class user extends Component {
  state = {
    user: null,
  };
  componentDidMount() {
    const username = this.props.match.params.username;
    axios.get(`/api/user/${username}`).then((res) => {
      this.setState({ user: res.data });
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
  follow = () => {
    axios
      .get(`/api/${this.state.user.credentials.username}/follow`)
      .then(() => {
        this.props.setUser();
      });
  };
  render() {
    let followButton;
    if (this.state.user && this.props.user) {
      if (
        !this.props.user.credentials.following.includes(
          this.state.user.credentials.username
        ) &&
        this.state.user.credentials.username !==
          this.props.user.credentials.username
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
      const { job, location, birthDate } = this.state.user.credentials;
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
            <img src={this.state.user.credentials.profileImage} alt='profile' />
            {followButton}
          </div>
          {bio}
        </div>
        <div className={styles.tweets}>
          {this.state.user.tweets.map((tweet) => (
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
            />
          ))}
        </div>
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
});
export default connect(mapStateToProps, mapActionsToProps)(user);
