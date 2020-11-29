import React from 'react';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import { mdiChatOutline, mdiClose } from '@mdi/js';
import Badge from '../Badge/Badge';
import styles from './CardWindow.module.sass';

const CardWindow = (props) => {
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
                        <div className={styles.descriptionContainer}>
                            <img src={'/descript.jpg'} className={styles.iconDescript}></img>
                            <span className={styles.editDescription}>Edit the discription</span>
                        </div>
                        <div className={styles.commentHeaderContainer}>
                            <Icon path={mdiChatOutline} size={1} className={styles.commentIcon} />
                            <h3 className={styles.title}>Add comment</h3>
                        </div>
                        <div className={styles.commentContainer}>
                            <Badge name={props.currentCard.userName} />
                            <div className={styles.commentField}> Write a comment... </div>
                        </div>
                        <button className={styles.btnSaveComment}>Save</button>
                        <div className={styles.activityPanel}>
                            <div className={styles.activityHeader}>
                                <img src={'/activity.jpg'} className={styles.icon}></img>
                                <h3 className={styles.title}>Activity</h3>
                            </div>
                            <div className={styles.activityDetailsMenu}>Hide Details</div>
                        </div>
                        <div className={styles.activityDetailsItem}>
                            <Badge />
                            <div className={styles.activityDescription}>
                                <div>
                                    <span className={styles.activityAuthor}>{props.currentCard.userEmail} </span>
                                    <span className={styles.activityDescription}>added this card to Queue</span>
                                </div>
                                <div className={styles.activityTime}>5 hours ago</div>
                            </div>
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
    return { currentCard: state.card.currentCard };
};

export default connect(mapStateToProps)(CardWindow);
