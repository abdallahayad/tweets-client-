import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userActions';
import { SHOW_CREATE_TWEET } from '../../redux/types';
import styles from './Header.module.css';
import Search from '../Search/Search';
const Header = (props) => {
  const headerContent = props.auth ? (
    props.userData ? (
      <ul>
        <li>
          <Link to='/profile' className={styles.headerAuthProfile}>
            <img src={props.userData.credentials.profileImage} alt='profile' />
          </Link>
        </li>
        <li>
          <Link to='/logout' onClick={props.logoutUser}>
            Logout
          </Link>
        </li>
      </ul>
    ) : (
      <ul>
        <li>
          <div className={styles.loadingImg}></div>
        </li>

        <li>
          <div className={styles.loadingHeaderAction}></div>
        </li>
      </ul>
    )
  ) : (
    <ul>
      <li>
        <Link to='/signup'>Signup</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <header className={styles.header}>
      <h2>
        <Link style={{ color: 'white', textDecoration: 'none' }} to='/'>
          Tweets
        </Link>
      </h2>
      {props.auth && <Search />}
      <div className={styles.navItems}>{headerContent}</div>
    </header>
  );
};
const mapStateToProps = ({ user: { auth, userData, showCreate } }) => ({
  auth,
  userData,
  showCreate,
});
const mapDispatchToProps = (dispatch) => {
  return {
    showCreateTweet: () => dispatch({ type: SHOW_CREATE_TWEET }),
    logoutUser: () => dispatch(logoutUser()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
