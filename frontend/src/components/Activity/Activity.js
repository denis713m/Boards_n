import React from 'react';
import * as activityType from '../../utils/activityTypes';
import { timeDifference } from '../../utils/functions';
import styles from './Activity.module.sass';

const Activity = (props) => {
    const { item } = props;
    const action = () => {
        switch (item.type) {
            case activityType.CREATE_LIST: {
                return [
                    <span className={props.action} key={1}> created list </span>,
                    <span className={props.card} key={2}>{item.List.name}</span>,
                ];
            }
            case activityType.DELETE_LIST: {
                return [
                    <span className={props.action} key={1}> deleted list </span>,
                    <span className={props.card} key={2}>{item.name}</span>,
                ];
            }
            case activityType.RENAME_LIST: {
                return [
                    <span className={props.action} key={1}> rename list </span>,
                    <span className={props.card} key={2}>{item.name}</span>,
                    <span className={props.action} key={3}> to </span>,
                    <span className={props.card} key={4}>{item.List.name}</span>,
                ];
            }
            case activityType.CREATE_CARD:
                const activities = [];
                activities.push(
                    <span className={props.action} key={1}>{props.cardWindow ? ' created this card' : ' added card'} </span>
                );
                if (!props.cardWindow) activities.push(<span className={props.card} key={2}>{item.Card.name}</span>);
                return [
                    ...activities,
                    <span className={props.action} key={3}> {props.cardWindow ? ' in list' : ' to list'} </span>,
                    <span className={props.card} key={4}>{item.List.name}</span>,
                ];
            case activityType.DELETE_CARD: {
                return [
                    <span className={props.action} key={1}> deleted card </span>,
                    <span className={props.card} key={2}>{item.name}</span>,
                    <span className={props.action} key={3}> in list </span>,
                    <span className={props.card} key={4}>{item.List.name}</span>,
                ];
            }
            case activityType.ADD_COMMENT: {
                const activities = [];
                if (!props.cardWindow)
                    activities.push(
                        <span className={props.action} key={1}> commented card </span>,
                        <span className={props.card} key={2}>{item.Card.name}</span>
                    );
                return activities;
            }
            case activityType.REPLACE_CARD:{
                return [
                    <span className={props.action} key={1}> move card </span>,
                    <span className={props.card} key={2}>{item.Card.name}</span>,
                    <span className={props.action} key={3}> from list </span>,
                    <span className={props.card} key={4}>{item.List_sourceList.name}</span>,
                    <span className={props.action} key={5}> to list </span>,
                    <span className={props.card} key={6}>{item.List.name}</span>,
                ];
            }
        }
    };
    return (
        <div className={props.activityItem}>
            <div className={props.badge}>{item.User.name.substring(0, 1)}</div>
            <div className={props.description}>
                <span className={props.author}>{item.User.email}</span>
                {action()}
                <div className={props.time}>{timeDifference(item.time)}</div>
                {(item.type === activityType.ADD_COMMENT) &&
                <div className = {styles.commentContainer}>{item.name}</div>}
            </div>
        </div>
    );
};

Activity.defaultProps = {
    activityItem: styles.activityItem,
    badge: styles.badge,
    description: styles.description,
    author: styles.author,
    time: styles.time,
    card: styles.card,
    action: styles.action,
};

export default Activity;
