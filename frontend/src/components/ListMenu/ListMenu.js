import React from 'react';
import styles from './ListMenu.module.sass';

const ListMenu = (props) => {
    return (
        <div className={styles.mainContainer}>
        <div className={styles.menuHeader}>
            <div className={styles.menuTitle}>   </div>
            <div className={styles.btnClose} onClick={()=>props.close(false)}> X </div>
        </div>           
        <hr/>
        <div className={styles.menuItem} onClick={props.delete}>
            Delete list
            </div> 
   
    </div>
    );
}

export default ListMenu;
