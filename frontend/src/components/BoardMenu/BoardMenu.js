import React from 'react';
import { connect } from 'react-redux';
import styles from './BoardMenu.module.sass';
import Activity from '../Activity/Activity';

const BoardMenu = (props) => {
    const getActivities = () => {        
        return props.activities.map((item) => <Activity item={item} key={item.id} card={styles.card} />);
    };
    return (
        <div className={styles.mainContainer}>
            <div className={styles.menuHeader}>
                <div className={styles.menuTitle}>Menu</div>
                <div className={styles.btnClose} onClick={props.close}>
                    X
                </div>
            </div>
            <hr />
            {props.canRemove && (
                <>
                    <div className={styles.menuItem} onClick={props.deleteBoard}>
                        Remove board
                    </div>
                    <hr />
                </>
            )}
            <div className={styles.activity}>
                <img src={'/activity.jpg'} className={styles.icon}></img>
                <p>Activity</p>
            </div>
            {getActivities()}
        </div>
    );
};

const mapStateToProps = (state) => {
    return { activities: state.boards.activities };
};

export default connect(mapStateToProps)(BoardMenu);
