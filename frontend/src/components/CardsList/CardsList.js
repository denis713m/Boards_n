import React, { useState } from 'react';
import { connect } from 'react-redux';
import { listDelete, listRename, cardCreate, chooseCard, cardDelete } from '../../redux/actions';
import RenameListForm from '../RenameListForm/RenameListForm';
import ListMenu from '../ListMenu/ListMenu';
import CardWindow from '../CardWindow/CardWindow';
import CraeteCardForm from '../CreateCardForm/CraeteCardForm';
import styles from './CardsList.module.sass';

const CardsList = (props) => {
    const [isRenameList, changeRenameList] = useState(false);
    const [isListMenu, changeListMenu] = useState(false);
    const [isCardWindow, changeShowCardWindow] = useState(false);
    const [isAddCard, changeAddCardShow] = useState(false);
    const renameList = (values) => {
        props.listRename({
            name: values.name,
            id: props.list.id,
            user: props.user.userId,
        });
    };
    const deleteList = () => {
        props.listDelete({
            list: props.list.id,
            user: props.user.userId,
        });
    };
    const createCard = (values) => {
        props.cardCreate({
            ...values,
            list: props.list.id,
            user: props.user.userId,
            board: props.board,
        });
        changeAddCardShow(false);
    };
    const getCards = () => {
        const cards = [];
        if (props.cards)
            props.cards.forEach((element) => {
                if (element.listId === props.list.id)
                    cards.push(
                        <div className={styles.card} key={element.id} data-id={element.id} onClick={showCardWindow}>
                            {element.name}
                        </div>
                    );
            });
        return cards;
    };
    const showCardWindow = (e) => {
        const currentCardId = e.target.getAttribute('data-id');
        let card = {};
        props.cards.forEach((item) => {
            if (item.id === currentCardId) card = item;
        });
        card.listName = props.list.name;
        card.userName = props.user.firstName;
        card.userEmail = props.user.email;
        props.chooseCard(card);
        changeShowCardWindow(true);
    };
    const removeCard = () => {
        props.cardDelete({ card: props.currentCard.id });
        changeShowCardWindow(false);
    };
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
                {getCards()}
            </div>
            {isAddCard ? (
                <CraeteCardForm onSubmit={createCard} close={() => changeAddCardShow(false)} />
            ) : (
                <button className={styles.btnAddCard} onClick={() => changeAddCardShow(true)}>
                    Add a card...
                </button>
            )}
            {isCardWindow && <CardWindow close={() => changeShowCardWindow(false)} remove={removeCard} />}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        cards: state.card.cards,
        board: state.boards.currentBoard.id,
        currentCard: state.card.currentCard,
    };
};

const mapDispatchToprops = {
    listDelete: listDelete,
    listRename: listRename,
    cardCreate: cardCreate,
    chooseCard: chooseCard,
    cardDelete: cardDelete,
};

export default connect(mapStateToProps, mapDispatchToprops)(CardsList);
