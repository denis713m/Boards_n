import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import _ from 'lodash';
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
        userId: props.user.userId,
        boardId: props.board.id,
        list: props.list.name,
        listId: props.list.id,
        authorInfo: {
            name: props.user.firstName,
            email: props.user.email,
        },
    };
    const renameList = (values) => {
        if (values.name !== props.list.name) {
            props.listRename({
                name: values.name,
                boardAuthor: props.board.user,
                ...baseInfo,
                showRenameForm: changeRenameList,
            });
        } else {
            changeRenameList(false);
        }
    };
    const deleteList = () => {
        props.listDelete({
            ...baseInfo,
            boardAuthor: props.board.user,
        });
    };
    const createCard = (values) => {
        props.cardCreate({
            ...values,
            ...baseInfo,
            showCreateCardForm: changeAddCardShow,
        });
    };

    const getCards = () => {
        const cardsInList = props.cards.filter((card) => card.listId === props.list.id);
        return cardsInList.map((card) => (
            <Draggable key={card.id} draggableId={`${card.id}`} index={card.index}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div
                            className={classNames(styles.card, { [styles.drag]: snapshot.isDragging })}
                            data-id={card.id}
                            onClick={(e) => showCardWindow(e, card.id)}
                        >
                            {card.name}
                        </div>
                    </div>
                )}
            </Draggable>
        ));
    };

    const showCardWindow = (e, id) => {
        const card = _.find(props.cards, { id: id });
        card.listName = props.list.name;
        card.userName = props.user.firstName;
        card.userEmail = props.user.email;
        props.chooseCard(card);
        changeShowCardWindow(true);
    };
    const removeCard = () => {
        props.cardDelete({
            removeCard: props.currentCard,
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
                        {(props.user.userId === props.list.userId || props.user.userId === props.board.user) && (
                            <>
                                <div onClick={() => changeListMenu(true)}>
                                    <span className={styles.listMenu}></span>
                                    <span className={styles.listMenu}></span>
                                    <span className={styles.listMenu}></span>
                                </div>
                                {isListMenu && (
                                    <ListMenu list={props.list.id} close={changeListMenu} delete={deleteList} />
                                )}
                            </>
                        )}
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
            <Droppable droppableId={`${props.list.id}`}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.droppable}
                        onClick={() => changeRenameList(false)}
                    >
                        {getCards()}
                        {provided.placeholder}
                        {props.list.id == props.placeholderProps.droppableId && snapshot.isDraggingOver && (
                            <div
                                className={styles.placeholder}
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
        board: state.boards.currentBoard,
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
