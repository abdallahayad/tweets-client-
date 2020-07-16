import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { userReducer } from './reducers/userReducer';
import thunk from 'redux-thunk';

const initialState = {};
const middleware = [thunk];
const reducers = combineReducers({ user: userReducer });

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
