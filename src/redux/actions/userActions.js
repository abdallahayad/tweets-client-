import axios from 'axios';
import {
  SET_AUTHENTICATED,
  SET_USER,
  SET_ERRORS,
  LOADING,
  SET_UNAUTHENTICATED,
  CLEAR_ERRORS,
} from '../types';
export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post('/api/login', userData)
    .then((res) => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_AUTHENTICATED });
      setAuthorizationHeader(res.data.token, res.data.refreshToken);
      dispatch(getUserData());
      history.push('/');
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};
export const signupUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING });
  axios
    .post('/api/signup', userData)
    .then((res) => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_AUTHENTICATED });
      setAuthorizationHeader(res.data.token, res.data.refreshToken);
      dispatch(getUserData());
      history.push('/');
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err.response.data }));
};

export const getUserData = () => (dispatch) => {
  axios
    .get('/api/user')
    .then((res) => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch((err) => console.log(err));
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  localStorage.removeItem('refreshToken');
  dispatch({ type: SET_UNAUTHENTICATED });
  window.location.href = '/';
};

const setAuthorizationHeader = (token, refreshToken) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  localStorage.setItem('refreshToken', refreshToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
