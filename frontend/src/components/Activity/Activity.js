import React from 'react';
import * as activityType from '../../utils/activityTypes';
import { timeDifference } from '../../utils/functions';
import styles from './Activity.module.sass';

const Activity = (props) => {
    const { item } = props;
    const action = () => {
        switch (item.activity.type) {
            case activityType.CREATE_LIST: {
                return [
                    <span className={props.action}> created list </span>,
                    <span className={props.card}>{item.activity.list}</span>,
                ];
            }
            case activityType.DELETE_LIST: {
                return [
                    <span className={props.action}> deleted list </span>,
                    <span className={props.card}>{item.activity.list}</span>,
                ];
            }
            case activityType.RENAME_LIST: {
                return [
                    <span className={props.action}> rename list </span>,
                    <span className={props.card}>{item.activity.list}</span>,
                    <span className={props.action}> to </span>,
                    <span className={props.card}>{item.activity.newName}</span>,
                ];
            }
            case activityType.CREATE_CARD:
                const activities = [];
                activities.push(
                    <span className={props.action}>{props.cardWindow ? ' created this card' : ' added card'} </span>
                );
                if (!props.cardWindow) activities.push(<span className={props.card}>{item.activity.card}</span>);
                return [
                    ...activities,
                    <span className={props.action}> {props.cardWindow ? ' in list' : ' to list'} </span>,
                    <span className={props.card}>{item.activity.list}</span>,
                ];
            case activityType.DELETE_CARD: {
                return [
                    <span className={props.action}> deleted card </span>,
                    <span className={props.card}>{item.activity.card}</span>,
                    <span className={props.action}> in list </span>,
                    <span className={props.card}>{item.activity.list}</span>,
                ];
            }
        }
    };
    return (
        <div className={props.activityItem}>
            <div className={props.badge}>{item.authorInfo.name.substring(0, 1)}</div>
            <div className={props.description}>
                <span className={props.author}>{item.authorInfo.email}</span>
                {action()}
                <div className={props.time}>{timeDifference(item.time)}</div>
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
    action: styles.action
}

export default Activity;
