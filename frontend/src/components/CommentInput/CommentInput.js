import React from 'react';
import classNames from 'classnames';
import styles from './CommentInput.module.sass';

const CommentInput = (props) => {
  const {label, input, type, valid,notvalid,container,inputfield, warning, meta: {touched, error}} = props;

  return (
      <div className={container}>
          {(touched && (error && <span className={warning}>{error}</span>))}
          <textarea {...input} placeholder={label} type={type} 
                 className={classNames(inputfield, {[notvalid]: touched && error,
                                                [valid]: touched && !error})}/>
      </div>
  )
};

CommentInput.defaultProps = {
      notvalid: styles.notValid,
      valid: styles.valid,
      container: styles.container,
      inputfield: styles.input,
      warning: styles.fieldWarning
};

export default CommentInput;