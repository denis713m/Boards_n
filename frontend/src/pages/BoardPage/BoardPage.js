import React, { useState, useEffect } from 'react';
import styles from './BoardPage.module.sass';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import fp from 'lodash/fp';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from '../../components/Header/Header';
import { getBoardById, boardRename, boardDelete, listCreate, replaceCard } from '../../redux/actions';
import RenameBoardForm from '../../components/RenameBoardForm/RenameBoardForm';
import CreateListForm from '../../components/CreateListForm/CreateListForm';
import Spinner from '../../components/Spinner/Spinner';
import CardsList from '../../components/CardsList/CardsList';
import BoardMenu from '../../components/BoardMenu/BoardMenu';
import TryAgain from '../../components/TryAgain/TryAgain';

const BoardPage = (props) => {
    const params = Number(useParams().id);
    useEffect(() => {
        props.getBoardById(params);
    }, []);
    let baseInfo;
    if (props.user)
        baseInfo = {
            board: params,
            user: props.user.userId,
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
            id: props.board.id,
            author: props.user.userId,
        });
        changeRenameBoard(false);
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
        });
    };
    const getLists = () => {
        return props.lists.map((element) => (
            <CardsList list={element} key={element.id} placeholderProps={placeholderProps} />
        ));
    };

    const showRenameBoard = () => {
        if (props.board.user === props.user.userId) changeRenameBoard(true);
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        } else if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        } else {
            props.replaceCard({
                cardId: result.draggableId,
                newListId: destination.droppableId,
                oldListId: source.droppableId,
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
        const domQuery = `[${queryAttr}='${id}']`;
        const DOM = document.querySelector(domQuery);    
        return DOM;
      };
    const onDragUpdate = (update) => {
        
        if (!update.destination) {
            return;
        }
        const destinationIndex = update.destination.index;

        const draggedDOM = getDom(update.draggableId, queryAttrDraggable);
        const droppableDOM = getDom(update.destination.droppableId, queryAttrDroppable);
        if (!draggedDOM) {
            return;
        }
        const { clientHeight, clientWidth } = draggedDOM;

        const clientY =
            parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
            [...droppableDOM.children].slice(0, destinationIndex).reduce((total, curr) => {
                return total + curr.clientHeight + 5;
            }, 0);
        setPlaceholderProps({
            clientHeight,
            clientWidth,
            clientY: clientY - 12.5,
            clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
            droppableId: update.destination.droppableId,
        });
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                {props.isFetching ? (
                    <Spinner />
                ) : props.error ? (
                    <TryAgain getData={() => props.getBoardById(params)} />
                ) : (
                    <>
                        <div className={styles.containerHeader}>
                            {!isRenameBoard && <span onDoubleClick={showRenameBoard}>{props.board.name}</span>}
                            {isRenameBoard && (
                                <RenameBoardForm
                                    close={() => changeRenameBoard(false)}
                                    onSubmit={changeBoardName}
                                    name={props.board.name}
                                />
                            )}
                            <div className={styles.menuContainer} onClick={() => changeBoardMenu(!isBoardMenu)}>
                                <span></span>
                                <span className={styles.dots}>...</span>
                                <span className={styles.menu}>Show menu</span>
                            </div>
                            {isBoardMenu && (
                                <BoardMenu close={() => changeBoardMenu(false)} deleteBoard={deleteBoard} />
                            )}
                        </div>
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
        board: state.boards.currentBoard,
        lists: state.list.lists,
        isFetching: state.boards.isFetching,
        error: state.boards.error,
    };
};

const mapDispatchToProps = {
    getBoardById: getBoardById,
    renameBoard: boardRename,
    boardDelete: boardDelete,
    listCreate: listCreate,
    replaceCard: replaceCard,
};

export default fp.flow(withRouter, connect(mapStateToProps, mapDispatchToProps))(BoardPage);
