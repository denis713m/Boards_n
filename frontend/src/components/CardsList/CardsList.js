import React, {useState} from 'react';
import {connect} from 'react-redux';
import {listDelete} from '../../redux/actions';
import RenameListForm from '../RenameListForm/RenameListForm';
import ListMenu from '../ListMenu/ListMenu';
import styles from './CardsList.module.sass';


const CardsList = (props) => {
    const [isRenameList, changeRenameList]= useState(false);
    const [isListMenu, changeListMenu]= useState(false);
    const renameList = (values)=>{
        changeRenameList(false)
    }
    const deleteList = () =>{
        console.log(props);
        props.listDelete({
            list:props.list.id,
            user:props.user})
    }
    return (
        <>
            { props.list ?
                <div className={styles.listContainer}>
                {!isRenameList && <div className={styles.titleContainer}>
                        <div className={styles.listTitle} onDoubleClick={() => changeRenameList(true)}>{props.list.name}</div>
                        <div onClick={()=>changeListMenu(true)}>
                            <span className={styles.listMenu}></span>
                            <span className={styles.listMenu}></span>
                            <span className={styles.listMenu}></span>
                        </div>
                        {isListMenu && <ListMenu list={props.list.id} close={changeListMenu}
                                                delete={deleteList}/>}
                    </div>}                             
                            {isRenameList && 
                                    <RenameListForm close={() => changeRenameList(false)} 
                                                            onSubmit={renameList} name={props.list.name}/>}

                    <div className={styles.cardContainer}>
                        <div className={styles.card}>In progress</div>
                    </div>
                    <button className={styles.btnAddCard}>Add a card...</button> 
            </div>
            :
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
            </div>}
        </>
    );
}

const mapStateToProps = (state) => {
    return {user: state.user.user.userId,
        };
};

const mapDispatchToprops = {
    listDelete: listDelete
}

export default connect(mapStateToProps, mapDispatchToprops)(CardsList);
