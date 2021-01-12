import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {logOut} from '../../redux/actions';
import styles from './Menu.module.sass';

const Menu = (props) => {
    const logOut = () =>{
        window.localStorage.removeItem('accessToken');
        props.logOut();
    }
    return (
        <div className={styles.mainContainer}>
            <div className={styles.menuHeader}>
                <div className={styles.menuTitle}>Menu</div>
                <div className={styles.btnClose} onClick={props.close}> X </div>
            </div>           
            <hr/>
            <Link to={'/login'} className={styles.menuItem} onClick={logOut}>
                Log out
                </Link> 
       
        </div>
    );
}

const mapDispatchToProps = {
    logOut: logOut}

export default connect(null, mapDispatchToProps)(Menu);
