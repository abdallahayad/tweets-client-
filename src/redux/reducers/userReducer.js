import {
  SET_AUTHENTICATED,
  SET_USER,
  SET_ERRORS,
  LOADING,
  SET_UNAUTHENTICATED,
  SHOW_CREATE_TWEET,
  CREATE_TWEET_ACTION,
  UNSHOW_CREATE_TWEET,
  EDIT_BIO,
  EDIT_PROFILE_IMG,
  INC_COMMENT_COUNT,
  DEC_COMMENT_COUNT,
  INC_LIKE_COUNT,
  DEC_LIKE_COUNT,
  LIKE_TWEET,
  UNLIKE_TWEET,
  CLEAR_ERRORS,
  DELETE_TWEET,
  ADD_TWEET_COMMENTS,
} from '../types';
const intialState = {
  userData: null,
  errors: null,
  auth: false,
  loading: false,
  showCreate: false,
};

export const userReducer = (state = intialState, action) => {
  switch (action.type) {
    case LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case SET_AUTHENTICATED: {
      return {
        ...state,
        auth: true,
        loading: false,
      };
    }
    case CLEAR_ERRORS: {
      return {
        ...state,
        errors: null,
      };
    }
    case DELETE_TWEET: {
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: state.userData.tweets.filter(
            (tweet) => tweet.tweetId !== action.payload
          ),
        },
      };
    }
    case ADD_TWEET_COMMENTS: {
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: state.userData.tweets.map((tweet) => {
            if (tweet.tweetId === action.payload.tweetId) {
              tweet = { ...tweet, comments: action.payload.comments };
            }
            return tweet;
          }),
        },
      };
    }
    case LIKE_TWEET: {
      return {
        ...state,
        userData: {
          ...state.userData,
          likes: state.userData.likes.concat(action.payload),
        },
      };
    }
    case UNLIKE_TWEET: {
      return {
        ...state,
        userData: {
          ...state.userData,
          likes: state.userData.likes.filter(
            (like) => like.tweetId !== action.payload
          ),
        },
      };
    }
    case EDIT_BIO: {
      return {
        ...state,
        userData: {
          ...state.userData,
          credentials: {
            ...state.userData.credentials,
            ...action.payload,
          },
        },
      };
    }
    case EDIT_PROFILE_IMG: {
      return {
        ...state,
        userData: {
          ...state.userData,
          credentials: {
            ...state.userData.credentials,
            profileImage: action.payload,
          },
          tweets: state.userData.tweets.map((tweet) => {
            if (tweet.username === state.userData.credentials.username) {
              tweet.userImage = action.payload;
            }
            return tweet;
          }),
        },
      };
    }
    case CREATE_TWEET_ACTION: {
      return {
        ...state,
        loading: false,
        userData: {
          ...state.userData,
          tweets: state.userData.tweets.concat(action.payload),
        },
      };
    }
    case INC_COMMENT_COUNT: {
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: state.userData.tweets.map((tweet) => {
            if (tweet.tweetId === action.payload) {
              tweet.commentCount++;
            }
            return tweet;
          }),
        },
      };
    }
    case DEC_COMMENT_COUNT: {
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: state.userData.tweets.map((tweet) => {
            if (tweet.tweetId === action.payload) {
              tweet.commentCount--;
            }
            return tweet;
          }),
        },
      };
    }
    case INC_LIKE_COUNT: {
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: state.userData.tweets.map((tweet) => {
            if (tweet.tweetId === action.payload) {
              tweet.likeCount++;
            }
            return tweet;
          }),
        },
      };
    }
    case DEC_LIKE_COUNT: {
      return {
        ...state,
        userData: {
          ...state.userData,
          tweets: state.userData.tweets.map((tweet) => {
            if (tweet.tweetId === action.payload) {
              tweet.likeCount--;
            }
            return tweet;
          }),
        },
      };
    }
    case SHOW_CREATE_TWEET: {
      return {
        ...state,
        showCreate: true,
      };
    }
    case UNSHOW_CREATE_TWEET: {
      return {
        ...state,
        showCreate: false,
      };
    }
    case SET_UNAUTHENTICATED: {
      return intialState;
    }
    case SET_USER: {
      return {
        ...state,
        userData: action.payload,
        errors: null,
      };
    }
    case SET_ERRORS: {
      return {
        ...state,
        errors: action.payload,
        loading: false,
      };
    }
    default:
      return state;
  }
};
