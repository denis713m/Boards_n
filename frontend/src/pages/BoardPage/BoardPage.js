import React, { useState, useEffect } from 'react';
import styles from './BoardPage.module.sass';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fp from 'lodash/fp';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from '../../components/Header/Header';
import { getBoardById, boardRename, boardDelete, listCreate, replaceCard } from '../../redux/actions';
import RenameBoardForm from '../../components/RenameBoardForm/RenameBoardForm';
import CreateListForm from '../../components/CreateListForm/CreateListForm';
import Spinner from '../../components/Spinner/Spinner';
import CardsList from '../../components/CardsList/CardsList';
import BoardMenu from '../../components/BoardMenu/BoardMenu';

const BoardPage = (props) => {
    const params = props.location.pathname.substring(7);
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
        return props.lists.map((element) => <CardsList list={element} key={element.id} />);
    };

    const showRenameBoard = () => {
        if (props.board.user === props.user.userId) changeRenameBoard(true);
    };

    const onDragEnd = (result) => {
        console.log(result);
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
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                {props.isFetching ? (
                    <Spinner />
                ) : props.error ? (
                    <div onClick={() => props.getBoardById(params)}> Server error Try again </div>
                ) : (
                    <>
                        {console.log(props)}
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
                        <DragDropContext onDragEnd={onDragEnd}>
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
