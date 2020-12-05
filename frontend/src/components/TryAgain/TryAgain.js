import React from 'react';
import styles from './TryAgain.module.sass';
import classNames from 'classnames';

const TryAgain = (props) => {
    return (
        <div className={styles.container} onClick={() => props.getData()}>
            <span className={styles.tryAgain}>Server Error. Try again</span>
            <img src={'/reload.png'} className={classNames(styles.tryAgain, styles.icon)}></img>
        </div>
    );
};

export default TryAgain;
