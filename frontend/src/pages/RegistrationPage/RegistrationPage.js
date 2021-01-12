import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import fp from 'lodash/fp';
import RegistrationForm from './../../components/RegistrationForm/RegistrationForm.js';
import { Link } from 'react-router-dom';
import styles from './RegistrationPage.module.sass';
import { registerUser } from '../../redux/actions';

const RegistrationPage = (props) => {
    const submit = (values) => {
        props.register({ values: values, history: props.history });
    };

    return (
        <div>
            <Link className={styles.btnSignUp} to={'/login'}>
                Log In
            </Link>
            <div className={styles.mainContainer}>
                <div className={styles.formHeader}>REGISTER YOUR ACCOUNT</div>
                <RegistrationForm onSubmit={submit} />
            </div>
        </div>
    );
};


const mapDispatchToProps = {
    register: registerUser,
};

export default fp.flow(withRouter, connect(null, mapDispatchToProps))(RegistrationPage);
