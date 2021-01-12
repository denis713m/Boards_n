import React, { useState } from 'react';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import { mdiChatOutline, mdiClose } from '@mdi/js';
import Activity from '../Activity/Activity';
import CreateCommentForm from '../CreateCommentForm/CreateCommentForm';
import { createComment, addDescription } from '../../redux/actions';
import { ADD_COMMENT } from '../../utils/activityTypes';
import styles from './CardWindow.module.sass';
import CreateDescriptionForm from '../CreateDescriptionForm/CreateDescriptionForm';

const CardWindow = (props) => {
    const [isShowDetails, showDetails] = useState(true);
    const [isCreateDescriptionForm, showCreateDescriptionForm] = useState(false);
    const getActivities = () => {
        const cardActivities = props.activities.filter((item) => item.cardId === props.currentCard.id);
        return cardActivities.map((item) => <Activity key={item.id} item={item} cardWindow={true} />);
    };
    const getComments = () => {
        const cardComments = props.activities.filter(
            (item) => item.activity.type === ADD_COMMENT && item.cardId === props.currentCard.id
        );
        return cardComments.map((item) => <Activity key={item.id} item={item} cardWindow={true} />);
    };
    const saveComment = (values) => {
        props.createComment({
            comment: values.name,
            name: props.currentCard.name,
            user: props.currentCard.userId,
            board: props.currentCard.boardId,
            authorInfo: {
                name: props.currentCard.userName,
                email: props.currentCard.userEmail,
            },
            cardId: props.currentCard.id,
        });
    };
    const addDescription = (values) => {
        props.addDescription({
            card: props.currentCard.id,
            description: values.name,
            user: props.currentCard.userId,
        });
        showCreateDescriptionForm(false);
    };
    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleContainer}>
                        <img src={'/card.jpg'} className={styles.icon}></img>
                        <h3 className={styles.title}>{props.currentCard.name}</h3>
                        <div className={styles.listDescription}>
                            <span>in list </span>
                            <span className={styles.listName}> {props.currentCard.listName} </span>
                        </div>
                    </div>
                    <div type='button' className={styles.btnClose} onClick={props.close}>
                        <Icon path={mdiClose} size={1} />
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.mainContainer}>
                        {props.currentCard.description ? (
                            <span className={styles.editDescription}>{props.currentCard.description}</span>
                        ) : isCreateDescriptionForm ? (
                            <CreateDescriptionForm
                                onSubmit={addDescription}
                                close={() => showCreateDescriptionForm(false)}
                            />
                        ) : (
                            <div
                                className={styles.descriptionContainer}
                                onClick={() => showCreateDescriptionForm(true)}
                            >
                                <img src={'/descript.jpg'} className={styles.iconDescript}></img>
                                <span className={styles.editDescription}>Edit the discription</span>
                            </div>
                        )}
                        <div className={styles.commentHeaderContainer}>
                            <Icon path={mdiChatOutline} size={1} className={styles.commentIcon} />
                            <h3 className={styles.title}>Add comment</h3>
                        </div>
                        <div className={styles.commentContainer}>
                            <div className={styles.badge}>{props.currentCard.userName.substring(0, 1)}</div>
                            <CreateCommentForm onSubmit={saveComment} />
                        </div>
                        <div className={styles.activityPanel}>
                            <div className={styles.activityHeader}>
                                <img src={'/activity.jpg'} className={styles.icon}></img>
                                <h3 className={styles.title}>Activity</h3>
                            </div>
                            <div className={styles.activityDetailsMenu} onClick={() => showDetails(!isShowDetails)}>
                                {isShowDetails ? 'Hide Details' : 'Show Details'}
                            </div>
                        </div>
                        <div className={styles.activityDetailsItem}>
                            {isShowDetails ? getActivities() : getComments()}
                        </div>
                    </div>
                    <div className={styles.asideContainer}>
                        <div className={styles.asideTitle}>Actions</div>
                        <button className={styles.asideButton} onClick={props.remove}>
                            <img src={'/remove.jpg'} className={styles.iconDescript}></img>
                            <span>Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        currentCard: state.card.currentCard,
        activities: state.boards.activities,
    };
};

const mapDispatchToProps = {
    createComment: createComment,
    addDescription: addDescription,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardWindow);
