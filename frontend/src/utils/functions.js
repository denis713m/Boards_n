import moment from 'moment';

export const timeDifference = (date) => {
    const diff = moment.duration(moment().diff(moment(date, 'YYYY-MM-DD HH:mm')));
    if (diff.get('months') !== 0) return date;
    else if (diff.get('days') !== 0) return `${diff.get('days')} days ago`;
    else if (diff.get('hours') !== 0) return `${diff.get('hours')} hours ago`;
    else return 'less than one hour';    
};
