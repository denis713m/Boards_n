import React, { useState, useEffect } from 'react';
import styles from './BoardPage.module.sass';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fp from 'lodash/fp';
import Header from '../../components/Header/Header';
import { getBoardById, boardRename, boardDelete, listCreate } from '../../redux/actions';
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
            board: params,
            user: props.user.userId,
        });
    };
    const getLists = () => {
        const lists = [];
        if (props.lists)
            props.lists.forEach((element) => {
                lists.push(<CardsList list={element} key={element.id} />);
            });
        return lists;
    };

    const showRenameBoard = () => {
        if (props.board.user === props.user.userId) changeRenameBoard(true);
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                {props.isFetching ? (
                    <Spinner />
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
                        <div className={styles.listsContainer}>
                            {getLists()}
                            <CreateListForm onSubmit={createList} />
                        </div>
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
    };
};

const mapDispatchToProps = {
    getBoardById: getBoardById,
    renameBoard: boardRename,
    boardDelete: boardDelete,
    listCreate: listCreate,
};

export default fp.flow(withRouter, connect(mapStateToProps, mapDispatchToProps))(BoardPage);
