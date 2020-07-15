import React, { Fragment, PureComponent } from 'react';
import styles from './home.module.css';
import Tweet from '../components/Tweet/Tweet';
import TweetSkeleton from '../components/TweetSkeleton/TweetSkeleton';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { SHOW_CREATE_TWEET, UNSHOW_CREATE_TWEET } from '../redux/types';
import StartCreate from '../components/CreateTweet/StartCreate/StartCreate';
import { createTweetAction } from '../redux/actions/dataActions';
import CreateTweet from '../components/CreateTweet/CreateTweet';
class Home extends PureComponent {
  state = {
    tweetBody: '',
  };
  onChange = (e) => {
    this.setState({ tweetBody: e.target.value });
  };

  render() {
    const tweetSkeleton = [...Array(5)].map((e, i) => (
      <TweetSkeleton key={i} />
    ));
    const home = this.props.auth ? (
      this.props.userData ? (
        <Fragment>
          <div className={styles.homeAuth}>
            {this.props.showCreate ? (
              <CreateTweet
                unShowCreate={this.props.unShowCreate}
                loading={this.props.loading}
                value={this.state.tweetBody}
                onChange={this.onChange}
                onClick={() => this.props.createTweet(this.state.tweetBody)}
              />
            ) : null}
            <div className={styles.homeAuthTweets}>
              <StartCreate
                userImage={this.props.userData.credentials.profileImage}
                onClick={this.props.showCreateAction}
              />
              {this.props.userData.tweets
                .sort((a, b) => {
                  return a.createdAt < b.createdAt
                    ? 1
                    : a.createdAt > b.createdAt
                    ? -1
                    : 0;
                })
                .map((tweet) => (
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
                  />
                ))}
            </div>
          </div>
        </Fragment>
      ) : (
        <div className={styles.homeAuth}>
          <div className={styles.homeAuthTweets}>{tweetSkeleton}</div>
        </div>
      )
    ) : (
      <div className={styles.homeUnauth}>
        <div>
          <h1>Tweets</h1>
          <h2>A Better Way To Communicate</h2>
          <h3>
            <NavLink className={styles.homeUnauthNavs} to='/signup'>
              Signup
            </NavLink>{' '}
            for more
          </h3>
          <h3>
            Already a user{' '}
            <NavLink className={styles.homeUnauthNavs} to='/login'>
              Login
            </NavLink>
          </h3>
        </div>
      </div>
    );
    return home;
  }
}
const mapStateToProps = ({
  user: { auth, userData, showCreate, loading },
}) => ({
  auth,
  userData,
  showCreate,
  loading,
});
const mapDispatchToProps = (dispatch) => ({
  unShowCreate: () => dispatch({ type: UNSHOW_CREATE_TWEET }),
  createTweet: (tweetBody) => dispatch(createTweetAction(tweetBody)),
  showCreateAction: () => dispatch({ type: SHOW_CREATE_TWEET }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
