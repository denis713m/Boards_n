import React, { useState } from 'react';
import { connect } from 'react-redux';
import { listDelete, listRename } from '../../redux/actions';
import RenameListForm from '../RenameListForm/RenameListForm';
import ListMenu from '../ListMenu/ListMenu';
import CardWindow from '../CardWindow/CardWindow';
import styles from './CardsList.module.sass';
import { change } from 'redux-form';

const CardsList = (props) => {
    const [isRenameList, changeRenameList] = useState(false);
    const [isListMenu, changeListMenu] = useState(false);
    const [isCardWindow, changeShowCardWindow] = useState(false);
    const [isAddCard, changeAddCardShow] = useState(false);
    const renameList = (values) => {
        props.listRename({
            name: values.name,
            id: props.list.id,
            user: props.user,
        });
    };
    const deleteList = () => {
        props.listDelete({
            list: props.list.id,
            user: props.user,
        });
    };
    const showCardWindow = () => {};
    return (
        <div className={styles.listContainer}>
            {!isRenameList && (
                <div className={styles.titleContainer}>
                    <div className={styles.listTitle} onDoubleClick={() => changeRenameList(true)}>
                        {props.list.name}
                    </div>
                    <div onClick={() => changeListMenu(true)}>
                        <span className={styles.listMenu}></span>
                        <span className={styles.listMenu}></span>
                        <span className={styles.listMenu}></span>
                    </div>
                    {isListMenu && <ListMenu list={props.list.id} close={changeListMenu} delete={deleteList} />}
                </div>
            )}
            {isRenameList && (
                <RenameListForm close={() => changeRenameList(false)} onSubmit={renameList} name={props.list.name} />
            )}

            <div className={styles.cardContainer}>
                <div className={styles.card} onClick={() => changeShowCardWindow(true)}>
                    In progress
                </div>
                <div className={styles.card}>In progress</div>
                <div className={styles.card}>In progress</div>
            </div>
            {isAddCard ? (
                <button className={styles.btnSaveCard} onClick={() => changeAddCardShow(false)}>
                    Save
                </button>
            ) : (
                <button className={styles.btnAddCard} onClick={() => changeAddCardShow(true)}>
                    Add a card...
                </button>
            )}
            {isCardWindow && <CardWindow close={() => changeShowCardWindow(false)} />}
        </div>
    );
};

const mapStateToProps = (state) => {
    return { user: state.user.user.userId };
};

const mapDispatchToprops = {
    listDelete: listDelete,
    listRename: listRename,
};

export default connect(mapStateToProps, mapDispatchToprops)(CardsList);
