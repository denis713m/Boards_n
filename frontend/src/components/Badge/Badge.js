import React from 'react';
import ColorHash from 'color-hash';
import styles from './Badge.module.sass';

const Badge = (props) => {
    console.log(props)
    const nameColor = (name) => {
        const colorHash = new ColorHash();
        return colorHash.hex(name);
    };
    return <div className={props.badgeStyle} style={{backgroundColor:`${nameColor(props.name)}`}}>
        {props.name.substring(0,1)}
    </div>;
};

Badge.defaultProps={
    badgeStyle: styles.badge,
    name: 'A'
}
export default Badge;
