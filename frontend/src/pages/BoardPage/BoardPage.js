import React, {useState, useEffect} from 'react';
import styles from './BoardPage.module.sass';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import fp from 'lodash/fp';
import Header from '../../components/Header/Header';
import {getBoardById, boardRename} from '../../redux/actions';
import RenameBoardForm from '../../components/RenameBoardForm/RenameBoardForm';
import Spinner from '../../components/Spinner/Spinner';
import CardsList from '../../components/CardsList/CardsList';

const BoardPage = (props) => {
    useEffect(() => {
        const params = props.location.pathname.substring(7);
        props.getBoardById(params);
      }, []);
    const [isRenameBoard, changeRenameBoard]= useState(false);

    const changeBoardName = (values)=>{
        props.renameBoard({
            ...values,
            id: props.board.id
        })
        changeRenameBoard(false)
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
                        <div>
                            <span></span>
                            <span className={styles.dots}>...</span>
                            <span className={styles.menu}>Show menu</span>
                        </div>
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
    renameBoard: boardRename    
};

export default fp.flow(withRouter,connect(mapStateToProps, mapDispatchToProps))(BoardPage);
