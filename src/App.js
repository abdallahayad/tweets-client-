import React from 'react';
import jwtDecode from 'jwt-decode';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { getUserData } from './redux/actions/userActions';
import { SET_AUTHENTICATED } from './redux/types';
import store from './redux/store';
import { Provider } from 'react-redux';
import login from './pages/login';
import signup from './pages/signup';
import home from './pages/home';
import user from './pages/user/user';
import profile from './pages/profile/profile';
import './App.css';
import Header from './components/Header/Header';
import axios from 'axios';
let token = localStorage.FBIdToken;
let refreshToken = localStorage.refreshToken;
axios.defaults.baseURL =
  'https://us-central1-my-social-app-fdb68.cloudfunctions.net/api';
if (token) {
  const decodedToken = jwtDecode(localStorage.getItem('FBIdToken'));
  if (Date.now() >= decodedToken.exp * 1000) {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.post('/refreshtoken', { refresh_token: refreshToken }).then((res) => {
      localStorage.setItem('FBIdToken', `Bearer ${res.data.id_token}`);
      localStorage.setItem('refreshToken', res.data.refresh_token);
      token = localStorage.FBIdToken;
      axios.defaults.headers.common['Authorization'] = token;

      store.dispatch(getUserData());
    });
  } else {
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch({ type: SET_AUTHENTICATED });
    store.dispatch(getUserData());
  }
}

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className='App'>
          <Header />
          <Switch>
            <Route component={user} path='/users/:username' exact />
            <Route component={signup} path='/signup' exact />
            <Route component={login} path='/login' exact />
            <Route component={profile} path='/profile' exact />

            <Route component={home} path='/' exact />
            {/*404 page*/}
            {/* <Route render={() => <h2>Not Found</h2>} /> */}
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
