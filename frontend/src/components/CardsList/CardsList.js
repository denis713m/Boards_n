import React, {useState} from 'react';
import RenameListForm from '../RenameListForm/RenameListForm';
import styles from './CardsList.module.sass';


const CardsList = () => {
    const [isRenameList, changeRenameList]= useState(false);
    const renameList = async (values)=>{
        changeRenameList(false)
    }
    return (
        <div className={styles.listContainer}>
       {!isRenameList && <div className={styles.listTitle} onDoubleClick={() => changeRenameList(true)}>In progress</div>}                             
                {isRenameList && 
                        <RenameListForm close={() => changeRenameList(false)} 
                                                onSubmit={renameList} name={'In progress'}/>}

        <div className={styles.cardContainer}>
            <div className={styles.card}>In progress</div>
            <div className={styles.card}>In progress</div>
            <div className={styles.card}>In progress</div>
        </div>
        <button className={styles.btnAddCard}>Add a card...</button> 
    </div>
    );
}

export default CardsList;
