import React from 'react';
import styles from './Menu.module.sass';
import {connect} from 'react-redux';
import {logOut} from '../../redux/actions';

const Menu = (props) => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.menuHeader}>
                <div className={styles.menuTitle}>Menu</div>
                <div className={styles.btnClose} onClick={props.close}> X </div>
            </div>           
            <hr/>
            <div className={styles.menuItem} onClick={props.logOut}>
                Log out
                </div> 
       
        </div>
    );
}

const mapDispatchToProps = {
    logOut: logOut}

export default connect(null, mapDispatchToProps)(Menu);
