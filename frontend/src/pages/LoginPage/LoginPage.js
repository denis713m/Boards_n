import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import fp from 'lodash/fp';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import { login } from '../../redux/actions';
import Spinner from '../../components/Spinner/Spinner';
import styles from './LoginPage.module.sass';

const LoginPage = (props) => {
    const submit = (values) => {
        props.login({ values: values, history: props.history });
    };

    return (
        <div>
            <Link className={styles.btnSignUp} to={'/register'}>
                Registrartion
            </Link>
            {props.isFetching && <Spinner />}
            <div className={styles.mainContainer}>
                <div className={styles.formHeader}>LOGIN TO YOUR ACCOUNT</div>
                <LoginForm onSubmit={submit} />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return state.user;
};
const mapDispatchToProps = {
    login: login,
};

export default fp.flow(withRouter, connect(mapStateToProps, mapDispatchToProps))(LoginPage);
