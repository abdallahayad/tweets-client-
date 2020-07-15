import React from 'react';
import './AuthProfile.css';
const AuthProfile = props => {
  return (
    <div className='auth-profile'>
      <div className='auth-profile-img'>
        <img src={props.profileImage} alt='profile' />
      </div>
      <h2>@{props.username}</h2>
      <h4 style={{ textTransform: 'capitalize' }}>
        <i class='fa fa-map-marker' aria-hidden='true'></i> {props.location}
      </h4>
    </div>
  );
};

export default AuthProfile;
