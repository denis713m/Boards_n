import React from 'react';
import {Link} from 'react-router-dom';
import styles from './BoardMenu.module.sass';

const BoardMenu = (props) => {

    return (
        <div className={styles.mainContainer}>
            <div className={styles.menuHeader}>
                <div className={styles.menuTitle}>Menu</div>
                <div className={styles.btnClose} onClick={props.close}> X </div>
            </div>
            <hr />
            <div className={styles.menuItem} onClick={props.deleteBoard}>Remove board </div>
            <hr />
            <div className={styles.activity}> 
                <img src={'/activity.jpg'} className={styles.icon}></img>
                <p>Activity</p>
            </div>
            <div className={styles.activityItem}>
                <div className={styles.badge}>
                    T
                </div>
                <div className={styles.description}>
                    <span className={styles.author}>test@freshcodeit.com</span>
                    <span className={styles.action}> added </span>
                    <Link className={styles.card}> Card5</Link>
                    <span className={styles.action}> to Queue </span>
                    <div className={styles.time}>
                        5 hours ago
                    </div>
                </div>
            </div>
        </div>
    );
}


export default BoardMenu;
