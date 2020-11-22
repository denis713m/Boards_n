import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.sass';
import Menu from '../Menu/Menu';

const Header = () => {

    const [isMenuShow, changeMenuDisplay] = useState(false);

    const changeDisplayMenu = ()=>changeMenuDisplay(!isMenuShow)


    return (
        <div className={styles.mainContainer}>
            <Link to={'/'} className={styles.btnBoards}>
                <img src={'/dash-icon.jpg'} className={styles.icon}></img>
                <p>Boards</p>
                </Link>
            <div className={styles.btnMenu} onClick={changeDisplayMenu}>
                T
            </div>
            {isMenuShow && <Menu close={changeDisplayMenu}/>}
        </div>
    );
}

export default Header;
