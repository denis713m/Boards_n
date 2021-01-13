import React from 'react';
import styles from './TryAgain.module.sass';
import classNames from 'classnames';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';

const TryAgain = (props) => {
    return (
        <div className={styles.container} onClick={() => props.getData()}>
            {props.errorMessage === ERROR_MESSAGES.default ? (
                <>
                    <span className={styles.tryAgain}>Server Error. Try again</span>
                    <img src={'/reload.png'} className={classNames(styles.tryAgain, styles.icon)}></img>
                </>
            ) : (
                <span className={styles.tryAgain}>{props.errorMessage}</span>
            )}
        </div>
    );
};

export default TryAgain;
