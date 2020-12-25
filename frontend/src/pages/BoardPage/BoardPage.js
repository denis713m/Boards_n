import React, { useState, useEffect } from 'react';
import styles from './BoardPage.module.sass';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import fp from 'lodash/fp';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from '../../components/Header/Header';
import {
    getBoardById,
    boardRename,
    boardDelete,
    listCreate,
    replaceCard,
    replaceCardInList,
} from '../../redux/actions';
import RenameBoardForm from '../../components/RenameBoardForm/RenameBoardForm';
import CreateListForm from '../../components/CreateListForm/CreateListForm';
import Spinner from '../../components/Spinner/Spinner';
import CardsList from '../../components/CardsList/CardsList';
import BoardMenu from '../../components/BoardMenu/BoardMenu';
import TryAgain from '../../components/TryAgain/TryAgain';
import Error from '../../components/Error/Error';

const BoardPage = (props) => {
    const params = Number(useParams().id);
    useEffect(() => {
        props.getBoardById(params);
    }, []);
    let baseInfo;
    if (props.user)
        baseInfo = {
            boardId: params,
            userId: props.user.userId,
            authorInfo: {
                name: props.user.firstName,
                email: props.user.email,
            },
        };
    const [isRenameBoard, changeRenameBoard] = useState(false);
    const [isBoardMenu, changeBoardMenu] = useState(false);
    const [placeholderProps, setPlaceholderProps] = useState({});

    const changeBoardName = (values) => {
        props.renameBoard({
            ...values,
            id: props.board.currentBoard.id,
            author: props.user.userId,
            showRenameForm: changeRenameBoard,
        });
    };

    const deleteBoard = () => {
        props.boardDelete({
            id: params,
            author: props.user.userId,
            history: props.history,
        });
    };

    const createList = (values) => {
        props.listCreate({
            ...values,
            ...baseInfo,
            boardAuthor: props.board.currentBoard.user,
        });
    };
    const getLists = () => {
        return props.list.lists.map((element) => (
            <CardsList list={element} key={element.id} placeholderProps={placeholderProps} />
        ));
    };

    const showRenameBoard = () => {
        if (props.board.currentBoard.user === props.user.userId) changeRenameBoard(true);
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        } else {
            source.droppableId === destination.droppableId
                ? props.replaceCardInList({
                      cardId: Number(result.draggableId),
                      listId: Number(destination.droppableId),
                      oldIndex: source.index,
                      newIndex: destination.index,
                  })
                : props.replaceCard({
                      cardId: Number(result.draggableId),
                      newListId: Number(destination.droppableId),
                      oldListId: Number(source.droppableId),
                      oldIndex: source.index,
                      newIndex: destination.index,
                      ...baseInfo,
                  });
        }
        setPlaceholderProps({});
    };
    const queryAttrDraggable = 'data-rbd-drag-handle-draggable-id';
    const queryAttrDroppable = 'data-rbd-droppable-id';
    const getDom = (id, queryAttr) => {
        return document.querySelector(`[${queryAttr}='${id}']`);
    };
    const onDragUpdate = (update) => {
        if (!update.destination) {
            return;
        }

        const draggedDOM = getDom(update.draggableId, queryAttrDraggable);
        const droppableDOM = getDom(update.destination.droppableId, queryAttrDroppable);
        if (!draggedDOM || !droppableDOM) {
            return;
        }
        const { clientHeight, clientWidth } = draggedDOM;

        const clientY =
            parseFloat(window.getComputedStyle(droppableDOM).paddingTop) +
            [...droppableDOM.children].slice(0, update.destination.index).reduce((total, curr) => {
                return total + curr.clientHeight + 5;
            }, 0);
        setPlaceholderProps({
            clientHeight,
            clientWidth,
            clientY: clientY - 12.5,
            clientX: parseFloat(window.getComputedStyle(droppableDOM).paddingLeft),
            droppableId: update.destination.droppableId,
        });
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                {props.board.error ? (
                    <TryAgain getData={() => props.getBoardById(params)} errorMessage={props.board.error} />
                ) : (
                    <>
                        {props.board.isFetching && <Spinner />}
                        {(props.list.error || props.card.error) && (
                            <Error error={props.list.error ? props.list.error : props.card.error} />
                        )}
                        <div className={styles.containerHeader}>
                            {!isRenameBoard && (
                                <span onDoubleClick={showRenameBoard}>{props.board.currentBoard.name}</span>
                            )}
                            {isRenameBoard && (
                                <RenameBoardForm
                                    close={() => changeRenameBoard(false)}
                                    onSubmit={changeBoardName}
                                    name={props.board.currentBoard.name}
                                />
                            )}
                            <div className={styles.menuContainer} onClick={() => changeBoardMenu(!isBoardMenu)}>
                                <span></span>
                                <span className={styles.dots}>...</span>
                                <span className={styles.menu}>Show menu</span>
                            </div>
                            {isBoardMenu && (
                                <BoardMenu
                                    close={() => changeBoardMenu(false)}
                                    deleteBoard={deleteBoard}
                                    canRemove={props.board.currentBoard.user === props.user.userId}
                                />
                            )}
                        </div>
                        {props.list.isFetching || (props.card.isFetching && <Spinner />)}
                        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                            <div className={styles.listsContainer}>
                                {getLists()}
                                <CreateListForm onSubmit={createList} />
                            </div>
                        </DragDropContext>
                    </>
                )}
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        board: state.boards,
        list: state.list,
        card: state.card,
    };
};

const mapDispatchToProps = {
    getBoardById: getBoardById,
    renameBoard: boardRename,
    boardDelete: boardDelete,
    listCreate: listCreate,
    replaceCard: replaceCard,
    replaceCardInList: replaceCardInList,
};

export default fp.flow(withRouter, connect(mapStateToProps, mapDispatchToProps))(BoardPage);
