import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { listDelete, listRename, cardCreate, chooseCard, cardDelete, replaceCard } from '../../redux/actions';
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
    const baseInfo = {
        user: props.user.userId,
        board: props.board,
        list: props.list.name,
        listId: props.list.id,
        authorInfo: {
            name: props.user.firstName,
            email: props.user.email,
        },
    };
    const renameList = (values) => {
        props.listRename({
            name: values.name,
            ...baseInfo,
        });
        changeRenameList(false);
    };
    const deleteList = () => {
        props.listDelete({
            ...baseInfo,
        });
    };
    const createCard = (values) => {
        props.cardCreate({
            ...values,
            ...baseInfo,
        });
        changeAddCardShow(false);
    };

    const getCards = () => {
        const cards = [];
        if (props.cards)
            props.cards.forEach((element) => {
                if (element.listId === props.list.id)
                    cards.push(
                        <Draggable key={element.id} draggableId={element.id} index={element.index}>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <div
                                        className={classNames(styles.card, { [styles.drag]: snapshot.isDragging })}
                                        data-id={element.id}
                                        onClick={showCardWindow}
                                    >
                                        {element.name}
                                    </div>
                                </div>
                            )}
                        </Draggable>
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
        props.cardDelete({
            card: props.currentCard.id,
            name: props.currentCard.name,
            ...baseInfo,
        });
        changeShowCardWindow(false);
    };
    return (
        <div className={styles.listContainer}>
            <div>
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
                    <RenameListForm
                        close={() => changeRenameList(false)}
                        onSubmit={renameList}
                        name={props.list.name}
                    />
                )}
            </div>
            <Droppable droppableId={props.list.id}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className={styles.droppable}>
                        {getCards()}
                     {provided.placeholder}
                        {props.list.id === props.placeholderProps.droppableId && snapshot.isDraggingOver && (
                            <div className={styles.placeholder}
                                style={{
                                    position: 'absolute',
                                    top: props.placeholderProps.clientY,
                                    left: props.placeholderProps.clientX,
                                    height: props.placeholderProps.clientHeight,                                   
                                    width: props.placeholderProps.clientWidth,
                                }}
                            />
                        )}
                        {isAddCard ? (
                            <CraeteCardForm onSubmit={createCard} close={() => changeAddCardShow(false)} />
                        ) : (
                            <button className={styles.btnAddCard} onClick={() => changeAddCardShow(true)}>
                                Add a card...
                            </button>
                        )}
                        {isCardWindow && <CardWindow close={() => changeShowCardWindow(false)} remove={removeCard} />}
                    </div>
                )}
            </Droppable>
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
