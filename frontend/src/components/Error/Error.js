import React from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../../redux/actions';
import styles from './Error.module.sass';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';

const Error = (props) => {
    return (
        <div className={styles.errorContainer} onClick={() => props.clearErrors()}>
            {props.error}
        </div>
    );
};

const mapDispatchToProps = {
    clearErrors: clearErrors,
};

export default connect(null, mapDispatchToProps)(Error);

Error.defaultProps = {
    error: ERROR_MESSAGES.default,
};
