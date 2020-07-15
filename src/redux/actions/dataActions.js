import {
  CREATE_TWEET_ACTION,
  LOADING,
  UNSHOW_CREATE_TWEET,
  EDIT_BIO,
  EDIT_PROFILE_IMG,
  LIKE_TWEET,
  UNLIKE_TWEET,
  INC_LIKE_COUNT,
  DEC_LIKE_COUNT,
  DELETE_TWEET,
  ADD_TWEET_COMMENTS,
} from '../types';
import axios from 'axios';
export const createTweetAction = (tweet) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post('/tweet/add', { body: tweet })
    .then((res) => {
      dispatch({ type: CREATE_TWEET_ACTION, payload: res.data });
      dispatch({ type: UNSHOW_CREATE_TWEET });
    })
    .catch((err) => console.log(err));
};
export const deleteTweet = (tweetId) => (dispatch) => {
  axios
    .delete(`/tweet/${tweetId}`)
    .then((res) => {
      dispatch({ type: DELETE_TWEET, payload: res.data.tweetId });
    })
    .catch((err) => console.log(err));
};
export const editBio = (bio) => (dispatch) => {
  axios
    .post('/user/bio', bio)
    .then((res) => {
      dispatch({ type: EDIT_BIO, payload: res.data });
    })
    .catch((err) => console.log(err));
};

export const editProfileImage = (formData, history) => (dispatch) => {
  axios
    .post('/user/profilepic', formData)
    .then((res) => {
      dispatch({ type: EDIT_PROFILE_IMG, payload: res.data.profileImage });
      history.push('/');
    })
    .catch((err) => console.log(err));
};
export const getFulltweetData = (tweetId) => (dispatch) => {
  axios.get(`/tweet/${tweetId}`).then((res) =>
    dispatch({
      type: ADD_TWEET_COMMENTS,
      payload: { comments: res.data.comments, tweetId: tweetId },
    })
  );
};
export const likeATweet = (tweetId) => (dispatch) => {
  axios.get(`/tweet/${tweetId}/like`).then((res) => {
    dispatch({ type: LIKE_TWEET, payload: res.data.likeDoc });
    dispatch({ type: INC_LIKE_COUNT, payload: res.data.likeDoc.tweetId });
  });
};
export const unlikeATweet = (tweetId) => (dispatch) => {
  axios.get(`/tweet/${tweetId}/unlike`).then((res) => {
    dispatch({ type: UNLIKE_TWEET, payload: res.data.tweetId });
    dispatch({ type: DEC_LIKE_COUNT, payload: res.data.tweetId });
  });
};
