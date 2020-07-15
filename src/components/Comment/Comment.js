import React from 'react';
import dayjs from 'dayjs';
import styles from './Comment.module.css';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
const Comment = (props) => {
  const {
    body,
    commentId,
    createdAt,
    userImage,
    username,
    tweetId,
  } = props.comment;

  return (
    <div>
      <div className={styles.comment}>
        <div className={styles.user}>
          <img src={userImage} alt='user' />
          <p>{username}</p>
        </div>
        <div className={styles.commentBody}>
          <p className={styles.body}>{body}</p>
        </div>
      </div>
      <div className={styles.commentRight}>
        {props.authUser === username ? (
          <button onClick={() => props.deleteComment(commentId, tweetId)}>
            <i className='far fa-trash-alt fa-sm'></i>
          </button>
        ) : null}
        <div className={styles.dateBody}>
          <p>{dayjs(createdAt).fromNow()}</p>
        </div>
      </div>

      {props.commentsLength - 1 > props.index && <hr className={styles.hr} />}
    </div>
  );
};

export default Comment;
