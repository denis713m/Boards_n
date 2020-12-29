import React, {useState,useEffect} from 'react';
import Header from '../../components/Header/Header';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import styles from './HomePage.module.sass'; 
import Icon from '@mdi/react'
import { mdiAccountOutline } from '@mdi/js';
import CreateBoardForm from '../../components/CreateBoardForm/CreateBoardForm';
import { boardCreate, getBoards } from '../../redux/actions';


const HomePage = (props) => {
    const [isCreateBoardOpen, setboardCreate] = useState(false);
    useEffect(() => {
         props.getBoards(props.user.userId);
      }, []);
    const openCreationPanel = () => {
        setboardCreate(true);
    }


    const closeCreationPanel = ()=> {
        setboardCreate(false);
    }

    const handleSubmit = values => {
        props.createBoard({name:values.name,
                            user:props.user.userId})
        closeCreationPanel();
    };

    const showBoards = () =>{
        return props.boards.boards.map((element) => (
            <Link key={element.id} className={styles.board} to={`/board/${element.id}`}>
                {element.name}
            </Link>
        ));
    }

    return (
        <>
            <Header/>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <Icon path={mdiAccountOutline}
                            title="User Profile"
                            size={1}
                            className={styles.icon}/>
                    <p>Personal Boards</p>
                </div>
                <div className={styles.boardsContainer}>
                    {showBoards()}
                    <div className={styles.newBoard} onClick={openCreationPanel}>
                        Create new board...
                    </div>
                </div>
                {isCreateBoardOpen && <CreateBoardForm close={closeCreationPanel} onSubmit={handleSubmit}/>}
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {user: state.user.user,
            boards: state.boards};
};

const mapDispatchToProps = {
    createBoard: boardCreate,
    getBoards: getBoards
    
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
