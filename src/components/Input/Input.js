import React from 'react';
import styles from './Input.module.css';
const Input = (props) => {
  return (
    <div>
      <label className='label'>{props.label}</label>
      <input
        type={props.type}
        name={props.name}
        className={styles.input}
        style={props.styles ? props.styles : null}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder ? props.placeholder : null}
      />
      {props.error && <p className={styles.error}>{props.error}</p>}
    </div>
  );
};

export default Input;
