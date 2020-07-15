import React, { Fragment } from 'react';
import Spinner from '../Spinner/Spinner';
import styles from './CreateTweet.module.css';
import Backdrop from '../../util/Backdrop/Backdrop';
const createTweet = (props) => {
  return (
    <Fragment>
      <Backdrop onClick={props.unShowCreate} />
      <div className={styles.form}>
        <textarea
          className={styles.textArea}
          value={props.value}
          onChange={props.onChange}
        />
        <button className={styles.createTweetButton} onClick={props.onClick}>
          {props.loading ? <Spinner /> : 'Tweet'}
        </button>
      </div>
    </Fragment>
  );
};

export default createTweet;
