import React from 'react';
import styles from './StartCreate.module.css';
const StartCreate = (props) => {
  return (
    <div className={styles.startCreate}>
      <div className={styles.userImageDiv}>
        <img src={props.userImage} alt='user' className={styles.userImage} />
      </div>
      <div className={styles.startCreateClick} onClick={props.onClick}>
        Tweet what's on your mind
      </div>
    </div>
  );
};

export default StartCreate;
