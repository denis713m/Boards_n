import React, {useState, useEffect} from 'react';
import styles from './BoardPage.module.sass';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import fp from 'lodash/fp';
import Header from '../../components/Header/Header';
import {getBoardById, boardRename, boardDelete} from '../../redux/actions';
import RenameBoardForm from '../../components/RenameBoardForm/RenameBoardForm';

import Spinner from '../../components/Spinner/Spinner';
import CardsList from '../../components/CardsList/CardsList';
import BoardMenu from '../../components/BoardMenu/BoardMenu';

const BoardPage = (props) => {
    const params = props.location.pathname.substring(7);
    useEffect(() => {        
        props.getBoardById(params);
      }, []);
    const [isRenameBoard, changeRenameBoard]= useState(false);
    const [isBoardMenu, changeBoardMenu]= useState(false);


    const changeBoardName = (values)=>{
        props.renameBoard({
            ...values,
            id: props.board.id
        })
        changeRenameBoard(false)
    }

    const deleteBoard = () =>{        
        props.boardDelete({
            id: params,
            author: props.user.userId,
            history: props.history
        })
    }



    return (
        <>
            <Header/>
            <div className={styles.container}>
            {
                props.isFetching ?

                    <Spinner/>

                :
                <>
                    <div className={styles.containerHeader}>
                        {!isRenameBoard && <span onDoubleClick={() => changeRenameBoard(true)}>{props.board.name}</span>}                             
                        {isRenameBoard && 
                            <RenameBoardForm close={() => changeRenameBoard(false)} 
                                                    onSubmit={changeBoardName} name={props.board.name}/>}
                        <div className={styles.menuContainer} onClick={()=> changeBoardMenu(!isBoardMenu)} >
                            <span></span>
                            <span className={styles.dots}>...</span>
                            <span className={styles.menu}>Show menu</span>
                        </div>
                        {isBoardMenu && <BoardMenu close={() => changeBoardMenu(false)} 
                                                    deleteBoard={deleteBoard}/>}
                    </div>
                    <div className={styles.listsContainer}>
                        <CardsList/>
                        <CardsList/>
                                              
                    </div>

                </>
            }


            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {user: state.user.user,
            board: state.boards.currentBoard,
            isFetching: state.boards.isFetching
        };
};

const mapDispatchToProps = {
    getBoardById: getBoardById,
    renameBoard: boardRename,
    boardDelete: boardDelete,    
};

export default fp.flow(withRouter,connect(mapStateToProps, mapDispatchToProps))(BoardPage);
