import React from 'react';
import styles from './TweetSkeleton.module.css';
const TweetSkeleton = () => {
  return (
    <div className={styles.tweet}>
      <div className={styles.tweetHeader}>
        <div className={styles.tweetInfo}>
          <div className={styles.tweetImg}></div>
          <h4 className={styles.username}></h4>
        </div>
      </div>

      <div className={styles.tweetBody}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.tweetDate}></div>
      <div className={styles.tweetTime}></div>
    </div>
  );
};

export default TweetSkeleton;
